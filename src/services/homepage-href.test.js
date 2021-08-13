const homepageHrefService = require('./homepage-href');

describe('Homepage Href Service', () => {
  it('should build appropriate href prefixes for the first page of a multi language home page', () => {
    const params = { pageNumber: 1 };
    expect(homepageHrefService.buildHrefPrefixes(params)).toEqual({
      asset: '',
      post: ''
    });
  });

  it('should build appropriate href prefixes for pages other than first one of a multi language home page', () => {
    const params = { pageNumber: 2 };
    expect(homepageHrefService.buildHrefPrefixes(params)).toEqual({
      asset: '../../',
      post: '../../'
    });
  });

  it('should build appropriate href prefix for the first page of a specific language home page', () => {
    const params = { pageNumber: 1, lang: 'es-ES' };
    expect(homepageHrefService.buildHrefPrefixes(params)).toEqual({
      asset: '../../',
      post: '../../'
    });
  });

  it('should build appropriate href prefix for pages other than first one of a specific language home page', () => {
    const params = { pageNumber: 2, lang: 'es-ES' };
    expect(homepageHrefService.buildHrefPrefixes(params)).toEqual({
      asset: '../../../../',
      post: '../../../../'
    });
  });
});
