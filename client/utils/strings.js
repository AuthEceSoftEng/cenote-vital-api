import concat from 'ramda/src/concat';
import toUpper from 'ramda/src/toUpper';
import head from 'ramda/src/head';
import tail from 'ramda/src/tail';

export const capitalize = string => concat(toUpper(head(string)), tail(string));
export const placeholder = () => {};
