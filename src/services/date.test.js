const dateService = require('./date');

describe('Date Service', () => {
  it('should build today ISO date', () => {
    const dateMock = new Date(2021, 5, 25);
    Date = jest.fn(() => dateMock);
    expect(dateService.buildTodayISODate()).toEqual('2021-06-25');
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
});
