use Parser::Parser as OtherParser;
use GeometryWriter::GeometryWriter as OtherGeometryWriter;
use Geometry::Geometry;
use Shader::Shader;
use Parser::Block;
use Transformable::Transformable;
use Scene::Scene;

pub struct Compiler {
    pub parser: OtherParser,
    pub geometryWriter: OtherGeometryWriter,
    geometry_offset: u16,
    shader: Shader
}

impl Compiler {

    pub fn new (chars: Vec<char>) -> Compiler {
        Compiler {
           geometryWriter: OtherGeometryWriter::new(),
           parser: OtherParser::new(chars),
           geometry_offset: 0,
           shader: Shader::new()
        }
    }

    pub fn compile (&mut self) -> String {

        // Output Program
        let mut out = String::new();

        // Tell the parser to start parsing
        // This also tells the tokenizer to start converting
        let blocks = self.parser.parse();

        // Create the program tree for each Block
        for block in blocks {
            out.push_str(&self.build_block(block, &mut Geometry::new(Vec::<f32>::new(), Vec::<u16>::new(), 0)));
        }

        out

    }

    fn build_block<T: Transformable> (&mut self, block: Block, parent: &mut T) -> String {

        // Create the program tree for each Block
        match block._type.as_ref() {
            "scene" => self.build_scene(block),
            "cube" => self.build_cube(block),
            "light" => self.build_light(block),
            "translate" => self.build_translate(block, parent),
            "scale" => self.build_scale(block, parent),
            "rotate" => self.build_rotate(block, parent),
            _       => String::new()
        }

    }

    fn build_rotate<T: Transformable> (&mut self, block: Block, parent: &mut T) -> String {
        parent.rotate(
            block._args[0]._value.parse().unwrap(),
            [
                block._args[1]._value.parse().unwrap(),
                block._args[2]._value.parse().unwrap(),
                block._args[3]._value.parse().unwrap()
            ].to_vec()
        );
        String::from("")
    }

    fn build_scale<T: Transformable> (&mut self, block: Block, parent: &mut T) -> String {
        parent.scale(block._args[0]._value.parse().unwrap());
        String::from("")
    }

    fn build_translate<T: Transformable> (&mut self, block: Block, parent: &mut T) -> String {
        parent.translate(
            [
                block._args[0]._value.parse().unwrap(),
                block._args[1]._value.parse().unwrap(),
                block._args[2]._value.parse().unwrap()
            ].to_vec()
        );
        String::from("")
    }

    fn build_light (&mut self, block: Block) -> String {

        self.shader.addLight([
            block._args[0]._value.parse().unwrap(),
            block._args[1]._value.parse().unwrap(),
            block._args[2]._value.parse().unwrap()
        ]);

        String::from("")

    }

    fn build_scene (&mut self, block: Block) -> String {

        // Output Program
        let mut out = String::new();

        let mut scene = Scene::new();

        // Create the program tree for each Block
        for block in block._childs {
            out.push_str(&self.build_block(block, &mut scene));
        }

        let head = String::from(format!("
                {}
                {}
                {}
                {}
                {}
            ",
            scene.canvasConfiguration(),
            self.shader.getShader(),
            scene.getTransformations(),
            out,
            self.geometryWriter.loaders)
        );

        head

    }

    fn build_cube (&mut self, block: Block) -> String {

        //
        let vertices : Vec<f32> = [
            -1.0, -1.0,  1.0, 1.0, -1.0,  1.0, 1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
            -1.0, -1.0, -1.0, -1.0,  1.0, -1.0, 1.0,  1.0, -1.0, 1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
            1.0, -1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0,  1.0, 1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
        ].to_vec();

        //
        let faces : Vec<u16> = [
            0,  1,  2, 0,  2,  3,
            4,  5,  6, 4,  6,  7,
            8,  9,  10, 8,  10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ].to_vec();

        let mut geometry = Geometry::new(vertices, faces, self.geometry_offset);

        self.geometry_offset += geometry.getOffset();

        for block in block._childs {
            self.build_block(block, &mut geometry);
        }

        //
        self.geometryWriter.write(geometry);

        //
        String::from("")

    }

}
