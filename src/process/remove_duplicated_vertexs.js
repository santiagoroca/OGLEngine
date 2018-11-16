/*
* Remove Duplicated Vertexs
* 
* Will attemp to merge all duplicated vertices 
* to avoid sharp edges. 
* 
* In the future this should be able to identify
* edges that should not be merged.
*
*/
module.exports = (vertexs, indexes, normals) => {
    const new_indexes = [];
    const seen_vertex = {};
    
    for (let index of indexes) {
        const v_index = index * 3;
        const key = `${vertexs[v_index]}${vertexs[v_index+1]}${vertexs[v_index+2]}`

        if (seen_vertex[key] != undefined) {
            new_indexes.push(seen_vertex[key]);
        } else {
            seen_vertex[key] = index;
            new_indexes.push(index);
        }
    }

    return { indexes: new_indexes };
}