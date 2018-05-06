use Parser::Parser as OtherParser;
use Parser::Block;

#[derive(Debug, PartialEq, Clone)]
pub struct Compiler {
    pub parser: OtherParser
}

impl Compiler {

    pub fn compile (&mut self) -> String {

        // Output Program
        let mut out = String::new();

        // Attach C++ header to file
        out.push_str("
            #import <iostream>
            #include <GL/gl.h>
            #include <GL/glu.h>
            #include <GL/glut.h>

            using namespace std;

            void display() {
               glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
               glClear(GL_COLOR_BUFFER_BIT);

               glBegin(GL_QUADS);
                  glColor3f(1.0f, 0.0f, 0.0f);
                  glVertex2f(-0.5f, -0.5f);
                  glVertex2f( 0.5f, -0.5f);
                  glVertex2f( 0.5f,  0.5f);
                  glVertex2f(-0.5f,  0.5f);
                  
               glEnd();

               glFlush();
            }

            int main (int argc, char** argv) {
        ");

        // Tell the parser to start parsing
        // This also tells the tokenizer to start converting
        let blocks = self.parser.parse();

        // Create the program tree for each Block
        for block in blocks {
            out.push_str(&self.build_block(block));
        }

        // Attach C++ footer to file
        out.push_str("
                return 0;
            }
        ");

        out

    }

    fn build_block (&self, block: Block) -> String {

        // Create the program tree for each Block
        match block._type.as_ref() {
            "scene" => self.build_scene(block),
            _       => String::new()
        }

    }

    fn build_scene (&self, block: Block) -> String {

        // Output Program
        let mut out = String::new();

        out.push_str(
            &format!(
                "
                    glutInit(&argc, argv);
                    glutInitWindowSize({}, {});
                    glutInitWindowPosition(150, 150);
                    glutCreateWindow(\"Test\");
                    glutDisplayFunc(display);
                    glutMainLoop();
                ",
                block._args[0]._value,
                block._args[1]._value
            )
        );

        out

    }

}
