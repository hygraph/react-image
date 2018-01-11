import 'intersection-observer'
import React from 'react'
import PropTypes from 'prop-types'
import Img from './Img'

const baseURI = 'https://media.graphcms.com'

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

// check webp support
let isWebpSupportedCache = null
const isWebpSupported = () => {
  if (isWebpSupportedCache !== null) {
    return isWebpSupportedCache
  }

  const elem =
    typeof window !== `undefined` ? window.document.createElement(`canvas`) : {}
  if (elem.getContext && elem.getContext(`2d`)) {
    isWebpSupportedCache =
      elem.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0
  } else {
    isWebpSupportedCache = false
  }

  return isWebpSupportedCache
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

const compressAndWebp = webp => `${webp ? 'output=format:webp/' : ''}compress`

const constructURL = (handle, withWebp) => resize => transforms =>
  [
    baseURI,
    resize,
    ...transforms,
    compressAndWebp(isWebpSupported() && withWebp),
    handle
  ].join('/')

// get and construct srcSet for the image
function getWidths(width, maxWidth) {
  const sizes = [
    maxWidth / 4,
    maxWidth / 2,
    maxWidth,
    maxWidth * 1.5,
    maxWidth * 2,
    maxWidth * 3
  ]
  const filteredSizes = sizes.filter(size => size < width)
  // Add the original image to ensure the largest image possible
  // is available for small images.
  const finalSizes = [...filteredSizes, width]
  return finalSizes
}

const srcSet = (srcBase, srcWidths, height, transforms) =>
  srcWidths
    .map(width => {
      const setSize = { width, height, fit: 'crop' }
      return `${srcBase([resizeImage(setSize)])(transforms)} ${width}w`
    })
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
          inImageCache(this.props, true)
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
      fadeIn
    } = this.props

    if (width && height && handle) {
      // unify after webp + blur resolved
      const srcBase = constructURL(handle, withWebp)
      const thumbBase = constructURL(handle, false)

      // construct the final image url
      const sizedSrc = srcBase(resizeImage({ width, height, fit }))
      const finalSrc = sizedSrc(transforms)

      // construct blurry placeholder url
      const thumbSize = { width: 20, height: 20, fit: 'crop' }
      const thumbSrc = thumbBase(resizeImage(thumbSize))(['blur=amount:2'])

      // construct srcSet if maxWidth provided
      let srcSetImgs
      let sizes
      if (maxWidth) {
        srcSetImgs = srcSet(
          srcBase,
          getWidths(width, maxWidth),
          height,
          transforms
        )
        sizes = imgSizes(maxWidth)
      }

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
  maxWidth: 0,
  withWebp: true,
  transforms: [],
  blurryPlaceholder: true,
  backgroundColor: '',
  fadeIn: true,
  onLoad: null
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
  fadeIn: PropTypes.bool
}

export default GraphImage
