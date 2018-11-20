const Entity = require('./Entity');
const { hash } = require('../runtime/helper.js');
const write = require('fs').writeFileSync;
const read = require('fs').readFileSync;

module.exports = class Events extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'cubemaps',
            singular: 'cubemap',
            defaults: {
                top: undefined,
                bottom: undefined,
                left: undefined,
                right: undefined,
                back: undefined,
                front: undefined,
            }
        })
    }

    writeFaceToFile (texture) {
        const ext = texture.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `textures/${name}.${ext}`;
        write(`./dist/${path}`, read(texture));
        return path;
    }

    toString () {
        const faces = [this.top, this.bottom, this.left, this.right, this.back, this.front];

        if (faces.filter(face => face == undefined).length) {
            console.log('Ignoring Cubemap due to missing face.');
            return '';
        }

        this.top = this.writeFaceToFile(this.top);
        this.bottom = this.writeFaceToFile(this.bottom);
        this.left = this.writeFaceToFile(this.left);
        this.right = this.writeFaceToFile(this.right);
        this.back = this.writeFaceToFile(this.back);
        this.front = this.writeFaceToFile(this.front);

        return `

            const cube_map_texture = webgl.createTexture();

            const cube_map_image_top = new Image();
            cube_map_image_top.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_top);
            }
            cube_map_image_top.src = '${this.top}';

            const cube_map_image_bottom = new Image();
            cube_map_image_bottom.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_bottom);
            }
            cube_map_image_bottom.src = '${this.bottom}';

            const cube_map_image_left = new Image();
            cube_map_image_left.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_left);
            }
            cube_map_image_left.src = '${this.left}';

            const cube_map_image_right = new Image();
            cube_map_image_right.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_right);
            }
            cube_map_image_right.src = '${this.right}';

            const cube_map_image_front = new Image();
            cube_map_image_front.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_front);
            }
            cube_map_image_front.src = '${this.front}';

            const cube_map_image_back = new Image();
            cube_map_image_back.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_back);
            }
            cube_map_image_back.src = '${this.back}';

        `;
    }

}