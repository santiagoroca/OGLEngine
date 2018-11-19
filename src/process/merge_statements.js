module.exports = (statements0, statements1) => {
    const setVariable = [];
    const extendClass = [];
    const addClass = [];
    const setClass = [];
    const others = [];

    for (let [ method, argument ] of statements0) {
        method = method.trim();

        switch (method) {
            case '0setVariable': setVariable.push([method, argument]); break;
            case '1extendClass': extendClass.push([method, argument]); break;
            case '2addClass': addClass.push([method, argument]); break;
            case '3setClass': setClass.push([method, argument]); break;
            default: others.push([method, argument])
        }
    }

    for (let [ method, argument ] of statements1) {
        method = method.trim();

        switch (method) {
            case '0setVariable': setVariable.push([method, argument]); break;
            case '1extendClass': extendClass.push([method, argument]); break;
            case '2addClass': addClass.push([method, argument]); break;
            case '3setClass': setClass.push([method, argument]); break;
            default: others.push([method, argument])
        }
    }

    return [
        ...setVariable, ...extendClass, ...addClass, ...setClass, ...others
    ];
}