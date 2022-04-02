const _public = {};

const ONE_HOUR_IN_SECONDS = 3600;
const ONE_MINUTE_IN_SECONDS = 60;
const MAX_HOURS = 24;
const MAX_TIME = '23:59:59';

_public.convertTextLengthToTime = text => {
  const totalSeconds = getTotalSecondsFromTextLength(text);
  const hours = parseInt(totalSeconds / ONE_HOUR_IN_SECONDS);
  const minutesInSeconds = parseInt(totalSeconds % ONE_HOUR_IN_SECONDS);
  const minutes = parseInt(minutesInSeconds / ONE_MINUTE_IN_SECONDS);
  const seconds = parseInt(minutesInSeconds % ONE_MINUTE_IN_SECONDS);
  return hours >= MAX_HOURS ? MAX_TIME : formatTime(hours, minutes, seconds);
};

function getTotalSecondsFromTextLength(text){
  return (text && text.length) || 0;
}

function formatTime(hours, minutes, seconds){
  return [
    appendLeadingZero(hours),
    appendLeadingZero(minutes),
    appendLeadingZero(seconds)
  ].join(':');
}

function appendLeadingZero(number){
  return number < 10 ? `0${number}` : number;
}

module.exports = _public;
