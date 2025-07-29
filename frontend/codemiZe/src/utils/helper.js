export const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const imagePath = (image) => {
  if (!image) return '/c-logo.png';
  return `${import.meta.env.VITE_BACKEND_URL}${image}`;
};