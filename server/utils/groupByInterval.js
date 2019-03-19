const moment = require('moment');

const percentile = require('./percentile');

module.exports = (items, interval, type, target = '', p = 100) => {
  if (!['minutely', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'].includes(interval)) {
    throw Object({ message: '`interval` must be one of `minutely`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`' });
  }
  const results = [];
  const grouped = {};
  items.forEach((value) => {
    let d = moment(value.cenote$timestamp);
    if (interval === 'minutely') d = d.minute();
    if (interval === 'hourly') d = d.hour();
    if (interval === 'daily') d = d.dayOfYear();
    if (interval === 'weekly') d = d.weekYear();
    if (interval === 'monthly') d = d.month();
    if (interval === 'yearly') d = d.year();
    grouped[d] = grouped[d] || [];
    grouped[d].push(value);
  });
  Object.keys(grouped).forEach((val) => {
    if (interval === 'minutely') results.push({ interval: moment().minute(val).format('DD-MMM-YYYY:HH:mm'), result: grouped[val] });
    if (interval === 'hourly') results.push({ interval: moment().hour(val).minute(0).format('DD-MMM-YYYY:HH:mm'), result: grouped[val] });
    if (interval === 'daily') results.push({ interval: moment().dayOfYear(val).format('DD-MMM-YYYY'), result: grouped[val] });
    if (interval === 'weekly') results.push({ interval: moment().weekYear(val).format('DD-MMM-YYYY'), result: grouped[val] });
    if (interval === 'monthly') results.push({ interval: moment().month(val).format('MMM-YYYY'), result: grouped[val] });
    if (interval === 'yearly') results.push({ interval: moment().year(val).format('YYYY'), result: grouped[val].length });
  });
  if (type === 'count') return results.map(el => ({ ...el, result: el.result.length }));
  if (type === 'minimum') return results.map(el => ({ ...el, result: Math.min(...el.result.map(ele => ele[target])) }));
  if (type === 'maximum') return results.map(el => ({ ...el, result: Math.max(...el.result.map(ele => ele[target])) }));
  if (type === 'sum') return results.map(el => ({ ...el, result: el.result.map(ele => ele[target]).reduce((a, b) => a + b, 0) }));
  if (type === 'average') return results.map(el => ({ ...el, result: el.result.map(e => e[target]).reduce((a, b) => a + b, 0) / el.result.length }));
  if (type === 'median') return results.map(el => ({ ...el, result: percentile(el.result.map(ele => ele[target]), 50) }));
  if (type === 'percentile') return results.map(el => ({ ...el, result: percentile(el.result.map(ele => ele[target]), p) }));
  if (type === 'count_unique') return results.map(el => ({ ...el, result: [...new Set(el.result.map(ele => ele[target]))].length }));
  if (type === 'select_unique') return results.map(el => ({ ...el, result: [...new Set(el.result.map(ele => ele[target]))] }));

  return results;
};
