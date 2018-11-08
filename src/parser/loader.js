const json = require('./json.js');

module.exports = (filePath) => {
    const ext = filePath.match(/[^\.]+$/)[0];

    switch (ext) {
        case 'json': return json(filePath);
    }
}