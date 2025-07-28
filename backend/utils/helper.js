// Helper to shuffle options
export const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
}

export const imagePath = (image) => {
  if (!image) return '/c-logo.png';
  return `${process.env.BASE_URL}${image}`;
};