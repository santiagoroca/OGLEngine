module.exports = {
    hash: () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
    log: text => console.log(text),
    capitalize: string => string.charAt(0).toUpperCase() + string.slice(1)
}