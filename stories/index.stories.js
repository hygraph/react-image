import React from 'react'
import { storiesOf } from '@storybook/react'

import GraphImage from '../src'
import vinylbaseImgs from './vinylbaseImgs'

storiesOf('Image', module).add('sample', () => (
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

storiesOf('Foo', module).add('bar', () => <h1>Foobar</h1>)
