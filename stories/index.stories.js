import React from 'react'

import { storiesOf } from '@storybook/react'

import Image from '../src'

const testImage = {
  handle: 'MtF5PNN0QCWl2kAx3NzW',
  height: 853,
  width: 1280
}

storiesOf('Image', module).add('sample', () => (
  <Image title="Sample" alt="Sample" image={testImage} withWebp />
))
