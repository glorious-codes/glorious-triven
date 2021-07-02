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
  stylesService.buildBaseStyle(outputDirectory);
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
  filepaths.forEach(filepath => {
    const { summary, article } = articleService.build(filepath);
    if(!summary.external) {
      fileService.write(
        buildArticleFilename(outputDirectory, filepath),
        domService.minifyHTML(article)
      );
    }
    summaries.push(summary);
  });
  homepageService.build(summaries, outputDirectory);
  fileService.write(`${outputDirectory}/posts.json`, JSON.stringify(summaries));
  handleCompletion(onComplete);
}

function buildArticleFilename(outputDirectory, filepath){
  const filename = path.basename(filepath).replace('.md', '.html');
  return path.join(outputDirectory, filename);
}

function createDemoPost(sourceDirectory, outputDirectory, onComplete){
  const template = templateService.getDemoPostTemplate();
  const data = template.replace('{date}', dateService.buildTodayISODate());
  fileService.write(path.join(sourceDirectory, 'introducing-triven.md'), data, () => {
    _public.init(onComplete, { silent: true });
  });
}

function handleCompletion(onComplete){
  console.log('Files successfully built!');
  onComplete && onComplete();
}

module.exports = _public;
