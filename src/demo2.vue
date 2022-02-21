<template>
  <div class="publish">
    <a id="downLoadLink" style="display: none"></a>
    <video ref="video" playsinline="true" webkit-playsinline="true"></video>
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
      navigator.mediaDevices
        .getUserMedia({
          video: { frameRate: { ideal: 10, max: 15 } },
        })
        .then((stream) => {
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
      this.recordedBlobs = [];
      if (typeof MediaRecorder.isTypeSupported === "function") {
        mediaRecorder = new MediaRecorder(this.video_stream, {
          audioBitsPerSecond: 192000,
          videoBitsPerSecond: 10000000,
        });
      } else {
        console.log("当前不支持isTypeSupported，使用浏览器的默认编解码器");
        mediaRecorder = new MediaRecorder(this.video_stream);
      }
      mediaRecorder.start();
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedBlobs.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        let url = URL.createObjectURL(this.recordedBlobs[0]);
        let link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.download = "121.mp4";
        link.click();
        // const blob = new Blob(this.recordedBlobs);
        // this.recordedBlobs = [];
        // const videoUrl = window.URL.createObjectURL(blob);
        // document.getElementById("downLoadLink").href = videoUrl;
        // document.getElementById("downLoadLink").download = "media.mp4";
        // document.getElementById("downLoadLink").innerHTML =
        //   "DownLoad video file";
        // const rand = Math.floor(Math.random() * 1000000);
        // const name = `video${rand}.mp4`;
        // document.getElementById("downLoadLink").setAttribute("download", name);
        // document.getElementById("downLoadLink").setAttribute("name", name);
        // setTimeout(() => {
        //   document.getElementById("downLoadLink").click();
        // }, 500);
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
