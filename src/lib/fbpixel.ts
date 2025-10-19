export const FB_PIXEL_ID = "1432330454583746";

// Отправка просмотра страницы
export const pageview = () => {
  if (typeof window !== "undefined" && "fbq" in window) {
    window.fbq("track", "PageView");
  }
};

// Отправка произвольного события
export const fbEvent = (name: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && "fbq" in window) {
    window.fbq("track", name, params);
  }
};
