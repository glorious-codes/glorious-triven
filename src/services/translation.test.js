const { mockTrivenConfig } = require('./testing');
const translationService = require('./translation');

describe('Translation Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should get default translations', () => {
    expect(translationService.get()).toEqual({
      availableRSSFeeds: 'Available RSS Feeds',
      availableLanguages: 'Available languages',
      currentLanguage: 'Current language',
      multiLanguage: 'Multi-language',
      newer: 'Newer',
      older: 'Older',
      readMore: 'Read more',
      rssFeed: 'RSS Feed',
      rssFeeds: 'RSS Feeds',
      seeAllPosts: 'See all posts'
    });
  });

  it('should optionally get custom english translations', () => {
    const lang = 'en-US';
    const newer = 'Previous page';
    const older = 'Next page';
    mockTrivenConfig({ translations: { [lang]: { newer, older } } });
    expect(translationService.get(lang)).toEqual({
      availableRSSFeeds: 'Available RSS Feeds',
      availableLanguages: 'Available languages',
      currentLanguage: 'Current language',
      multiLanguage: 'Multi-language',
      rssFeed: 'RSS Feed',
      rssFeeds: 'RSS Feeds',
      readMore: 'Read more',
      seeAllPosts: 'See all posts',
      newer,
      older
    });
  });

  it('should optionally get custom translations for custom language', () => {
    const lang = 'pt-BR';
    const translations = {
      availableRSSFeeds: 'Available RSS Feeds',
      availableLanguages: 'Available languages',
      currentLanguage: 'Current language',
      multiLanguage: 'Multi-language',
      newer: 'Newer',
      older: 'Older',
      rssFeed: 'RSS Feed',
      rssFeeds: 'RSS Feeds',
      readMore: 'Read more',
      seeAllPosts: 'See all posts'
    };
    mockTrivenConfig({
      translations: {
        [lang]: { ...translations }
      }
    });
    expect(translationService.get(lang)).toEqual(translations);
  });
});
