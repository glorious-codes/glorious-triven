const path = require('path');
const { fileService } = require('./file');
const articleService = require('./article');
const configService = require('./config');
const dateService = require('./date');
const domService = require('./dom');
const templateService = require('./template');

const _public = {};

_public.init = (onComplete, { silent } = {}) => {
  const { sourceDirectory, outputDirectory } = configService.get();
  if(!silent) console.log('Building files...');
  identifyMarkdownFilepaths(sourceDirectory, filepaths => {
    handleMarkdownFiles(filepaths, sourceDirectory, outputDirectory, onComplete);
  });
};

function identifyMarkdownFilepaths(sourceDirectory, onSuccess){
  fileService.collect(`${sourceDirectory}/**/*.md`, onSuccess);
}

function handleMarkdownFiles(filepaths, sourceDirectory, outputDirectory, onComplete){
  if(filepaths && filepaths.length) {
    return convertMarkdownFilesToHTML(filepaths, outputDirectory, onComplete);
  }
  return createDemoPost(sourceDirectory, outputDirectory, onComplete);
}

function convertMarkdownFilesToHTML(filepaths, outputDirectory, onComplete){
  const summaries = [];
  const template = templateService.getByFilename('article.html');
  filepaths.forEach(filepath => {
    const { summary, article } = articleService.build(filepath, template);
    const filename = path.basename(filepath).replace('.md', '.html');
    fileService.write(path.join(outputDirectory, filename), domService.minifyHTML(article));
    summaries.push(summary);
  });
  console.log('Files successfully built!');
  onComplete && onComplete();
}

function createDemoPost(sourceDirectory, outputDirectory, onComplete){
  const template = templateService.getByFilename('post.md');
  const data = template.replace('{date}', dateService.buildTodayISODate());
  fileService.write(path.join(sourceDirectory, 'hello-world.md'), data, () => {
    _public.init(onComplete, { silent: true });
  });
}

module.exports = _public;
