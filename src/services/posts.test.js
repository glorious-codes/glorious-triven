const path = require('path');
const postsService = require('./posts');
const { mockTrivenConfig } = require('./testing');

describe('Posts Service', () => {
  function buildMockFilepaths(){
    return [path.join(__dirname, '../mocks/brazil.md')];
  }

  beforeEach(() => {
    mockTrivenConfig({});
  });

  it('should build a list of post data form post filepaths', () => {
    const markdownText = `title: Brazil
date: 2021-06-25

---

Brazil (Portuguese: Brasil; Brazilian Portuguese: [bɾaˈziw]), officially the Federative Republic of Brazil, is the largest country in both South America and Latin America. It covers an area of 8,515,767 square kilometres (3,287,956 sq mi), with a population of over 211 million.
`;
    const filepaths = buildMockFilepaths();
    expect(postsService.buildData(filepaths)).toEqual([
      {
        summary: {
          title: 'Brazil',
          lang: 'en-US',
          date: '2021-06-25',
          url: 'brazil.html'
        },
        markdownText: markdownText.slice(markdownText.indexOf('---')+3).trim(),
        filepath: filepaths[0]
      }
    ]);
  });
});
