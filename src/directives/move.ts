import type { Directive } from 'vue';

// 鼠标拖拽
const vMove: Directive = {
  mounted(el: HTMLElement) {
    const mouseDown = (e: MouseEvent) => {
      const X = e.clientX - el.offsetLeft;
      const Y = e.clientY - el.offsetTop;
      const move = (ev: MouseEvent) => {
        let left = ev.clientX - X;
        let top = ev.clientY - Y;
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        if (left < 0) {
          left = 0;
        } else if (left > windowWidth - el.offsetWidth) {
          left = windowWidth - el.offsetWidth;
        }

        if (top < 0) {
          top = 0;
        } else if (top > windowHeight - el.offsetHeight) {
          top = windowHeight - el.offsetHeight;
        }
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move);
      });
    };
    el.addEventListener('mousedown', mouseDown);
  },
};

export default vMove;
