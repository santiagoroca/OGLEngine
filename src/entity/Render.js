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

        let lastRender = new Date().getTime();
        function render () {

            const thisRender = new Date().getTime();
            if (thisRender - lastRender < 16) {
                return;
            }
            
            webgl.clear(webgl.DEPTH_BUFFER_BIT);
            webgl.clear(webgl.COLOR_BUFFER_BIT);

            ${renderBlocks.join('\n')}

        }
        
    `;
}