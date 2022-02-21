<template>
  <div class="container">
    <video ref="srcvideo" webkit-playsinline="true" playsinline="true"></video>
    <el-button type="success" @click="setup" ref="start">开始录制</el-button>
    <el-button type="danger" @click="stop">结束录制</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      navigator.mediaDevices
        .getUserMedia({
          // audio: true,
          video: { width: 600, height: 400 },
        })
        .then((mediaStream) => {
          this.$refs.srcvideo.srcObject = mediaStream;
          this.recorder = new MediaRecorder(mediaStream, {
            autio: false,
            audioBitsPerSecond: 192000,
            videoBitsPerSecond: 10000000,
          });
        });
    },
    setup() {
      this.$refs.srcvideo.play();
      this.recorder.start(); //开始录制
    },
    stop() {
      this.recorder.ondataavailable = (e) => {
        let url = URL.createObjectURL(e.data);
        let link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        const rand = Math.floor(Math.random() * 1000000);
        link.download = `video${rand}.mp4`;
        link.click();
      };
      this.recorder.stop();
      
      if (!this.$refs.srcvideo.srcObject) return;
      const stream = this.$refs.srcvideo.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },
  },
};
</script>
<style lang="less" scoped>
canvas {
  box-shadow: 0 0 10px gray;
  display: block;
}
.container {
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
}
</style>
</style>