<template>
  <div class="publish">
    <video ref="srcvideo" webkit-playsinline="true" playsinline="true"></video>
    <el-button type="danger" @click="setup" ref="start">开始</el-button>
    <el-button type="danger" @click="stop">结束 </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawArray: [],
      ctx: null,
      recordedBlobs: undefined,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { width: 400, height: 600 },
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

      // this.recorder.onstop = () => {

      // };
    },
    stop() {
      this.recorder.ondataavailable = (e) => {
        // if (e.data && e.data.size > 0) {
        //   this.recordedBlobs = e.data;
        // }
        let url = URL.createObjectURL(e.data);
        let link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.download = "1111111.mp4";
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
</style>
</style>