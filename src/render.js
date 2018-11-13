const Transform = require('./transform/Transform.js');
const Shaders = require('./shader/Shaders.js');
const GeometryBatch = require('./geometry_batch.js');

/*
* @title Scene
*
* @description 
*
* @arg 
*
* @return Scene
*/
module.exports = (shaders) => {
    return `

        let lastRender = new Date().getTime();
        function render () {

            const thisRender = new Date().getTime();
            if (thisRender - lastRender < 16) {
                return;
            }
            
            webgl.clear(webgl.DEPTH_BUFFER_BIT);
            webgl.clear(webgl.COLOR_BUFFER_BIT);

            ${Object.keys(shaders).map(
                shader => shaders[shader].generateRenderBlock()
            ).join('\n')}

        }
        
    `;
}