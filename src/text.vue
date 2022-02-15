<template>
  <div>
    <div class="add_upload_imgBox float_left">
      <div
        class="add_upload_imgDiv float_left"
        v-for="(item, index) in imgs"
        :key="item.id + index"
      >
        <img :src="item.base64" />
        <!-- <p class="add_upload_close" @click="handleDeleteImage(item.id)"></p> -->
      </div>

      <div class="add_upload float_left">
        <button class="add_upload_button">
          选择文件
          <!-- <input
            id="upfile"
            type="file"
            accept="image/*"
            class="add_upload_file"
            @change="fileUpload"
          /> -->
          <!-- capture="camera" -->
          <input
            ref="filElem"
            id="upfile"
            type="file"
            accept="video/*"
            class="add_upload_file"
            capture="camcorder"
            @change="fileUpload"
          />

          <input
            type="submit"
            name="Submit"
            value="点击我,让文本框获取焦点，同时触发onchange事件"
            @click="clickMe()"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "text",
  data() {
    return {
      imgs: [],
    };
  },
  methods: {
    clickMe() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click')) 
    },

    fileUpload() {
      let that = this;
      let file = document.getElementById("upfile");
      let fileName = file.value;
      let files = file.files;
      console.log(files[0]);
      if (fileName == null || fileName == "") {
        alert("请选择文件");
      } else {
        let fileType = fileName.substr(fileName.length - 4, fileName.length);
        // if (fileType == ".jpg" || fileType == "png") {
        if (files[0]) {
          let formData = new window.FormData();
          formData.append("file", files[0]);
          formData.append("mod", 5);
          formData.append("opt", 2);
          //   let data = {
          //     mod: 5,
          //     opt: 2,
          //     formData,
          //   };
          //   fetch("/upload", {
          //     method: "POST",
          //     body: formData,
          //     headers: {
          //       // Auth: 'token'
          //       "Access-Control-Allow-Origin": "*",
          //       Authorization: "Bearer ",
          //     },
          //   })
          //     .then((res) => {
          //       return res.json();
          //     })
          //     .then((res) => {
          //       console.log(res);
          //       if (res.sta == 0) {
          //         // 上传代码返回结果之后
          //         // console.log(res.data)
          //       } else {
          //         console.log(res.msg);
          //       }
          //     });

          let reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = function (e) {
            let timestamp = new Date().valueOf();
            that.imgs.push({ id: timestamp, base64: this.result });
            console.log(that.imgs);
            alert(that.imgs);
          };
        } else {
          alert("请选择要上传的图片");
        }
        // } else {
        //   alert("上传文件类型错误！");
        // }
      }
    },

    handleDeleteImage(id) {
      let that = this;
      MessageBox.confirm("确定删除该图片吗?").then((action) => {
        console.log(action);
        if (action == "confirm") {
          deleteImage();
        }
      });
      function deleteImage() {
        for (let i = 0; i < that.imgs.length; i += 1) {
          if (that.imgs[i].id === id) {
            that.imgs.splice(i, 1);
            break;
          }
        }
      }
    },
  },
};
</script>


<style scoped>
.float_left {
  float: left;
}

.add_upload .add_upload_button {
  position: relative;
  width: 150px;
  height: 40px;
  border: none;
  background: rgb(236, 236, 236);
}
.add_upload .add_upload_icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.add_upload .add_upload_file {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  font-size: 0;
}

.add_upload_imgBox .add_upload_imgDiv {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 10px 10px 0;
}
.add_upload_imgBox .add_upload_imgDiv img {
  width: 100%;
  height: 100%;
}
.add_upload_imgBox .add_upload_close {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.add_upload_imgBox .add_upload_close img {
  width: 100%;
  height: 100%;
}
</style>
