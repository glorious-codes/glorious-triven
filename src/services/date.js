const _public = {};

_public.buildTodayISODate = () => {
  const date = new Date();
  return [date.getFullYear(), appendLeadingZero(date.getMonth() + 1), appendLeadingZero(date.getDate())].join('-');
};

_public.format = (isoDateString, lang) => {
  const [year, month, day] = isoDateString.split('-');
  return lang == 'en-US' ? `${parseInt(month)}/${parseInt(day)}/${year}` : `${day}/${month}/${year}`;
};

function appendLeadingZero(number){
  return number >= 10 ? number : `0${number}`;
}

module.exports = _public;
