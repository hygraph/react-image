import React from 'react'
import PropTypes from 'prop-types'

import Img from './Img'
import listenToIntersections from './listenToIntersections'
import isWebpSupported from './isWebpSupported'
import inImageCache from './inImageCache'

const baseURI = 'https://media.graphcms.com/'
const thumbTrans = 'resize=w:20,h:20,fit:crop/blur=amount:2'

const thumbImg = (handle, webp = '') =>
  `${baseURI}${thumbTrans}/${webp && 'output=format:webp/'}compress/${handle}`

const fullImg = (handle, transforms = '', webp = '') =>
  `${baseURI}${transforms}/${webp && 'output=format:webp/'}compress/${handle}`

const getSizes = (width, maxWidth) => {
  const sizes = [
    maxWidth / 4,
    maxWidth / 2,
    maxWidth,
    maxWidth * 1.5,
    maxWidth * 2,
    maxWidth * 3
  ]
  const filteredSizes = sizes.filter(size => size < width)
  filteredSizes.push(width)
  // console.log(filteredSizes)
}

class GraphImage extends React.Component {
  constructor(props) {
    super(props)

    // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.
    let isVisible = true
    let imgLoaded = true
    let IOSupported = false

    // We get the responsive sizes of an image
    getSizes(props.image.width, props.maxWidth)

    // If this image has already been loaded before then we can assume it's
    // in the browser cache so it's cheap to just show directly.
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
    this.state.IOSupported &&
      this.setState(
        () => ({
          imgLoaded: true
        }),
        inImageCache(this.props, true)
      )
    this.props.onLoad && this.props.onLoad()
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
      image: { handle, height, width },
      maxWidth,
      withWebp,
      transforms,
      blurryPlaceholder,
      backgroundColor
    } = this.props

    let bgColor
    if (typeof backgroundColor === 'boolean') {
      bgColor = 'lightgray'
    } else {
      bgColor = backgroundColor
    }

    if (handle) {
      let finalSrc = fullImg(transforms, handle)
      const finalThumb = thumbImg(handle)
      // Use webp by default if browser supports it
      if (isWebpSupported() && withWebp) {
        finalSrc = fullImg(handle, transforms, true)
        // figure out the error on filestack transforms with blur + webp
        // finalThumb = thumbImg(handle, true)
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
                src={finalThumb}
                opacity={this.state.imgLoaded ? 0 : 1}
                transitionDelay="0.25s"
              />
            )}

            {/* Show a solid background color. */}
            {bgColor && (
              <div
                title={title}
                style={{
                  backgroundColor: bgColor,
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

            {/* Once the image is visible (or the browser doesn't support IntersectionObserver), start downloading the image */}
            {this.state.isVisible && (
              <Img
                alt={alt}
                title={title}
                src={finalSrc}
                opacity={this.state.imgLoaded || !this.props.fadeIn ? 1 : 0}
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
  blurryPlaceholder: true,
  withWebp: true,
  maxWidth: 800,
  style: {},
  transforms: '',
  fadeIn: true,
  alt: '',
  title: '',
  outerWrapperClassName: '',
  className: '',
  backgroundColor: '',
  onLoad: null
}

GraphImage.propTypes = {
  image: PropTypes.shape({
    handle: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }).isRequired,
  maxWidth: PropTypes.number,
  withWebp: PropTypes.bool,
  blurryPlaceholder: PropTypes.bool,
  transforms: PropTypes.string,
  fadeIn: PropTypes.bool,
  title: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  outerWrapperClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  style: PropTypes.object,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func
}

export default GraphImage
