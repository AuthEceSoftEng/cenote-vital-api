module.exports = (json) => {
  for (let i = 0; i < json.length; i += 1) {
    const obj = json[i];
    Object.keys(obj).forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(obj, prop) && obj[prop] !== null && !Number.isNaN(Number(obj[prop]))) {
        obj[prop] = +obj[prop];
      }
    });
  }
  return json;
};
