<h1 align="center">@graphcms/react-image</h1>

<p align="center">Universal lazy-loading, auto-compressed images with React and GraphCMS.</p>

<p align="center">
  <a href="https://npmjs.org/package/@graphcms/react-image">
    <img src="https://img.shields.io/npm/v/@graphcms/react-image.svg" alt="Version" />
  </a>
  <a href="https://npmjs.org/package/@graphcms/react-image">
    <img src="https://img.shields.io/npm/dw/@graphcms/react-image.svg" alt="Downloads/week" />
  </a>
  <a href="https://github.com/GraphCMS/react-image/stargazers">
    <img src="https://img.shields.io/github/stars/GraphCMS/react-image" alt="Forks on GitHub" />
  </a>
  <img src="https://badgen.net/bundlephobia/minzip/@graphcms/react-image" alt="minified + gzip size" />
  <br/>
  <a href="https://graphcms-image.netlify.com/?down=0">Demo</a> • <a href="https://slack.graphcms.com">Join us on Slack</a> • <a href="https://app.graphcms.com">Login to GraphCMS</a> • <a href="https://twitter.com/GraphCMS">@GraphCMS</a>
</p>

* Resize large images to the size needed by your design.
* Generate multiple smaller images to make sure devices download the optimal-sized one.
* Automatically compress and optimize your image with the powerful Filestack API.
* Efficiently lazy load images to speed initial page load and save bandwidth.
* Use the "blur-up" technique or solid background color to show a preview of the image while it loads.
* Hold the image position so your page doesn't jump while images load.

## Quickstart

Here's an example using a static asset object.

```jsx
import React from "react";
import Image from "@graphcms/react-image";

const IndexPage = () => {
  const asset = {
    handle: "uQrLj1QRWKJnlQv1sEmC",
    width: 800,
    height: 800
  }
  
  return <Image image={asset} maxWidth={800} />
}
```

## Install

```bash
npm install @graphcms/react-image
```

## Props

| Name                    | Type                             | Description                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`                 | `object`                         | An object of shape `{ handle, width, height }`. Handle is an identifier required to display the image and both `width` and                                                      `height` are required to display a correct placeholder and aspect ratio for the image. You can get all 3 by just putting all 3 in your image-getting query. |
| `maxWidth`              | `number`                         | Maximum width you'd like your image to take up. (ex. If your image container is resizing dynamically up to a width of 1200, put it as a `maxWidth`)                                                                                                                                                                                         |
| `fadeIn`                | `bool`                           | Do you want your image to fade in on load? Defaults to `true`                                                                                                                                                                                                                                                                               |
| `fit`                   | `"clip"\|"crop"\|"scale"\|"max"` | When resizing the image, how would you like it to fit the new dimensions? Defaults to `crop`. You can read more about resizing [here](https://www.filestack.com/docs/api/processing/#resize)                                                                                                                                          |
| `withWebp`              | `bool`                           | If webp is supported by the browser, the images will be served with `.webp` extension. (Recommended)                                                                                                                                                                                                                                        |
| `transforms`            | `array`                          | Array of `string`s, each representing a separate Filestack transform, eg. `['sharpen=amount:5', 'quality=value:75']`                                                                                                                                                                                                                        |
| `title`                 | `string`                         | Passed to the `img` element                                                                                                                                                                                                                                                                                                                 |
| `alt`                   | `string`                         | Passed to the `img` element                                                                                                                                                                                                                                                                                                                 |
| `className`             | `string\|object`                 | Passed to the wrapper div. Object is needed to support Glamor's css prop                                                                                                                                                                                                                                                                    |
| `outerWrapperClassName` | `string\|object`                 | Passed to the outer wrapper div. Object is needed to support Glamor's css prop                                                                                                                                                                                                                                                              |
| `style`                 | `object`                         | Spread into the default styles in the wrapper div                                                                                                                                                                                                                                                                                           |
| `position`              | `string`                         | Defaults to `relative`. Pass in `absolute` to make the component `absolute` positioned                                                                                                                                                                                                                                                      |
| `blurryPlaceholder`     | `bool`                           | Would you like to display a blurry placeholder for your loading image? Defaults to `true`.                                                                                                                                                                                                                                                  |
| `backgroundColor`       | `string\|bool`                   | Set a colored background placeholder. If true, uses "lightgray" for the color. You can also pass in any valid color string.                                                                                                                                                                                                                 |
| `onLoad`                | `func`                           | A callback that is called when the full-size image has loaded.                                                                                                                                                                                                                                                                              |
| `baseURI`               | `string`                         | Set the base src from where the images are requested. Base URI Defaults to `https://media.graphassets.com`                                                                                                                                                                                                                                     |
