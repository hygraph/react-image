import React from 'react'
import PropTypes from 'prop-types'
import Img from './Img'

if (typeof window !== 'undefined') {
  require('intersection-observer')
}

// Cache if we've intersected an image before so we don't
// lazy-load & fade in on subsequent mounts.
const imageCache = {}
const inImageCache = ({ handle }, shouldCache) => {
  if (imageCache[handle]) {
    return true
  }
  if (shouldCache) {
    imageCache[handle] = true
  }
  return false
}

// Add IntersectionObserver to component
const listeners = []
let io
const getIO = () => {
  if (typeof io === 'undefined' && typeof window !== 'undefined') {
    io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          listeners.forEach(listener => {
            if (listener[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                // when we intersect we cache the intersecting image for subsequent mounts
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

const bgColor = backgroundColor =>
  typeof backgroundColor === 'boolean' ? 'lightgray' : backgroundColor

// We always keep the resize transform to have matching sizes + aspect ratio
// If used with native height & width from GraphCMS it produces no transform
const resizeImage = ({ width, height, fit }) =>
  `resize=w:${width},h:${height},fit:${fit}`

// Filestack supports serving modern formats (like WebP) for supported browsers.
// See: https://www.filestack.com/docs/api/processing/#auto-image-conversion
const compressAndWebp = webp => `${webp ? 'auto_image/' : ''}compress`

const constructURL = (handle, withWebp, baseURI) => resize => transforms =>
  [baseURI, resize, ...transforms, compressAndWebp(withWebp), handle].join('/')

// responsiveness transforms
const responsiveSizes = size => [
  size / 4,
  size / 2,
  size,
  size * 1.5,
  size * 2,
  size * 3
]

const getWidths = (width, maxWidth) => {
  const sizes = responsiveSizes(maxWidth).filter(size => size < width)
  // Add the original width to ensure the largest image possible
  // is available for small images.
  const finalSizes = [...sizes, width]
  return finalSizes
}

const srcSet = (srcBase, srcWidths, fit, transforms) =>
  srcWidths
    .map(
      width =>
        `${srcBase([`resize=w:${Math.floor(width)},fit:${fit}`])(
          transforms
        )} ${Math.floor(width)}w`
    )
    .join(',\n')

const imgSizes = maxWidth => `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`

class GraphImage extends React.Component {
  constructor(props) {
    super(props)

    let isVisible = true
    let imgLoaded = true
    let IOSupported = false

    const seenBefore = inImageCache(props)

    if (
      !seenBefore &&
      typeof window !== 'undefined' &&
      window.IntersectionObserver
    ) {
      isVisible = false
      imgLoaded = false
      IOSupported = true
    }

    // Never render image while server rendering
    if (typeof window === 'undefined') {
      isVisible = false
      imgLoaded = false
    }

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported
    }

    this.handleRef = this.handleRef.bind(this)
    this.onImageLoaded = this.onImageLoaded.bind(this)
  }

  onImageLoaded() {
    if (this.state.IOSupported) {
      this.setState(
        () => ({
          imgLoaded: true
        }),
        () => {
          inImageCache(this.props.image, true)
        }
      )
    }
    if (this.props.onLoad) {
      this.props.onLoad()
    }
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      listenToIntersections(ref, () => {
        this.setState({ isVisible: true, imgLoaded: false })
      })
    }
  }

  render() {
    const {
      title,
      alt,
      className,
      outerWrapperClassName,
      style,
      image: { width, height, handle },
      fit,
      maxWidth,
      withWebp,
      transforms,
      blurryPlaceholder,
      backgroundColor,
      fadeIn,
      baseURI
    } = this.props

    if (width && height && handle) {
      // unify after webp + blur resolved
      const srcBase = constructURL(handle, withWebp, baseURI)
      const thumbBase = constructURL(handle, false, baseURI)

      // construct the final image url
      const sizedSrc = srcBase(resizeImage({ width, height, fit }))
      const finalSrc = sizedSrc(transforms)

      // construct blurry placeholder url
      const thumbSize = { width: 20, height: 20, fit: 'crop' }
      const thumbSrc = thumbBase(resizeImage(thumbSize))(['blur=amount:2'])

      // construct srcSet if maxWidth provided
      const srcSetImgs = srcSet(
        srcBase,
        getWidths(width, maxWidth),
        fit,
        transforms
      )
      const sizes = imgSizes(maxWidth)

      // The outer div is necessary to reset the z-index to 0.
      return (
        <div
          className={`${outerWrapperClassName} graphcms-image-outer-wrapper`}
          style={{
            zIndex: 0,
            // Let users set component to be absolutely positioned.
            position: style.position === 'absolute' ? 'initial' : 'relative'
          }}
        >
          <div
            className={`${className} graphcms-image-wrapper`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              zIndex: 1,
              ...style
            }}
            ref={this.handleRef}
          >
            {/* Preserve the aspect ratio. */}
            <div
              style={{
                width: '100%',
                paddingBottom: `${100 / (width / height)}%`
              }}
            />

            {/* Show the blurry thumbnail image. */}
            {blurryPlaceholder && (
              <Img
                alt={alt}
                title={title}
                src={thumbSrc}
                opacity={this.state.imgLoaded ? 0 : 1}
                transitionDelay="0.25s"
              />
            )}

            {/* Show a solid background color. */}
            {backgroundColor && (
              <div
                title={title}
                style={{
                  backgroundColor: bgColor(backgroundColor),
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  opacity: this.state.imgLoaded ? 0 : 1,
                  transitionDelay: '0.25s',
                  right: 0,
                  left: 0
                }}
              />
            )}

            {/* Once the image is visible, start downloading the image */}
            {this.state.isVisible && (
              <Img
                alt={alt}
                title={title}
                srcSet={srcSetImgs}
                src={finalSrc}
                sizes={sizes}
                opacity={this.state.imgLoaded || !fadeIn ? 1 : 0}
                onLoad={this.onImageLoaded}
              />
            )}
          </div>
        </div>
      )
    }

    return null
  }
}

GraphImage.defaultProps = {
  title: '',
  alt: '',
  className: '',
  outerWrapperClassName: '',
  style: {},
  fit: 'crop',
  maxWidth: 800,
  withWebp: true,
  transforms: [],
  blurryPlaceholder: true,
  backgroundColor: '',
  fadeIn: true,
  onLoad: null,
  baseURI: 'https://media.graphcms.com'
}

GraphImage.propTypes = {
  title: PropTypes.string,
  alt: PropTypes.string,
  // Support Glamor's css prop for classname
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  outerWrapperClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  style: PropTypes.object,
  image: PropTypes.shape({
    handle: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }).isRequired,
  fit: PropTypes.oneOf(['clip', 'crop', 'scale', 'max']),
  maxWidth: PropTypes.number,
  withWebp: PropTypes.bool,
  transforms: PropTypes.arrayOf(PropTypes.string),
  onLoad: PropTypes.func,
  blurryPlaceholder: PropTypes.bool,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fadeIn: PropTypes.bool,
  baseURI: PropTypes.string
}

export default GraphImage
