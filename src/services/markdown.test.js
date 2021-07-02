const markdownService = require('./markdown');

describe('Markdown Service', () => {
  it('should convert markdown to html', () => {
    expect(markdownService.convert('Hello').trim()).toEqual('<p>Hello</p>');
  });

  it('should handle plain text code', () => {
    const code = [
      '```',
      'npm install -D @glorious/triven',
      '```'
    ].join('\n');
    const markup = [
      '<pre>',
      '<code>',
      'npm install -D @glorious/triven\n',
      '</code>',
      '</pre>'
    ].join('');
    expect(markdownService.convert(code).trim()).toEqual(markup);
  });

  it('should highlight code present in a given markdown', () => {
    const code = [
      '``` javascript',
      'const name = "Rafael";',
      '```'
    ].join('\n');
    const highlight = [
      '<pre>',
      '<code class="language-javascript">',
      '<span class="hljs-keyword">const</span>',
      ' name = ',
      '<span class="hljs-string">&quot;Rafael&quot;</span>;\n',
      '</code>',
      '</pre>'
    ].join('');
    expect(markdownService.convert(code).trim()).toEqual(highlight);
  });
});
