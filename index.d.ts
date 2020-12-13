  import React from 'react'

  type ClassName = string | Record<string, unknown>

  export interface GraphImageProp {
    handle: string
    height: number
    width: number
  }

  export interface GraphImageProps {
    /**
     * Passed to the img element
     */
    title?: string
    /**
     * Passed to the img element
     */
    alt?: string
    /**
     * Passed to the wrapper `div`. Object is needed to support Glamor's css prop
     */
    className?: ClassName
    /**
     * Passed to the outer wrapper `div`. Object is needed to support Glamor's css prop
     */
    outerWrapperClassName?: ClassName
    /**
     * Spread into the default styles in the wrapper `div`
     */
    style?: React.CSSProperties
    /**
     * An object of shape `{ handle, width, height }`. Handle is an identifier required to display the image
     * and both `width` and `height` are required to display a correct placeholder and aspect ratio for the image.
     * You can get all 3 by just putting all 3 in your image-getting query.
     */
    image: GraphImageProp
    /**
     * When resizing the image, how would you like it to fit the new dimensions?
     * Defaults to crop. You can read more about resizing [here](https://www.filestack.com/docs/image-transformations/resize)
     */
    fit?: 'clip' | 'crop' | 'scale' | 'max'
    /**
     * Maximum width you'd like your image to take up.
     * (ex. If your image container is resizing dynamically up to a width of 1200, put it as a `maxWidth`)
     */
    maxWidth?: number
    /**
     * If webp is supported by the browser, the images will be served with `.webp` extension. (Recommended)
     */
    withWebp?: boolean
    /**
     * Array of `string`s, each representing a separate Filestack transform,
     * eg. `['sharpen=amount:5', 'quality=value:75']`
     */
    transforms?: string[]
    /**
     * A callback that is called when the full-size image has loaded.
     */
    onLoad?: () => void
    /**
     * Would you like to display a blurry placeholder for your loading image? Defaults to `true`.
     */
    blurryPlaceholder?: boolean
    /**
     * Set a colored background placeholder. If true, uses "lightgray" for the color.
     * You can also pass in any valid color string.
     */
    backgroundColor?: string | boolean
    /**
     * Do you want your image to fade in on load? Defaults to `true`
     */
    fadeIn?: boolean
    /**
     * Set the base src from where the images are requested.
     * Base URI Defaults to `https://media.graphcms.com`
     */
    baseURI?: string
  }

  export default class GraphImage extends React.Component<GraphImageProps> {}
