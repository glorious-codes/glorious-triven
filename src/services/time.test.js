const fs = require('fs');
const path = require('path');
const timeService = require('./time');

describe('Time Service', () => {
  function getTextByFilename(filename){
    return fs.readFileSync(path.join(__dirname, `../mocks/${filename}.txt`));
  }

  it('should convert some text to hours, minutes and seconds', () => {
    const shortText = 'This is a sample of text';
    const mediumText = getTextByFilename('medium-text');
    const longText = getTextByFilename('long-text');
    const overflowingText = getTextByFilename('overflowing-text');
    expect(timeService.convertTextLengthToTime()).toEqual('00:00:00');
    expect(timeService.convertTextLengthToTime(shortText)).toEqual('00:00:24');
    expect(timeService.convertTextLengthToTime(mediumText)).toEqual('00:44:31');
    expect(timeService.convertTextLengthToTime(longText)).toEqual('01:30:53');
    expect(timeService.convertTextLengthToTime(overflowingText)).toEqual('23:59:59');
  });
});
