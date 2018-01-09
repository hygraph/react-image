// import inImageCache from './inImageCache'

const listeners = []

let io
function getIO() {
  if (
    typeof io === 'undefined' &&
    typeof window !== 'undefined' &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          listeners.forEach(listener => {
            if (listener[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                // when we intersect we cache the intersecting image for subsequent mounts
                console.log(entry)
                io.unobserve(listener[0])
                listener[1]()
              }
            }
          })
        })
      },
      { rootMargin: '200px' }
    )
  }

  return io
}

const listenToIntersections = (element, callback) => {
  getIO().observe(element)
  listeners.push([element, callback])
}

export default listenToIntersections
