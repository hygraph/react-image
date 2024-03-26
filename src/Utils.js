// check webp support
let isWebpSupportedCache = null;
const isWebpSupported = () => {
  if (isWebpSupportedCache !== null) {
    return isWebpSupportedCache
  }

  const elem =
    typeof window !== `undefined` ? window.document.createElement(`canvas`) : {};
  if (elem.getContext && elem.getContext(`2d`)) {
    isWebpSupportedCache =
      elem.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0;
    return isWebpSupportedCache
  }
  return false
};

const compressAndWebp = webp => `${webp ? 'output=format:webp/' : ''}compress`;

const imgSizes = maxWidth => `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;

const constructURL = (handle, withWebp, baseURI) => resize => transforms =>
  [
    baseURI,
    resize,
    ...transforms,
    compressAndWebp(isWebpSupported() && withWebp),
    handle
  ].join('/');

const srcSet = (srcBase, srcWidths, fit, transforms) =>
  srcWidths
    .map(
      width =>
        `${srcBase([`resize=w:${Math.floor(width)},fit:${fit}`])(
          transforms
        )} ${Math.floor(width)}w`
    )
    .join(',\n');

export {
  srcSet,
  constructURL,
  imgSizes,
}
