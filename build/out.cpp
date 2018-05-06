
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
        
                    glutInit(&argc, argv);
                    glutInitWindowSize(600, 800);
                    glutInitWindowPosition(150, 150);
                    glutCreateWindow("Test");
                    glutDisplayFunc(display);
                    glutMainLoop();
                
                return 0;
            }
        