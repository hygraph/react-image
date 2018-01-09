import inImageCache from './inImageCache'

const listeners = []

let io
function getIO(propsToCache) {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          listeners.forEach(l => {
            if (l[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                // when we intersect we cache the intersecting image for subsequent mounts
                inImageCache(propsToCache)
                io.unobserve(l[0])
                l[1]()
              }
            }
          })
        })
      },
      { rootMargin: `200px` }
    )
  }

  return io
}

const listenToIntersections = (el, cb, props) => {
  getIO(props).observe(el)
  listeners.push([el, cb])
}

export default listenToIntersections
