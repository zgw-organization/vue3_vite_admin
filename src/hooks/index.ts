import { onMounted } from 'vue';

// 自定义hooks 类似于mixins  hooks是一个函数
// 转化TZ时间格式
export const useFormatDate = (time: string) => {
  const date = new Date(Date.parse(time));
  const YY = date.getFullYear() + '-';
  const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + ' ' + hh + mm + ss;
};

// 将图片转化为base64
export const useImgToBase64 = (options: { el: string }): Promise<{ baseUrl: string }> => {
  return new Promise((resolve) => {
    onMounted(() => {
      const img: HTMLImageElement = document.querySelector(options.el) as HTMLImageElement;
      img.onload = () => {
        resolve({
          baseUrl: base64(img),
        });
      };
    });

    const base64 = (el: HTMLImageElement): string => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = el.width;
      canvas.height = el.height;
      ctx?.drawImage(el, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    };
  });
};
