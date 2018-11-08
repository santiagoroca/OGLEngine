const parseArg = arg => {
    if (!arg) {
        return 0;
    }

    if (isNaN(arg)) {
        return arg.replace(/\./, 'event.');
    }

    return arg;
}

module.exports = {

    TranslateEvent (args) {
        return ` this.transform.translate(
            ${parseArg(args.x)}, ${parseArg(args.y)}, ${parseArg(args.z)}
        );`;
    },

    ScaleEvent (args) {
        return `
        `
    }, 

    RotateEvent (args) {
        return ` this.transform.rotate(
            ${parseArg(args.x)}, ${parseArg(args.y)}, ${parseArg(args.z)}
        );`;
    }

}