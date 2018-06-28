use std::io::prelude::*;
use std::fs::File;
use std::error::Error;
use Geometry::Geometry;

pub struct GeometryWriter {
    pub vertices: File,
    pub faces: File,
    pub loaders: String
}

impl GeometryWriter {

    pub fn new () -> GeometryWriter {
        GeometryWriter  {

            vertices: match File::create("./build/vertices") {
                Err(why) => panic!("couldn't create file: {}",  why.description()),
                Ok(file) => file,
            },

            faces: match File::create("./build/faces") {
                Err(why) => panic!("couldn't create file: {}",  why.description()),
                Ok(file) => file,
            },

            loaders: String::from("
                (async function () {

                    let vertices = await fetch('vertices');
                        vertices = await vertices.arrayBuffer();

                    let faces = await fetch('faces');
                        faces = await faces.arrayBuffer();

                    vbuffer = webgl.createBuffer ();
                    webgl.bindBuffer(webgl.ARRAY_BUFFER, vbuffer);
                    webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);
                    webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                    fbuffer = webgl.createBuffer ();
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, fbuffer);
                    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, faces, webgl.STATIC_DRAW);
                    webgl.drawElements(webgl.TRIANGLES, new Uint16Array(faces).length, webgl.UNSIGNED_SHORT, 0);

                })();
            ")
            
        }

    }

    pub fn write (&mut self, mut geometry: Geometry) {
        self.vertices.write(geometry.getVerticesAs8Vec());
        self.faces.write(geometry.getFacesAs8Vec());
    }

}
