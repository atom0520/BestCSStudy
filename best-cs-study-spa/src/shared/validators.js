export const required = (val) => val && val.length;
export const maxLength = (len) => (val) => !(val) || (val.length <= len);
export const minLength = (len) => (val) => val && (val.length >= len); 
export const validDate = (val) => /\d{4}-\d{2}-\d{2}/.test(val);