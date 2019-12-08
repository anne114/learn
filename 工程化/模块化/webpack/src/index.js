import {
  creatElement
} from './heading.js';
import zImg from './z.png'
const el = creatElement();
document.body.append(el);
const img = new Image();
img.src = zImg;
document.body.append(img)