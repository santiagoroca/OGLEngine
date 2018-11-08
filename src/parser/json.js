const read = require("fs").readFileSync;

module.exports = (url) => {
    return JSON.parse(read(url));
}
