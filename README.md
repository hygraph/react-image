<p align="center">
  <img width="300" src="https://graphcms.com/assets/svg/graphcms-image.svg?sanitize=true">
</p>

# graphcms-image

Inpired by and based on [gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image)

**[Demo](https://graphcms-image.netlify.com/?down=0)**

* Resize large images to the size needed by your design
* Generate multiple smaller images to make sure devices download the optimal-sized one.
* Automatically compress and optimize your image with the powerful Filestack API
* Efficiently lazy load images to speed initial page load and save bandwidth
* Use the "blur-up" technique or solid background color to show a preview of the image while it loads
* Hold the image position so your page doesn't jump while images load



This is what a component using `graphcms-image` looks like.

```jsx
import React, { Fragment } from "react";
import GraphImg from "graphcms-image";

export default ({ data: { loading, images } }) => {
  if (!loading) {
    return (
      <Fragment>
        {images.map(image => (
          <GraphImg image={image} maxWidth={800} />
        ))}
      </Fragment>
    )
  }
  return <h1>Loading...</h1>
};

export const query = graphql`
  query getAssets {
    images: allAssets {
      handle
      width
      height
    }
  }
`;
```

## Props

| Name                    | Type             | Description                                                                                                                 |
| ----------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `image`                 | `object`         | An object of shape `{ handle, width, height }`. Handle is an identifier required to display the image and both `width` and                                                      `height` are required to display a correct placeholder and aspect ratio for the image. You can get all 3 by just putting all 3 in your image-getting query.                                                                                  |
| `maxWidth`                 | `number`         | Maximum width you'd like your image to take up. (ex. If your image container is resizing dynamically up to a width of 1200, put it as a `maxWidth`)                                                                                                                                      |
| `fadeIn`                | `bool`           | Do you want your image to fade in on load? Defaults to `true`                      |
| `fit`                 | `"clip"\|"crop"\|"scale"\|"max"`         | When resizing the image, how would you like it to fit the new dimensions? Defaults to `crop`. You can read more about resizing [here](https://www.filestack.com/docs/image-transformations/resize)   |
| `withWebp`                 | `bool`         | If webp is supported by the browser, the images will be served with `.webp` extension. (Recommended)                       |
| `transforms`                 | `array`         | Array of `string`s, each representing a separate Filestack transform, eg. `['sharpen=amount:5', 'quality=value:75']`                                                                                                 |
| `title`                 | `string`         | Passed to the `img` element                                                                                                 |
| `alt`                   | `string`         | Passed to the `img` element                                                                                                 |
| `className`             | `string\|object` | Passed to the wrapper div. Object is needed to support Glamor's css prop                                                    |
| `outerWrapperClassName` | `string\|object` | Passed to the outer wrapper div. Object is needed to support Glamor's css prop                                              |
| `style`                 | `object`         | Spread into the default styles in the wrapper div                                                                           |
| `position`              | `string`         | Defaults to `relative`. Pass in `absolute` to make the component `absolute` positioned                                      |
| `blurryPlaceholder`       | `bool`   | Would you like to display a blurry placeholder for your loading image? Defaults to `true`. |
| `backgroundColor`       | `string\|bool`   | Set a colored background placeholder. If true, uses "lightgray" for the color. You can also pass in any valid color string. |
| `onLoad`                | `func`           | A callback that is called when the full-size image has loaded.                                                              |
| `baseURI`               | `string`         | Set the base src from where the images are requested. Base URI Defaults to `https://media.graphcms.com`                     |
