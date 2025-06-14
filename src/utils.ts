export const pxToRem = (px: number, baseFontSize: number = 16): string => {
  return `${px / baseFontSize}rem`;
};
