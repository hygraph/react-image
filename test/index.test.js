import { expect } from 'chai';
import { srcSet, getWidths, constructURL, imgSizes } from '../src/Utils';

describe('Utils tests', () => {
  const timeout = 3000;

  test('should get the correct widths', async () => {
    const widths = getWidths(2440, 4880);
    expect(widths.length).to.equal(2);
    expect(widths[0]).to.equal(1220);
  }, timeout);

  test('should construct correct srcSet', async () => {
    const constructedURL = constructURL('test', false, 'https://burrow.com');
    const widths = getWidths(1390, 800);
    const srcSetImgs = srcSet(constructedURL, widths, 'crop', []);
    expect(srcSetImgs).to.equal('https://burrow.com/resize=w:200,fit:crop/compress/test 200w,\n' +
    'https://burrow.com/resize=w:400,fit:crop/compress/test 400w,\n' +
    'https://burrow.com/resize=w:800,fit:crop/compress/test 800w,\n' +
    'https://burrow.com/resize=w:1200,fit:crop/compress/test 1200w,\n' +
    'https://burrow.com/resize=w:1390,fit:crop/compress/test 1390w');
  }, timeout);

  test('should get correct imgSizes', async () => {
    const allImgSizes = imgSizes(4480);
    expect(allImgSizes).to.equal('(max-width: 4480px) 100vw, 4480px');
  }, timeout);
});
