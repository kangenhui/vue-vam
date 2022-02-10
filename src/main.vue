<template>
  <div class="container">
    <div class="title">实名认证</div>

    <div class="header">
      <el-steps :active="0" finish-status="success" class="steps">
        <el-step title="上传身份证"></el-step>
        <el-step title="实人检测"></el-step>
        <el-step title="等待结果"></el-step>
      </el-steps>
    </div>

    <div class="middle">
      <el-card class="box-card" shadow="always">
        <div class="card-text">
          上传身份证（人面面）
          <el-button
            icon="el-icon-plus"
            circle
            @click="toPhotograph"
          ></el-button>
        </div>
      </el-card>
      <el-card class="box-card" shadow="always">
        <div class="card-text">
          上传身份证（国徽面）
          <el-button icon="el-icon-plus" circle></el-button>
        </div>
      </el-card>
    </div>

    <div class="footer">
      <el-button type="primary" @click="toVideo">下一步</el-button>
      <!-- <router-link to="/demo">
        <span class="spanfour">link跳转</span>
      </router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "photograph",
  components: {},
  data() {
    return {
      bodyStyle: {
        height: "100px",
      },
      imgPositive: undefined,
      imgNegative: undefined,
    };
  },
  computed: {},
  watch: {},
  filters: {},

  methods: {
    toPhotograph() {
      // console.log("00000", this.$router);
      window.location.href = "https://www.baidu.com/";
    },
    toVideo() {
      if (this.imgNegative == undefined || this.imgNegative == undefined) {
        this.$message.error("请完成当前操作");
        return;
      }
      alert("跳转视频");
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
