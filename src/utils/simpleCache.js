// Cache if we've seen an image before so we don't
// lazy-load & fade in on subsequent mounts.

const imageCache = {}
const inImageCache = props => {
  const { src } = props

  if (imageCache[src]) {
    return true
  }
  imageCache[src] = true
  return false
}

export default inImageCache
