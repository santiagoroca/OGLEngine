const Entity = require('../entity/Entity');
const Transform = require('../entity/Transform.js');
const hash = require('../runtime/helper.js').hash;

class Cameras {

    constructor (cameras = []) {
        this.cameras = cameras;
    }

    toString () {


        return `

            let activeCamera = null;

            function enableCamera (camera) {
                activeCamera = camera; 
            }

            ${
                this.cameras.map(
                    camera => `
                        ${camera.toString()}
                    `
                ).join('\n')
            }

            let algo = false;
            document.addEventListener('mouseup', event => {
                if (event.button != 2) {
                    return;
                }

                if (algo) {
                    enableCamera(${this.cameras[0].getName()})
                } else {
                    enableCamera(${this.cameras[1].getName()})
                }

                isSceneDirty = true;
                algo = !algo;
            })

        `
    }

}

module.exports = Cameras;