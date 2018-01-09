import React from 'react'
import PropTypes from 'prop-types'

const Img = props => {
  const { opacity, onLoad, transitionDelay, ...otherProps } = props
  return (
    <img
      {...otherProps}
      onLoad={onLoad}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transition: 'opacity 0.5s',
        transitionDelay,
        opacity,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  )
}

Img.defaultProps = {
  transitionDelay: '',
  onLoad() {}
}

Img.propTypes = {
  opacity: PropTypes.oneOf([0, 1]).isRequired,
  transitionDelay: PropTypes.string,
  onLoad: PropTypes.func
}

export default Img
