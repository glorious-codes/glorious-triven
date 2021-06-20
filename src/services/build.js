const path = require('path');
const { fileService } = require('./file');
const dateService = require('./date');
const domService = require('./dom');
const articleService = require('./article');
const templateService = require('./template');

const _public = {};

_public.init = (srcDirectory, distDirectory, onComplete) => {
  identifyMarkdownFilepaths(srcDirectory, filepaths => {
    handleMarkdownFiles(filepaths, srcDirectory, distDirectory, onComplete);
  });
};

function identifyMarkdownFilepaths(srcDirectory, onSuccess){
  fileService.collect(`${srcDirectory}/**/*.md`, onSuccess);
}

function handleMarkdownFiles(filepaths, srcDirectory, distDirectory, onComplete){
  if(filepaths && filepaths.length) {
    return convertMarkdownFilesToHTML(filepaths, distDirectory, onComplete);
  }
  return createDemoPost(srcDirectory, distDirectory, onComplete);
}

function convertMarkdownFilesToHTML(filepaths, distDirectory, onComplete){
  const summaries = [];
  const template = templateService.getByFilename('article.html');
  filepaths.forEach(filepath => {
    const { summary, article } = articleService.build(filepath, template);
    const filename = path.basename(filepath).replace('.md', '.html');
    fileService.write(path.join(distDirectory, filename), domService.minifyHTML(article));
    summaries.push(summary);
  });
  onComplete && onComplete();
}

function createDemoPost(srcDirectory, distDirectory, onComplete){
  const template = templateService.getByFilename('post.md');
  const data = template.replace('{date}', dateService.buildTodayISODate())
  fileService.write(path.join(srcDirectory, 'hello-world.md'), data, () => {
    _public.init(srcDirectory, distDirectory, onComplete)
  });
}

module.exports = _public;
