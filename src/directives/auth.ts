import type { Directive } from "vue";

// 权限按钮
const vAuth: Directive<HTMLElement, any> = (el, bingding) => {
  let permission = [1, 2, 3];
  if (!permission.includes(bingding.value)) {
    el.style.display = 'none';
  }
};

export default vAuth;
