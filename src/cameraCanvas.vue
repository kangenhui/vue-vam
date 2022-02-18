<template>
  <div class="publish">
    <video ref="srcvideo" style="display: none"></video>
    <canvas
      ref="canvas"
      id="canvas"
      height="460"
      width="640"
      style="width: 640px; margin: auto"
    ></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawArray: [],
      ctx: null,
    };
  },
  mounted() {
    // const oScript = document.createElement("script");
    // oScript.type = "text/javascript";
    // oScript.src = "https://api.html5media.info/1.2.2/html5media.min.js";
    // document.body.appendChild(oScript);

    this.init();
  },
  methods: {
    init() {
      this.ctx = this.$refs.canvas.getContext("2d");
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { width: 400, height: 600 },
        })
        .then((mediaStream) => {
          this.$refs.srcvideo.srcObject = mediaStream;
          this.$refs.srcvideo.play();
          this.playCanvas();

          var recorder = new MediaRecorder(mediaStream, {
            audioBitsPerSecond: 192000,
            videoBitsPerSecond: 10000000,
          });
          recorder.start(); //开始录制
          recorder.ondataavailable = (event) => {
            console.log(event);
            let url = URL.createObjectURL(event.data);
            let link = document.createElement("a");
            link.href = url;
            document.body.appendChild(link);
            link.download = "media.mp4";
            link.click();
          };
          setTimeout(() => {
            recorder.stop(); //录制结束
          }, 5000);
        });
    },

    playCanvas() {
      this.ctx.drawImage(this.$refs.srcvideo, 0, 0, 640, 460);

      requestAnimationFrame(() => {
        this.playCanvas();
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