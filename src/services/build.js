const path = require('path');
const { fileService } = require('./file');
const articleService = require('./article');
const configService = require('./config');
const dateService = require('./date');
const domService = require('./dom');
const homepageService = require('./homepage');
const stylesService = require('./styles');
const templateService = require('./template');

const _public = {};

_public.init = (onComplete, { silent } = {}) => {
  const { sourceDirectory, outputDirectory } = configService.get();
  stylesService.buildBaseStyle(outputDirectory, () => {
    if(!silent) console.log('Building files...');
    identifyMarkdownFilepaths(sourceDirectory, filepaths => {
      handleMarkdownFiles(filepaths, sourceDirectory, outputDirectory, onComplete);
    });
  });
};

function identifyMarkdownFilepaths(sourceDirectory, onSuccess){
  fileService.collect(`${sourceDirectory}/**/*.md`, filepaths => {
    onSuccess(removePathContaingNodeModules(filepaths));
  });
}

function removePathContaingNodeModules(filepaths){
  return filepaths.filter(filepath => !filepath.includes('node_modules'));
}

function handleMarkdownFiles(filepaths, sourceDirectory, outputDirectory, onComplete){
  if(filepaths && filepaths.length) {
    return convertMarkdownFilesToHTML(filepaths, outputDirectory, onComplete);
  }
  return createDemoPost(sourceDirectory, outputDirectory, onComplete);
}

function convertMarkdownFilesToHTML(filepaths, outputDirectory, onComplete){
  const summaries = [];
  filepaths.forEach(filepath => buildArticle(filepath, outputDirectory, summary => summaries.push(summary)));
  homepageService.build(summaries, outputDirectory);
  fileService.write(`${outputDirectory}/posts.json`, JSON.stringify(summaries));
  handleCompletion(onComplete);
}

function buildArticle(filepath, outputDirectory, onComplete){
  const { summary, article } = articleService.build(filepath);
  const filename = buildArticleFilename(outputDirectory, filepath);
  if(!summary.external) fileService.write(filename, domService.minifyHTML(article));
  onComplete(summary);
}

function buildArticleFilename(outputDirectory, filepath){
  const filename = path.basename(filepath).replace(/.md$/, '');
  return path.join(outputDirectory, `./${filename}/index.html`);
}

function createDemoPost(sourceDirectory, outputDirectory, onComplete){
  const template = templateService.getDemoPostTemplate();
  const filename = path.join(sourceDirectory, 'introducing-triven.md');
  const data = template.replace('{date}', dateService.buildTodayISODate());
  const onWriteSuccess = () => _public.init(onComplete, { silent: true });
  fileService.write(filename, data, onWriteSuccess);
}

function handleCompletion(onComplete){
  console.log('Files successfully built!');
  onComplete && onComplete();
}

module.exports = _public;
