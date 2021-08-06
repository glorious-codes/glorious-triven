const { mockTrivenConfig } = require('./testing');
const translationService = require('./translation');

describe('Translation Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should get default translations', () => {
    expect(translationService.get()).toEqual({
      newer: 'Newer',
      older: 'Older',
      readMore: 'Read more',
      seeAllPosts: 'See all posts'
    });
  });

  it('should optionally get custom english translations', () => {
    const lang = 'en-US';
    const newer = 'Previous page';
    const older = 'Next page';
    mockTrivenConfig({ translations: { [lang]: { newer, older } } });
    expect(translationService.get(lang)).toEqual({
      newer,
      older,
      readMore: 'Read more',
      seeAllPosts: 'See all posts'
    });
  });

  it('should optionally get custom translations for custom language', () => {
    const lang = 'pt-BR';
    const newer = 'Posteriores';
    const older = 'Anteriores';
    const readMore = 'Continue lendo';
    const seeAllPosts = 'Todas as publicações';
    mockTrivenConfig({
      translations: {
        [lang]: { newer, older, readMore, seeAllPosts }
      }
    });
    expect(translationService.get(lang)).toEqual({
      newer,
      older,
      readMore,
      seeAllPosts
    });
  });
});
