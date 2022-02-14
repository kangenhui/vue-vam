<template>
  <div class="photograph">
    <div class="header">
      <web-cam
        ref="webcam"
        :deviceId="deviceId"
        @started="onStarted"
        @stopped="onStopped"
        @error="onError"
        @cameras="onCameras"
        @camera-change="onCameraChange"
        :isFrontCam="frontCam"
        :debug="true"
        :googleKey="googleKey"
      />
      <span class="title font-weight-light" v-if="device">
        {{ device.label }}
      </span>
    </div>
    <div class="footer">
      <!-- <img :src="img" style="height: 20%; width: 20%" /> -->
      <el-button type="danger" @click="onCapture">确 认 拍 照</el-button>
    </div>
  </div>
</template>

<script>
import WebCam from "./webcam.vue";
import { find, head } from "lodash";
import eventBus from "./goBackEntity.js";

export default {
  name: "photograph",
  components: {
    WebCam,
  },
  data() {
    return {
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
      frontCam: true,
      report: null,
      googleKey: process.env.VUE_APP_OCR_GVA,
      isRecord: false,
    };
  },
  computed: {
    device: function () {
      return find(this.devices, (n) => n.deviceId == this.deviceId);
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      if (typeof window.orientation === "undefined") {
        // Once we have a list select the first one
        let first = head(this.devices);
        if (first) {
          this.camera = first.deviceId;
          this.deviceId = first.deviceId;
        }
      } else {
        this.frontCam = false;
      }
    },
  },
  methods: {
    async sendGVision() {
      const res = await this.$refs.webcam.googleVision();
      this.report = res.labelAnnotations;
    },
    async onCapture() {
      // this.img = await this.$refs.webcam.capture();
      if (this.$route.params.imageType == 1) {
        eventBus.$emit("imagePositive", await this.$refs.webcam.capture());
      } else {
        eventBus.$emit("imgNegative", await this.$refs.webcam.capture());
      }

      this.onStop();

      this.$router.go(-1);
    },
    onStarted(stream) {
      // console.log("On Started Event", stream);
    },
    onStopped(stream) {
      // console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      // console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      // 0前置 1后置
      this.camera =
        this.devices.length == 1
          ? this.devices[0].deviceId
          : this.devices[1].deviceId;
      // console.log("On Cameras Event", this.devices);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      // console.log("On Camera Change Event", deviceId);
    },
    async recordOrStop() {
      if (this.isRecord) {
        // 停止
        this.$refs.webcam.stop();
      } else {
        // 开始
        this.img = await this.$refs.webcam.record();
      }
      this.isRecord = !this.isRecord;
    },
  },
  filters: {
    percent: function (value) {
      if (!value) return "";
      return (Math.floor(value * 10000) / 100).toFixed(0) + "%";
    },
  },
};
</script>
<style lang="scss">
.photograph {
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;

  .header {
    padding: 20px;
    height: 70%;
  }

  .footer {
    height: 10%;
    .el-button {
      width: 80%;
    }
  }
}
</style>
