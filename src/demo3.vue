<template>
  <div class="photograph">
    <video ref="video"></video>
    <!-- <canvas style="display: none" id="canvasCamera"></canvas> -->
    <el-button type="danger" @click="setImage">确 认 拍 照</el-button>
    <el-button type="danger" ref="ttt" @click="playing">11</el-button>
    <!-- <img :src="imgNegative" style="height: 100px; width: 100px" /> -->
  </div>
</template>

<script>
import eventBus from "./goBackEntity.js";

export default {
  data() {
    return {
      mediaStreamTrack: {},
      video_stream: "",
      canvas: null,
      context: null,
      cameras: [],
      //   imgNegative: undefined,
    };
  },
  mounted() {
    this.loadCameras();
  },
  methods: {
    loadCameras() {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "videoinput") {
              this.cameras.push(device.deviceId);
            }
          });
          this.getCamera();
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    },
    getCamera() {
      let device =
        this.cameras.length === 1 ? this.cameras[0] : this.cameras[1];

      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext("2d");
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { deviceId: { exact: device } },
        })
        .then((stream) => {
          this.mediaStreamTrack =
            typeof stream.stop === "function" ? stream : stream.getTracks()[0];
          this.video_stream = stream;
          this.$refs.video.srcObject = stream;
          // this.$refs.video.onloadedmetadata = () => {
          //   this.$refs.video.play();
          // };
          // this.$refs.video.play();
          this.$refs.ttt.$el.click();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    playing() {
      this.$refs.video.play();
    },

    setImage() {
      const video = this.$refs.video;
      //   this.context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      this.context.drawImage(video, 0, 0, 300, 150);
      const image = this.canvas.toDataURL("image/jpeg");
      //   this.imgNegative = image;
      if (this.$route.params.imageType === 1) {
        eventBus.$emit("imagePositive", image);
      } else {
        eventBus.$emit("imgNegative", image);
      }
      //   关闭摄像头;
      this.$refs.video.srcObject.getTracks()[0].stop();
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
video {
  width: 100%;
  height: 300px;
}
canvas {
  width: 100%;
  height: 300px;
}
</style>
