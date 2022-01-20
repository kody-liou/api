const { compile } = require('json-schema-to-typescript');
const fs = require('fs');
const user = require('../src/schema/user');

const allSchema = {
  ...user,
};
const schemaKeys = Object.keys(allSchema);

schemaKeys.forEach(schemaKey => {
  const jsonSchema = allSchema[schemaKey];
  compile(jsonSchema, schemaKey).then((ts) => {
    if (!fs.existsSync('src/generated')) fs.mkdirSync('src/generated');
    if (!fs.existsSync('src/generated/types')) {
      fs.mkdirSync('src/generated/types');
    }
    fs.writeFileSync(`src/generated/types/${schemaKey}.ts`, ts);
  });
  // fs.writeFileSync(`../client/lib/schema/${schemaKey}.dart`, `final ${schemaKey} = ${JSON.stringify(jsonSchema)};`)
});
