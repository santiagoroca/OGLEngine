const json = require('./json.js');
const obj = require('./obj.js');

module.exports = (filePath) => {
    const ext = filePath.match(/[^\.]+$/)[0];

    switch (ext) {
        case 'json': return json(filePath);
        case 'obj': return obj(filePath);
    }
}