const { mockTrivenConfig } = require('./testing');
const configService = require('./config');
const articleDateService = require('./article-date');

describe('Article Date Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    configService.flush();
  });

  it('should return an empty string if no date has been given', () => {
    expect(articleDateService.format()).toEqual('');
  });

  it('should format a date containing day, month and year separated by slash by default', () => {
    expect(articleDateService.format('2022-03-27')).toEqual('27/03/2022');
  });

  it('should optionally format a date containing month, day, and year separated by slash for american english language', () => {
    expect(articleDateService.format('2022-03-27', 'en-US')).toEqual('3/27/2022');
  });

  it('should optionally format a date according formatter passed on triven config file', () => {
    const isoDateString =  '2022-03-27';
    const lang = 'en-US';
    mockTrivenConfig({
      formatters: {
        date: (isoDateString, lang) => `${isoDateString} ${lang}`
      }
    });
    expect(articleDateService.format(isoDateString, lang)).toEqual(`${isoDateString} ${lang}`);
  });
});
