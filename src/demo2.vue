<template>
  <div class="publish">
    <a id="downLoadLink" style="display: none"></a>
    <video ref="video"></video>
    <el-button type="primary" @click="recordOrStop">视频录制</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaStreamTrack: {},
      video_stream: "",
      recordedBlobs: [],
      isRecord: false,
    };
  },
  mounted() {
    this.getCamera();
  },
  methods: {
    getCamera() {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.mediaStreamTrack =
            typeof stream.stop === "function" ? stream : stream.getTracks()[0];
          this.video_stream = stream;
          this.$refs.video.srcObject = stream;
          this.$refs.video.play();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    recordOrStop() {
      if (this.isRecord) {
        this.stop();
      } else {
        this.record();
      }
    },
    record() {
      console.log("record");
      this.isRecord = !this.isRecord;
      let mediaRecorder;
      let options;
      this.recordedBlobs = [];
      if (typeof MediaRecorder.isTypeSupported === "function") {
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
        mediaRecorder = new MediaRecorder(this.video_stream, options);
      } else {
        console.log("当前不支持isTypeSupported，使用浏览器的默认编解码器");
        mediaRecorder = new MediaRecorder(this.video_stream);
      }
      mediaRecorder.start();
      mediaRecorder.ondataavailable = (e) => {
        console.log(e);
        if (e.data && e.data.size > 0) {
          this.recordedBlobs.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedBlobs, { type: "video/mp4" });
        this.recordedBlobs = [];
        const videoUrl = window.URL.createObjectURL(blob);
        document.getElementById("downLoadLink").href = videoUrl;
        document.getElementById("downLoadLink").download = "media.mp4";
        document.getElementById("downLoadLink").innerHTML =
          "DownLoad video file";
        const rand = Math.floor(Math.random() * 1000000);
        const name = `video${rand}.mp4`;
        document.getElementById("downLoadLink").setAttribute("download", name);
        document.getElementById("downLoadLink").setAttribute("name", name);
        setTimeout(() => {
          document.getElementById("downLoadLink").click();
        }, 500);
      };
    },

    stop() {
      this.isRecord = !this.isRecord;
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

<style lang="less" scoped>
.publish {
  color: #fff;
  video {
    width: 100%;
    height: 60vh;
  }
}
</style>
