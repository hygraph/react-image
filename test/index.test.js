import { expect } from 'chai';
import { srcSet, getWidths, constructURL, imgSizes } from '../src/Utils';

describe('Utils tests', () => {
  const timeout = 3000;

  test('should get the correct widths', async () => {
    const widths = new getWidths(2440, 4880);
    expect(widths.length).to.equal(2);
    expect(widths[0]).to.equal(1220);
  }, timeout);

  test('should construct correct srcSet', async () => {
    const constructedURL = constructURL('test', false, 'https://burrow.com');
    const widths = new getWidths(2440, 4880);
    const srcSetImgs = new srcSet(constructedURL, widths, '', '');
    console.log(srcSetImgs);
  }, timeout);

  test('should get correct imgSizes', async () => {
    const constructedURL = imgSizes(4480);
    console.log(constructedURL);
  }, timeout);
});
