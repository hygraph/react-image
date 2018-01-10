// Cache if we've intersected an image before so we don't
// lazy-load & fade in on subsequent mounts.

const imageCache = {}

const inImageCache = ({ image: { handle } }, shouldCache) => {
  if (imageCache[handle]) {
    return true
  }
  if (shouldCache) {
    imageCache[handle] = true
  }
  return false
}

export default inImageCache
