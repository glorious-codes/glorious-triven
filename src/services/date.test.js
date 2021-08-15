const dateService = require('./date');

describe('Date Service', () => {
  function appendLeadingZero(number){
    return number < 10 ? `0${number}` : number;
  }

  it('should build today ISO date', () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = appendLeadingZero(date.getMonth() + 1);
    const day = appendLeadingZero(date.getDate());
    expect(dateService.buildTodayISODate()).toEqual(`${year}-${month}-${day}`);
  });

  it('should format date as day/month/year as default', () => {
    const date = '2021-06-18';
    expect(dateService.format(date)).toEqual('18/06/2021');
  });

  it('should format date as month/day/year for american english language', () => {
    const date = '2021-06-18';
    const lang = 'en-US';
    expect(dateService.format(date, lang)).toEqual('6/18/2021');
  });

  it('should return date as empty string if no ISO date string has been given', () => {
    expect(dateService.format()).toEqual('');
  });

  it('should remove seconds fraction from ISO date string', () => {
    const date = new Date();
    const isoDate = new Date(date.toISOString());
    const year = isoDate.getUTCFullYear();
    const month = appendLeadingZero(isoDate.getUTCMonth() + 1);
    const day = appendLeadingZero(isoDate.getUTCDate());
    const hours = appendLeadingZero(isoDate.getUTCHours());
    const minutes = appendLeadingZero(isoDate.getUTCMinutes());
    const seconds = appendLeadingZero(isoDate.getUTCSeconds());
    const expectedString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    const result = dateService.removeSecondsFractionFromISOString(isoDate.toISOString());
    expect(result).toEqual(expectedString);
  });
});
