import React from 'react'
import { storiesOf } from '@storybook/react'

import GraphImage from '../src'
import vinylbaseImgs from './vinylbaseImgs'

storiesOf('Image', module).add('image', () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: 1064,
      margin: '0 auto'
    }}
  >
    {vinylbaseImgs.map(image => (
      <GraphImage
        key={image.handle}
        title="Sample"
        alt="Sample"
        image={{
          handle: image.handle,
          width: 1920,
          height: 1080
        }}
        maxWidth={500}
        withWebp
        style={{
          width: 500,
          margin: '32px 16px'
        }}
      />
    ))}
  </div>
))

storiesOf('Cache', module).add('cache', () => (
  <h2>
    This story exist only for the purpose of showing you that going back and
    forth between it and the Image will not trigger reloading images with blur
    up if they have already been seen in the viewport
  </h2>
))
