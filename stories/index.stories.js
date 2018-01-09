import React from 'react'
import { storiesOf } from '@storybook/react'

import Image from '../src'
import vinylbaseImgs from './vinylbaseImgs'

storiesOf('Image', module).add('sample', () => (
  <div>
    {vinylbaseImgs.map(image => (
      <Image
        key={image.handle}
        title="Sample"
        alt="Sample"
        image={image}
        withWebp
      />
    ))}
  </div>
))

storiesOf('Foo', module).add('bar', () => <h1>Foobar</h1>)
