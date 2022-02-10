<template>
  <el-container>
    <el-header>xxxxxxxxxxxxx</el-header>
    <el-main>
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
      <el-button type="success" plain @click="onStart">启用摄像头</el-button>
      <el-button type="info" plain @click="onStop">关闭摄像头</el-button>
      <el-button type="warning" plain @click="onCapture">拍照</el-button>
      <el-button type="primary" plain @click="recordOrStop">录像</el-button>
    </el-main>
    <el-footer>
      <img :src="img" />
      {{ img }}
    </el-footer>
  </el-container>
</template>

<script>
import WebCam from "./webcam.vue";
import { find, head } from "lodash";

export default {
  name: "app",
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
      console.log(res);
      this.report = res.labelAnnotations;
    },
    async onCapture() {
      this.img = await this.$refs.webcam.capture();
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
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
