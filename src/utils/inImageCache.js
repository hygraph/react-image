// Cache if we've intersected an image before so we don't
// lazy-load & fade in on subsequent mounts.
const imageCache = {}
const inImageCache = props => {
  const { image: { handle } } = props
  if (imageCache[handle]) {
    return true
  }
  return false
}

export default inImageCache
