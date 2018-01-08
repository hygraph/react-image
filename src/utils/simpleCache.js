// Cache if we've seen an image before so we don't
// lazy-load & fade in on subsequent mounts.

const imageCache = {}
const inImageCache = props => {
  const { handle } = props

  if (imageCache[handle]) {
    return true
  }
  imageCache[handle] = true
  return false
}

export default inImageCache
