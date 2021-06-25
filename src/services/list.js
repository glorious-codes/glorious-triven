const _public = {};

_public.divideByNumberOfItems = (items, { numberOfItems = 10 } = {}) => {
  const pages = [];
  splitItemsInPages(pages, items, numberOfItems);
  return pages;
};

function splitItemsInPages(pages, items, numberOfItems){
  pages.push(getSlice(items, numberOfItems));
  if(items.length) splitItemsInPages(pages, items, numberOfItems);
}

function getSlice(items, numberOfItems){
  const slice = [];
  for (let i = 0; i < numberOfItems; i++) {
    const item = items.shift();
    if(item) slice.push(item);
  }
  return slice;
}

module.exports = _public;
