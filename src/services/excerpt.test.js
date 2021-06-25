const path = require('path');
const { fileService } = require('./file');
const excerptService = require('./excerpt');

describe('Excerpt Service', () => {
  it('should build excerpt from HTML string', () => {
    const html = '<p>This is a paragraph.</p><p>This is another paragraph.</p>';
    expect(excerptService.extract(html)).toEqual('This is a paragraph. This is another paragraph.');
  });

  it('should truncate excerpts more than 340 characters', () => {
    const html = fileService.readSync(path.join(__dirname, '../mocks/article.html'));
    const expectedExcerpt = [
      'We all can recognize beauty at the right moment we stand before it. ',
      'That was the certainty that I had the day I visited the world\'s ',
      'largest open-air contemporary art museum. It\'s a garden that could ',
      'be called paradise. Inhotim. Inside the Cosmococa gallery, you lie in ',
      'bed, rest in the hammock, dive in the pool. The five quasi-cinemas -...'
    ].join('');
    expect(excerptService.extract(html)).toEqual(expectedExcerpt);
  });

  it('should optionally pass a custom excerpt text', () => {
    const excerpt = 'This is an    excerpt.';
    expect(excerptService.extract('', { excerpt })).toEqual('This is an excerpt.');
  });
});
