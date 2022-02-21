<template>
  <div class="container">
    <div class="title">实名认证</div>

    <div class="header">
      <el-steps :active="active" finish-status="success" class="steps">
        <el-step title="上传身份证"></el-step>
        <el-step title="实人检测"></el-step>
        <el-step title="等待结果"></el-step>
      </el-steps>
    </div>

    <div v-if="!isPhoto">
      <div class="middle">
        <el-card class="box-card" shadow="always">
          <div class="card-text" v-if="!imgPositive">
            上传身份证（人面面）
            <el-button
              icon="el-icon-plus"
              circle
              @click="toPhotograph(1)"
            ></el-button>
          </div>
          <div class="card-text" v-else>
            <img :src="imgPositive" @click="toPhotograph(1)" />
          </div>
        </el-card>
        <el-card class="box-card" shadow="always">
          <div class="card-text" v-if="!imgNegative">
            上传身份证（国徽面）
            <el-button
              icon="el-icon-plus"
              circle
              @click="toPhotograph(2)"
            ></el-button>
          </div>
          <div class="card-text" v-else>
            <img :src="imgNegative" @click="toPhotograph(2)" />
          </div>
        </el-card>
      </div>
      <div class="footer">
        <el-button type="primary" @click="toVideo">下一步</el-button>
        <!-- <el-button type="primary" @click="toText">安卓视频</el-button> -->
        <!-- <el-button type="primary" @click="toios">ios视频</el-button> -->
      </div>
    </div>
    <div v-show="isPhoto" class="photo">
      <video ref="video" playsinline="false" webkit-playsinline="false"></video>
      <el-button type="danger" @click="setImage">确 认 拍 照</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "photograph",
  data() {
    return {
      bodyStyle: {
        height: "100px",
      },
      active: 0,
      imgPositive: undefined,
      imgNegative: undefined,
      isPhoto: false,
      isVideo: false,
      front: 0,
      // 拍照
      mediaStreamTrack: {},
      canvas: null,
      context: null,
      cameras: [],
      isPlay: false,
    };
  },
  computed: {},
  watch: {},
  filters: {},
  mounted() {
    this.loadCameras();
  },
  created() {},
  methods: {
    toPhotograph(imageType) {
      if (!this.isPlay) {
        console.log("play()执行")
        this.$refs.video.play();
        this.isPlay = true;
      }
      this.isPhoto = true;
      this.front = imageType;
    },
    toText() {
      this.$router.push("/demo2");
    },
    toios() {
      this.$router.push("/cameraCanvas");
    },
    toVideo() {
      if (this.imgNegative == undefined || this.imgNegative == undefined) {
        this.$message.error("请完成当前操作");
        return;
      }
      if (
        this.base64ToSize(this.imgNegative) > 1048576 ||
        this.base64ToSize(this.imgPositive) > 1048576
      ) {
        this.$message.error("图片大小超过1MB,请重新拍照上传");
      }
      this.activa = 1;
      this.isPlay = false;
      this.stopPhoto();
      this.$router.push("/cameraCanvas");
    },

    base64ToSize(imgUrl) {
      var eqTagIndex = imgUrl.indexOf("=");
      imgUrl = eqTagIndex != -1 ? imgUrl.substring(0, eqTagIndex) : imgUrl;
      var strLen = imgUrl.length;
      return strLen - (strLen / 8) * 2;
    },

    // -----------------------拍照----------------------------
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
          this.$refs.video.srcObject = stream;
          this.$refs.video.play();
        })
        .catch((err) => {
          console.log(err);
        });
        console.log("相机加载完毕")
    },
    setImage() {
      const video = this.$refs.video;
      this.context.drawImage(video, 0, 0, 300, 150);
      const image = this.canvas.toDataURL("image/jpeg");
      if (this.front === 1) {
        this.imgPositive = image;
      } else {
        this.imgNegative = image;
      }
      this.isPhoto = false;
    },
    stopPhoto() {
      this.$refs.video.srcObject.getTracks()[0].stop();
    },
  },
};
</script>
<style lang="scss">
body {
  margin: 0;
  height: 100%;
  width: 100%;
  position: fixed;
}

img {
  // width: auto;
  // height: auto;
  // max-width: 100%;
  // max-height: 100%;
  width: 100%;
  height: 100%;
  display: block;
}

.container {
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  .title {
    color: black;
    height: 30px;
  }

  .header {
    height: 10%;
    padding: 20px;
    text-align: initial;

    .el-step__title {
      font-size: 10px;
      line-height: 28px;
    }
  }

  .middle {
    width: 100%;
    height: 60%;
    display: inline-block;
    vertical-align: middle;

    .box-card {
      width: 90%;
      display: inline-block;
      vertical-align: middle;
      margin: 10px;
      background-color: #409eff;

      .card-text {
        font-size: 13px;
        color: white;
        height: 120px;
        line-height: 120px;

        .el-button {
          margin-left: 20px;
        }
      }
    }
  }

  .footer {
    height: 10%;
    .el-button {
      width: 80%;
    }
  }

  .photo {
    height: 55%;
    width: 100%;

    video {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
