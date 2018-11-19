module.exports = (innerClass) => {
    function Wrapper (parent, statements) {
        const instanceOfClass = new innerClass(parent, statements);
    
        return new Proxy(
            instanceOfClass, {
                get: (target, name) => {
                    if (target[name]) {
                        return typeof target[name] == 'function' ? 
                            target[name].bind(target) : target[name];
                    }

                    if (typeof target[name] === 'string') {
                        return target.parent[name];
                    }
                }
            }
        )
    }

    Wrapper.getConfig = innerClass.getConfig;
    
    return Wrapper;
};