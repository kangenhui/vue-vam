<template>
  <div class="webcam">
    <video
      ref="video"
      :width="width"
      :height="height"
      :src="source"
      :autoplay="autoplay"
      :playsinline="playsinline"
      muted
    />
  </div>
</template>

<script>
// based from https://github.com/VinceG/vue-web-cam/
import axios from "axios";
import getUserMedia from "getusermedia";

export default {
  name: "vue-cam-vision",
  data() {
    return {
      source: null,
      canvas: null,
      camerasListEmitted: false,
      cameras: [],
      imageCapture: {}, // google image capture
      captures: [],
      imgReport: null,
      lastVideoMode: "deviceId",
      camsList: { back: null, front: null },
      inited: false,
      recordedBlobs: [],
    };
  },
  props: {
    width: {
      type: [Number, String],
      default: "100%",
    },
    height: {
      type: [Number, String],
      default: "400",
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg",
    },
    deviceId: {
      type: String,
      default: null,
    },
    playsinline: {
      type: Boolean,
      default: true,
    },
    mediaConstraints: {
      type: Object,
      default: () => ({
        video: true,
        audio: false,
      }),
    },
    isFrontCam: {
      type: Boolean,
      default: true,
    },
    maxSnapshot: {
      type: [Number],
      default: 3,
    },
    googleKey: {
      type: String,
      default: null,
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    deviceId: function (newId, oldId) {
      if (newId !== oldId) {
        this.changeCamera(newId);
      }
    },
    isFrontCam: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.changeFrontBack(newValue);
      }
    },
    captures: function (value) {
      this.$emit("capturedImages", value);
    },
  },
  computed: {
    // 暂无使用此方法
    supportFacingMode() {
      let result = "";
      // getSupportedConstraints 客户端（user agent）所支持的约束属性（如帧率，窗口大小）。
      if (navigator.mediaDevices.getSupportedConstraints()["facingMode"]) {
        result = "Supported!";
      } else {
        result = "Not supported!";
      }
      return result;
    },

    // MediaDevices.getUserMedia(constraints) constraints参数值(例如：{ audio: true, video: true })
    Contraints() {
      // 传值
      const facingMode =
        this.mediaConstraints.video.facingMode ||
        (this.isFrontCam ? "user" : "environment");
      const video = {
        ...this.mediaConstraints.video,
        ...(this.deviceId
          ? {
              deviceId: { exact: this.deviceId },
            }
          : {}),
        facingMode,
        // 分辨率
        // width: { min: 1024, ideal: 1280, max: 1920 },
        // height: { min: 776, ideal: 720, max: 1080 },
        width: 300,
        height: 150,
      };
      // alert(JSON.stringify(video))
      return {
        video,
        audio: this.mediaConstraints.audio,
      };
    },
  },
  mounted() {
    this.setup();
  },
  methods: {
    loadSrcStream(stream) {
      if ("srcObject" in this.$refs.video) {
        // new browsers api
        try {
          this.$refs.video.srcObject = stream;
        } catch (err) {
          console.log("err==>", err);
        }
      } else {
        // old broswers
        this.source = window.HTMLMediaElement.srcObject(stream);
      }
      this.video.onloadedmetadata = () => {
        this.video.play();
      };
      this.video.play();
      this.$emit("started", stream);
    },
    changeCamera(deviceId) {
      this.stop();
      this.$emit("camera-change", deviceId);
      this.deviceId = deviceId;
      this.loadCamera();
    },
    async loadCameras() {
      try {
        // enumerateDevices 请求一个可用的媒体输入和输出设备的列表，例如麦克风，摄像机，耳机设备等
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        if (this.debug) console.log(deviceInfos);
        deviceInfos.forEach((deviceInfo) => {
          // deviceInfo.kind -> videoinput视频 audioinput音频
          if (deviceInfo.kind === "videoinput") {
            this.cameras.push(deviceInfo);
            // deviceInfo.label 设备名称
            if (deviceInfo.label.toLowerCase().indexOf("back") !== -1) {
              this.camsList.back = deviceInfo;
            }
            if (deviceInfo.label.toLowerCase().indexOf("front") !== -1) {
              this.camsList.front = deviceInfo;
            }
          }
        });

        if (!this.camerasListEmitted) {
          this.$emit("cameras", this.cameras);
          this.camerasListEmitted = true;
        }
      } catch (err) {
        this.$emit("notsupported", err);
        console.log(err);
      }
    },
    stopStreamedVideo(videoElem) {
      const stream = videoElem.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        // stops the video track
        track.stop();
        this.$emit("stopped", stream);
        this.$refs.video.srcObject = null;
        this.source = null;
      });
    },
    // Stop the video
    stop() {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        if (this.debug) console.log("stoping");
        this.stopStreamedVideo(this.$refs.video);
      }
    },
    async setup() {
      await this.loadCameras();
      this.start(); // 开摄像头
    },
    // Start the video
    start() {
      this.loadCamera();
    },
    isMobile() {
      return typeof window.orientation !== "undefined";
    },
    toggleFrontBack() {
      this.isFrontCam = !this.isFrontCam;
    },
    changeFrontBack(newFrontCam) {
      if (newFrontCam && this.camsList.front) {
        this.changeCamera(this.camsList.front.deviceId);
      }
      if (!newFrontCam && this.camsList.back) {
        this.changeCamera(this.camsList.back.deviceId);
      }
    },
    loadCamera() {
      if (this.debug) console.log(this.Contraints);
      getUserMedia(this.Contraints, (err, stream) => {
        if (err) {
          this.$emit("error", err);
          console.log("failed to get user camera");
          return;
        }
        console.log("Got stream", stream);
        if (window.ImageCapture) {
          const mediaStreamTrack = stream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(mediaStreamTrack);
        }
        this.video = this.$refs.video;
        this.loadSrcStream(stream);
      });
    },

    // 拍照
    async capture() {
      // 暂时注释
      // if (window.ImageCapture) {
      //   const gURL = await this.gCapture();
      //   return gURL;
      // }
      this.canvas = this.getCanvas();
      // 获取base64格式 toDataURL具有压缩功能
      const URL = this.canvas.toDataURL(this.screenshotFormat, 0.7);
      let str = URL.replace("data:image/jpeg;base64,", "");
      // let strLength = str.length; // 图片大小
      this.saveSnapShot(URL);
      return URL;
    },
    saveSnapShot(URL) {
      if (this.captures.length > this.maxSnapshot) {
        this.captures.shift();
      }
      this.captures.push({
        image: URL,
        imgReport: {},
      });

      if (this.debug) console.log("saved SnapShot");
      return URL;
    },
    async gCapture() {
      const blob = await this.imageCapture.takePhoto();
      const reader = new FileReader();
      let URL = null;
      return new Promise((resolve, reject) => {
        reader.onerror = (err) => {
          console.error(err);
          reader.abort();
          reject();
        };
        reader.onloadend = () => {
          URL = reader.result;
          this.saveSnapShot(URL);
          if (this.debug) console.log(URL);
          resolve(URL);
        };
        reader.readAsDataURL(blob);
      });
    },
    // 获取画布
    getCanvas() {
      const video = this.$refs.video;
      if (!this.ctx) {
        const canvas = document.createElement("canvas");
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      const { ctx, canvas } = this;
      //  canvas.width canvas.height
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    /* type = 
    'LABEL_DETECTION': Labels can identify objects, locations, activities, animal species, products, and more.
    'TEXT_DETECTION': (OCR TEXT_DETECTION detects and extracts text from any image), 
    'DOCUMENT_TEXT_DETECTION': DOCUMENT_TEXT_DETECTION extracts text from an image; the response is optimized for dense text and documents. The JSON includes page, block, paragraph, word, and break information
    */
    async googleVision(type = "LABEL_DETECTION", index) {
      if (!this.googleKey) {
        // console.log("no google key detected");
        return;
      }
      const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${this.googleKey}`;
      let imgIndex = index;
      if (!index || typeof index === "undefined") {
        imgIndex = this.captures.length - 1;
      }
      const sendData = {
        requests: [
          {
            image: {
              content: this.captures[imgIndex].image.replace(
                "data:image/jpeg;base64,",
                ""
              ),
            },
            features: { type },
          },
        ],
      };
      const { data } = await axios.post(API_URL, sendData);
      if (data && data.responses[0]) {
        this.imgReport = data.responses[0];
        this.captures[imgIndex].imgReport = data.responses[0];
      }
      // if (this.debug) console.log(this.imgReport);
      this.$emit("googleReport", this.imgReport);
      return this.imgReport;
    },

    async record() {
      let options;
      let mediaRecorder;
      this.recordedBlobs = [];
      if (typeof MediaRecorder.isTypeSupported === "function") {
        // 根据浏览器来设置编码参数
        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          options = {
            MimeType: "video/webm;codecs=h264",
          };
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
          options = {
            MimeType: "video/webm;codecs=h264",
          };
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
          options = {
            MimeType: "video/webm;codecs=vp8",
          };
        }
        mediaRecorder = new MediaRecorder(this.$refs.video.srcObject, options);
      } else {
        mediaRecorder = new MediaRecorder(this.$refs.video.srcObject);
      }

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedBlobs.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        console.log("停止录制事件")
        let reader = new FileReader();
        var blob = new Blob(this.recordedBlobs, { type: "video/mp4" });
        // reader.addEventListener("load", () => {
        //   console.log(reader.result);
        //   var strLen = reader.result.length;
        //   alert(strLen - (strLen / 8) * 2);
        // });
        // reader.readAsDataURL(blob);

        // console.log(blob);
        // const link = document.createElement("a");
        // document.body.appendChild(link);
        // link.style.display = "none";
        // const videoUrl = window.URL.createObjectURL(blob);
        // console.log(videoUrl);
        // link.href = videoUrl;
        // link.download = "media - " + format + ".mp4";

        // link.click();
        // link.remove();
      };

      // new File(blob, filename, {type: "video/mp4" , lastModified: Date.now()});
      // return new Promise((resolve, reject) => {  resolve(reader.result);});
    },

    stopVideo() {
      console.log(this.$refs.video.srcObject);
      if (!this.$refs.video.srcObject) return;
      const stream = this.$refs.video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },
  },
};
</script>
<style lang="scss">
</style>