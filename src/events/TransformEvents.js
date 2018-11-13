const parseArg = arg => {
    if (!arg) {
        return 0;
    }

    if (isNaN(arg)) {
        return arg.replace(/\./, 'variables.');
    }

    return arg;
}

module.exports = {

    TranslateEvent (args) {
        args = Object.assign({x: 0, y: 0, z: 0}, args);
        return object_id => `${object_id}.transform.translate(
            ${parseArg(args.x)}, ${parseArg(args.y)}, ${parseArg(args.z)}
        );`;
    },

    ScaleEvent (args) {
        args = Object.assign({x: 0, y: 0, z: 0}, args);
        return () => ``;
    }, 

    RotateEvent (args) {
        args = Object.assign({x: 0, y: 0, z: 0}, args);
        return object_id => `${object_id}.transform.rotate(
            ${parseArg(args.x)}, ${parseArg(args.y)}, ${parseArg(args.z)}
        );`;
    }

}