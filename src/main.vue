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
    </div>
  </div>
</template>

<script>
import eventBus from "./goBackEntity.js";

export default {
  name: "photograph",
  components: {},
  data() {
    return {
      bodyStyle: {
        height: "100px",
      },
      active: 0,
      imgPositive: undefined,
      imgNegative: undefined,
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {
    var self = this;
    this.imgPositive = self.$parent.imgDataOne;
    this.imgNegative = self.$parent.imgDataTwo;
    eventBus.$on("imagePositive", (val) => {
      self.$parent.imgDataOne = val;
    });
    eventBus.$on("imgNegative", (val) => {
      self.$parent.imgDataTwo = val;
    });
  },
  methods: {
    toPhotograph(imageType) {
      // this.$router.push("/photograph");
      this.$router.push({
        name: "photograph",
        params: {
          imageType: imageType,
        },
      });
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
      this.$router.push("/videoRecording");
    },
    base64ToSize(imgUrl) {
      var eqTagIndex = imgUrl.indexOf("=");
      imgUrl = eqTagIndex != -1 ? imgUrl.substring(0, eqTagIndex) : imgUrl;
      var strLen = imgUrl.length;
      return strLen - (strLen / 8) * 2;
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
}
</style>
