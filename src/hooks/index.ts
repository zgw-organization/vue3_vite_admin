import { onMounted } from "vue";

// 自定义hooks 类似于mixins  hooks是一个函数
// 转化TZ时间格式
export const useFormatDate = (time: string) => {
  var date = new Date(Date.parse(time));
  var YY = date.getFullYear() + "-";
  var MM = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hh = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var mm = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
  var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
};

// 将图片转化为base64
export const useImgToBase64 = (options: {
  el: string;
}): Promise<{ baseUrl: string }> => {
  return new Promise((resolve) => {
    onMounted(() => {
      let img: HTMLImageElement = document.querySelector(
        options.el
      ) as HTMLImageElement;
      img.onload = () => {
        resolve({
          baseUrl: base64(img),
        });
      };
    });

    const base64 = (el: HTMLImageElement): string => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = el.width;
      canvas.height = el.height;
      ctx?.drawImage(el, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    };
  });
};
