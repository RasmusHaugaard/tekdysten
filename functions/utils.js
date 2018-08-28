exports.objToList = obj => (
  Object.keys(obj).map(key => {
    const valObj = obj[key];
    valObj.key = key;
    return valObj;
  })
);
