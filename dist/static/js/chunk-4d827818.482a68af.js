(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4d827818"],{"0362":function(e,t,n){"use strict";var a=n("2b0e"),r=new a["default"];t["a"]=r},4223:function(e,t,n){},bad1:function(e,t,n){"use strict";n("4223")},e795:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"photograph"},[n("div",{staticClass:"header"},[n("web-cam",{ref:"webcam",attrs:{deviceId:e.deviceId,isFrontCam:e.frontCam,debug:!0,googleKey:e.googleKey},on:{started:e.onStarted,stopped:e.onStopped,error:e.onError,cameras:e.onCameras,"camera-change":e.onCameraChange}}),e.device?n("span",{staticClass:"title font-weight-light"},[e._v(" "+e._s(e.device.label)+" ")]):e._e()],1),n("div",{staticClass:"footer"},[n("el-button",{attrs:{type:"danger"},on:{click:e.onCapture}},[e._v("确 认 拍 照")])],1)])},r=[],i=n("c973"),c=n.n(i),o=n("a34a"),s=n.n(o),d=n("c035"),u=n("2ef0"),f=n("0362"),l={name:"photograph",components:{WebCam:d["a"]},data:function(){return{img:null,camera:null,deviceId:null,devices:[],frontCam:!0,report:null,googleKey:Object({NODE_ENV:"production",BASE_URL:""}).VUE_APP_OCR_GVA,isRecord:!1}},computed:{device:function(){var e=this;return Object(u["find"])(this.devices,(function(t){return t.deviceId==e.deviceId}))}},watch:{camera:function(e){this.deviceId=e},devices:function(){if("undefined"===typeof window.orientation){var e=Object(u["head"])(this.devices);e&&(this.camera=e.deviceId,this.deviceId=e.deviceId)}else this.frontCam=!1}},methods:{sendGVision:function(){var e=this;return c()(s.a.mark((function t(){var n;return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$refs.webcam.googleVision();case 2:n=t.sent,e.report=n.labelAnnotations;case 4:case"end":return t.stop()}}),t)})))()},onCapture:function(){var e=this;return c()(s.a.mark((function t(){return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(1!=e.$route.params.imageType){t.next=8;break}return t.t0=f["a"],t.next=4,e.$refs.webcam.capture();case 4:t.t1=t.sent,t.t0.$emit.call(t.t0,"imagePositive",t.t1),t.next=13;break;case 8:return t.t2=f["a"],t.next=11,e.$refs.webcam.capture();case 11:t.t3=t.sent,t.t2.$emit.call(t.t2,"imgNegative",t.t3);case 13:e.onStop(),e.$router.go(-1);case 15:case"end":return t.stop()}}),t)})))()},onStarted:function(e){},onStopped:function(e){},onStop:function(){this.$refs.webcam.stop()},onStart:function(){this.$refs.webcam.start()},onError:function(e){},onCameras:function(e){this.devices=e,this.camera=1==this.devices.length?this.devices[0].deviceId:this.devices[1].deviceId},onCameraChange:function(e){this.deviceId=e,this.camera=e},recordOrStop:function(){var e=this;return c()(s.a.mark((function t(){return s.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.isRecord){t.next=4;break}e.$refs.webcam.stop(),t.next=7;break;case 4:return t.next=6,e.$refs.webcam.record();case 6:e.img=t.sent;case 7:e.isRecord=!e.isRecord;case 8:case"end":return t.stop()}}),t)})))()}},filters:{percent:function(e){return e?(Math.floor(1e4*e)/100).toFixed(0)+"%":""}}},p=l,h=(n("bad1"),n("2877")),v=Object(h["a"])(p,a,r,!1,null,null,null);t["default"]=v.exports}}]);