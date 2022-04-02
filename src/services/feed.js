const configService = require('./config');
const dateService = require('./date');
const timeService = require('./time');
const { fileService } = require('./file');

const _public = {};

_public.build = (posts, lang) => {
  const config = configService.get();
  const fileDetails = buildFileDetails(config, lang);
  if(config.url) {
    const content = buildFileContent(posts, config, fileDetails).trim();
    fileService.write(`${handleOutputDirectory(config, lang)}/feed.atom`, content);
  }
};

function buildFileDetails(config, customLang){
  const lang = customLang || config.lang;
  const baseUrl = customLang ? `${config.url}/l/${customLang}` : config.url;
  return { lang, baseUrl };
}

function handleOutputDirectory(config, lang){
  return lang ? `${config.outputDirectory}/l/${lang}` : config.outputDirectory;
}

function buildFileContent(posts, { url, title }, fileDetails){
  return `
<?xml version="1.0" encoding="UTF-8"?>
<feed xml:lang="${fileDetails.lang}" xmlns="http://www.w3.org/2005/Atom">
  <id>${fileDetails.baseUrl}/</id>
  <title>${title}</title>
  <link rel="alternate" type="text/html" href="${fileDetails.baseUrl}/"/>
  <link rel="self" type="application/atom+xml" href="${fileDetails.baseUrl}/feed.atom"/>
  <updated>${buildNowFeedDate()}</updated>
  <author>
    <name>${title}</name>
  </author>${posts.map(postSummary => buildEntry(postSummary, url)).join('')}
</feed>`;
}

function buildEntry(postSummary, blogBaseUrl){
  const { date, title, description, keywords, excerpt, url, external } = postSummary;
  const uri = buildEntryURI({ url, external }, blogBaseUrl);
  const isoDateString = formatFeedPublicationDate({ date, title, description, keywords });
  return `
  <entry>
    <id>${uri}</id>
    <title>${title}</title>
    <link rel="alternate" type="text/html" href="${uri}"/>
    <published>${isoDateString}</published>
    <updated>${isoDateString}</updated>
    <summary>
      ${excerpt}
    </summary>
  </entry>`;
}

function buildEntryURI({ url, external }, blogBaseUrl){
  return external ? url : `${blogBaseUrl}/${url.replace('.html', '')}`;
}

function buildNowFeedDate(){
  const date = new Date();
  return dateService.removeSecondsFractionFromISOString(date.toISOString());
}

function formatFeedPublicationDate({ date, title, description = '', keywords = '' }){
  const time = timeService.convertTextLengthToTime(`${title}${description}${keywords}`);
  return `${date}T${time}Z`;
}

module.exports = _public;
