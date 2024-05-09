const { items } = require('./data.json');
const fs = require('fs');
(() => {
  const result = { items: [] };
  for (let item of items) {
    for (let identifier of item.identifiers) {
      let object = JSON.parse(JSON.stringify({ ...item }));
      delete object.identifiers;
      Object.assign(object, { identifier });
      if (item.metadata.data_brand) {
        Object.assign(object.metadata, {
          data_brand: item.metadata.data_brand[identifier],
        });
      }
      result.items.push(object);
    }
  }
  var stringResult = JSON.stringify(result);
  fs.writeFileSync('data2.json', stringResult);
})();
