import Vue from 'vue';
import indexVue from './index.vue';
import {
  creatElement
} from './heading.js';
import zImg from './z.png';
// import md from './markdown.md';
import './index.css';
const el = creatElement();
document.body.append(el);
const img = new Image();
img.src = zImg;
document.body.append(img)
// document.body.append(md);
console.log('BASE_URL::', BASE_URL);
console.log('COMMON_AUTHOR::', COMMON_AUTHOR);


new Vue({
  el: '#app',
  render: h => h(indexVue)
})