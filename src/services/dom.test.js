const domService = require('./dom');

describe('DOM Service', () => {
  it('should parse html string', () => {
    const title = 'Hello!';
    const htmlString = `<div><h1>${title}</h1></div>`;
    const $ = domService.parseHTMLString(htmlString);
    expect($('h1').text()).toEqual(title);
  });
});
