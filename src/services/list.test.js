const listService = require('./list');

describe('List Service', () => {
  function buildList(numbeOfItems){
    const list = [];
    for (let i = 1; i <= numbeOfItems; i++) list.push(i);
    return list;
  }

  it('should divide a list by 10 by default', () => {
    const pages = listService.divideByNumberOfItems(buildList(23));
    expect(pages[0]).toEqual([1,2,3,4,5,6,7,8,9,10]);
    expect(pages[1]).toEqual([11,12,13,14,15,16,17,18,19,20]);
    expect(pages[2]).toEqual([21,22,23]);
  });

  it('should optionally divide a list by custom number of items', () => {
    const pages = listService.divideByNumberOfItems(buildList(24), { numberOfItems: 6 });
    expect(pages[0]).toEqual([1,2,3,4,5,6]);
    expect(pages[1]).toEqual([7,8,9,10,11,12]);
    expect(pages[2]).toEqual([13,14,15,16,17,18]);
    expect(pages[3]).toEqual([19,20,21,22,23,24]);
  });

  it('should reject repeated values in a list', () => {
    const list = [1, 'a', 'a', '1', 2, 2, 3, true, 'true', true];
    expect(listService.rejectRepeatedValues(list)).toEqual([
      1, 'a', '1', 2, 3, true, 'true'
    ]);
  });
});
