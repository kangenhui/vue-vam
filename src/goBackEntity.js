
import Vue from 'vue'

/**
 * 定义空的vue实例，作为 goBackEntity实现非父子组件之间的通信(vue2.x中去掉了broadcast)
 */
var goBackEntity = new Vue();
export default goBackEntity;
