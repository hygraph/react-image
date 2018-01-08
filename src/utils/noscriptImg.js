const noscriptImg = props => {
  const {
    opacity = ``,
    handle,
    title = ``,
    alt = ``,
    width = ``,
    height = ``,
    transitionDelay = ``
  } = props
  return `<img width=${width} height=${height} src="https://media.graphcms.com/compress/${handle}" alt="${alt}" title="${title}" sizes="${sizes}" style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;objectPosition:center"/>`
}

export default noscriptImg
