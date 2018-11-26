/*
* @title Scene
*
* @description 
*
* @arg 
*
* @return Scene
*/
module.exports = (renderBlocks) => {

    return `

        var isSceneDirty = true;
        let lastRender = new Date().getTime();
        function render () {

            if (isSceneDirty) {
                const thisRender = new Date().getTime();

                if ((thisRender - lastRender) >= 16) {
                    webgl.clear(webgl.DEPTH_BUFFER_BIT);
                    webgl.clear(webgl.COLOR_BUFFER_BIT);

                    ${renderBlocks.join('\n')}

                    lastRender = new Date().getTime()
                    isSceneDirty = false;
                }
            }
            
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    `;
}