module.exports = (filters) => {
  let filterQuery = 'AND ';
  filters.filter(el => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(el.operator)).forEach((filter, ind, arr) => {
    if (filter.operator === 'eq') {
      filterQuery += `"${filter.property_name}" = ${filter.property_value}`;
    } else if (filter.operator === 'lt') {
      filterQuery += `"${filter.property_name}" < ${filter.property_value}`;
    } else if (filter.operator === 'lte') {
      filterQuery += `"${filter.property_name}" <= ${filter.property_value}`;
    } else if (filter.operator === 'gt') {
      filterQuery += `"${filter.property_name}" > ${filter.property_value}`;
    } else if (filter.operator === 'gte') {
      filterQuery += `"${filter.property_name}" >= ${filter.property_value}`;
    }
    if (ind !== arr.length - 1) filterQuery += ' AND ';
  });
  return filterQuery !== 'AND ' ? filterQuery : '';
};
