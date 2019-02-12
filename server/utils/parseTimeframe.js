const chrono = require('chrono-node');

const isJSON = require('./isJSON');

module.exports = (timeframe) => {
  const now = new Date();
  if (isJSON(timeframe)) {
    const time = JSON.parse(timeframe);
    return `WHERE ${time.start ? `cenote_timestamp >= '${time.start}' AND` : ''} cenote_timestamp <= '${time.end || now.toISOString()}'`;
  }
  if (!timeframe || typeof timeframe !== 'string' || timeframe.split('_').length !== 3) return `WHERE cenote_timestamp <= '${now.toISOString()}'`;
  timeframe = timeframe.split('_');
  const nlpDate = `${timeframe[1]} ${timeframe[2]} ago`;
  const jsDate = chrono.parseDate(nlpDate, now);
  return `WHERE cenote_timestamp >= '${jsDate.toISOString()}' AND cenote_timestamp ${timeframe[0] === 'this' ? '<=' : '<'} '${now.toISOString()}'`;
};
