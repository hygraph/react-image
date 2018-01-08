import React from 'react'
import 'whatwg-fetch'
import PropTypes from 'prop-types'

const baseURI = 'https://media.graphcms.com'
const thumbTransform = 'resize=w:50,h:50,fit:crop'

class Image extends React.Component {
  state = {
    loading: true,
    blob: null,
    thumb: `${baseURI}/${thumbTransform}/${this.props.handle}`
  }

  componentWillMount() {
    // const { handle } = this.props
    // const baseImg = `${baseURI}/${handle}`
    // const thumb = `${baseURI}/resize=w:50,h:50,fit:crop/${handle}`
    // this.setState({ thumb })
  }

  componentDidMount() {
    // const thumb = this.props.src.replace('/upload/', '/upload/t_media_lib_thumb/')
    const baseImg = `${baseURI}/${this.props.handle}`
    // const thumb = `${baseURI}/resize=w:50,h:50,fit:crop/${handle}`

    fetch(baseImg)
      .then(res => res.blob())
      .then(res => {
        const blob = URL.createObjectURL(res)
        this.setState({ blob, loading: false })
      })
      .catch(err => console.log(err))
  }

  render() {
    if (this.state.loading) {
      return <img className="gimg gimg__loading" src={this.state.thumb} />
    }

    return <img className="gimg" src={this.state.blob} />
  }
}

Image.propTypes = {
  handle: PropTypes.string.isRequired
}

export default Image
