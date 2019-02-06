const chrono = require('chrono-node');

function groupBy(items, key, wayOfGrouping, target = '', p = 100) {
  const tmp = items.reduce((result, item) => ({ ...result, [item[key]]: [...(result[item[key]] || []), item] }), {});
  const results = [];
  if (wayOfGrouping === 'count') {
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: tmp[value].length }));
  } else if (wayOfGrouping === 'minimum') {
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: Math.min(...tmp[value].map(el => el[target])) }));
  } else if (wayOfGrouping === 'maximum') {
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: Math.max(...tmp[value].map(el => el[target])) }));
  } else if (wayOfGrouping === 'sum') {
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: tmp[value].map(el => el[target]).reduce((a, b) => a + b, 0) }));
  } else if (wayOfGrouping === 'average') {
    Object.keys(tmp).forEach(value => results.push({
      [key]: value,
      result: tmp[value].map(el => el[target]).reduce((a, b) => a + b, 0) / tmp[value].length,
    }));
  } else if (wayOfGrouping === 'median') {
    const median = (values) => {
      values.sort((a, b) => a - b);
      if (values.length === 0) return 0;
      const half = Math.floor(values.length / 2);
      if (values.length % 2) return values[half];
      return (values[half - 1] + values[half]) / 2.0;
    };
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: median(tmp[value].map(el => el[target])) }));
  } else if (wayOfGrouping === 'percentile') {
    const percentle = (arr, per) => {
      if (arr.length === 0) return 0;
      arr.sort((a, b) => a - b);
      if (per <= 0) return arr[0];
      if (per >= 100) return arr[arr.length - 1];
      return arr[Math.ceil(arr.length * (per / 100)) - 1];
    };
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: percentle(tmp[value].map(el => el[target]), p) }));
  } else if (wayOfGrouping === 'count_unique') {
    Object.keys(tmp).forEach(value => results.push({ [key]: value, result: [...new Set(tmp[value].map(el => el[target]))].length }));
  } else if (wayOfGrouping === 'select_unique') {
    Object.keys(tmp).forEach((value) => {
      const alreadyIncluded = [];
      results.push({
        [key]: value,
        result: tmp[value].filter((el) => {
          if (alreadyIncluded.includes(el[target])) return false;
          alreadyIncluded.push(el[target]);
          return true;
        }).map(el => el[target]),
      });
    });
  }
  return results.length ? results : items;
}

function isJSON(str) {
  try {
    return (JSON.parse(str) && !!str);
  } catch (e) {
    return false;
  }
}

function applyFilter(filter, results) {
  if (filter.operator === 'ne') {
    results = results.filter(el => el[filter.property_name] !== filter.property_value);
  } else if (filter.operator === 'exists') {
    if (filter.property_value) {
      results = results.filter(el => Object.keys(el).includes(filter.property_name));
    } else {
      results = results.filter(el => !Object.keys(el).includes(filter.property_name));
    }
  } else if (filter.operator === 'in') {
    const tmp = Array.isArray(filter.property_value) ? filter.property_value : [filter.property_value];
    results = results.filter(el => tmp.includes(el[filter.property_name]));
  } else if (filter.operator === 'or') {
    filter.operands.forEach((operand) => {
      if (operand.operator === 'eq') {
        results = results.filter(el => el[operand.property_name] === operand.property_value);
      } else if (operand.operator === 'ne') {
        results = results.filter(el => el[operand.property_name] !== operand.property_value);
      } else if (operand.operator === 'lt') {
        results = results.filter(el => el[operand.property_name] < operand.property_value);
      } else if (operand.operator === 'lte') {
        results = results.filter(el => el[operand.property_name] <= operand.property_value);
      } else if (operand.operator === 'gt') {
        results = results.filter(el => el[operand.property_name] > operand.property_value);
      } else if (operand.operator === 'gte') {
        results = results.filter(el => el[operand.property_name] >= operand.property_value);
      } else if (operand.operator === 'exists') {
        if (operand.property_value) {
          results = results.filter(el => Object.keys(el).includes(operand.property_name));
        } else {
          results = results.filter(el => Object.keys(el).includes(operand.property_name));
        }
      } else if (operand.operator === 'in') {
        const tmp = Array.isArray(operand.property_value) ? operand.property_value : [operand.property_value];
        results = results.filter(el => tmp.includes(el[operand.property_name]));
      }
    });
  }
  return results;
}

function parseTimeframe(relTimeframe) {
  if (typeof relTimeframe !== 'string') return '';
  if (relTimeframe.split('_').length !== 3) return '';
  relTimeframe = relTimeframe.split('_');
  const nlpDate = `${relTimeframe[1]} ${relTimeframe[2]} ago`;
  const now = new Date();
  const jsDate = chrono.parseDate(nlpDate, now);
  return `cenote_timestamp >= '${jsDate.toISOString()}' AND cenote_timestamp ${relTimeframe[0] === 'this' ? '<=' : '<'} '${now.toISOString()}'`;
}

module.exports = { isJSON, applyFilter, parseTimeframe, groupBy };
