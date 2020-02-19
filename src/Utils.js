// responsiveness transforms
const responsiveSizes = size => [
  size / 4,
  size / 2,
  size,
  size * 1.5,
  size * 2,
  size * 3
];

const srcSet = (srcBase, srcWidths, fit, transforms) =>
  srcWidths
    .map(
      width =>
        `${srcBase([`resize=w:${Math.floor(width)},fit:${fit}`])(
          transforms
        )} ${Math.floor(width)}w`
    )
    .join(',\n');

const getWidths = (width, maxWidth) => {
  const sizes = responsiveSizes(maxWidth).filter(size => size < width);
  // Add the original width to ensure the largest image possible
  // is available for small images.
  return [...sizes, width]
};

export {
  srcSet,
  getWidths,
}
