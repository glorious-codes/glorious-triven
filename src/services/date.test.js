const dateService = require('./date');

describe('Date Service', () => {
  let originalDateNowMethod = Date.now;

  function appendLeadingZero(number){
    return number < 10 ? `0${number}` : number;
  }

  function mockDate(year, month, day){
    Date.now = jest.fn(() => {
      const date = new Date(year, month, day);
      return date.getTime();
    });
  }

  afterAll(() => {
    Date.now = originalDateNowMethod;
  });

  it('should build today ISO date not appending leading zero to month or day by default', () => {
    mockDate(2021, 9, 15);
    expect(dateService.buildTodayISODate()).toEqual('2021-10-15');
  });

  it('should build today ISO date appending leading zero to month and day if they are lower than 10', () => {
    mockDate(2021, 7, 2);
    expect(dateService.buildTodayISODate()).toEqual('2021-08-02');
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
