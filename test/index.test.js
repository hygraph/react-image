import { expect } from 'chai';
import { srcSet, getWidths } from '../src/Utils';

describe('Utils tests', () => {
  const timeout = 3000;

  test('should get the correct widths', async () => {
    const widths = new getWidths(200, 4880);
    console.log(widths)
  }, timeout);

});
