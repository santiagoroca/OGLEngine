export default `
    scene {

        define Star extends geometry {
            set remove_duplicated_vertexs=false
            set generate_normals=false
            set source='./models/earth/mesh.obj'
            set texture='./models/earth/texture.jpg'
            set material_shininess=20.0
            set rotation=0.05deg
            set size=20.0
            set distance_from_center=100.0
    
            set transform {
                set model {
                    on -> type=ogl.INTERVAL, every=ogl.FRAME, hndl=(rotate -> y=.rotation)
                }
    
                set world {
                    translate -> z=.distance_from_center
                    scale -> size=.size
                }
            }
    
            set material {
                set shininess=.material_shininess
            }
        }
    
        add camera {
            set fov=20.0
            set near=0.1
            set far=1000.0
    
            # This will ovewrite the model transform and add this new 
            # listener
            set transform {
    
                set model {
                    on -> type=ogl.DRAG, btn=ogl.BUTTON0, hndl=(
                        rotate -> x=(.delta_y * -1), y=.delta_x
                    )
    
                    rotate -> y=-160deg
                }
    
                set world {
                    on -> type=ogl.MOUSEWHEEL, hndl=(
                        translate -> z=.delta_z
                    )
    
                    on -> type=ogl.DRAG, btn=ogl.BUTTON2, hndl=(
                        translate -> x=.delta_x, y=.delta_y
                    )
    
                    translate -> z=-25.0
                    translate -> x=5.0
                    translate -> y=-1.5
                }
    
            }
        }
    
        # Directional Light
        add light {
            set type=ogl.POINT
            set position=vec3(0.0, 0.0, 20.0)
        }
    
        add light {
            set type=ogl.AMBIENT
            set color=0x333333
        }
    
        # Eerth
        add Star {
            set specularmap='./models/earth/specular.jpg'
            set material_shininess=20.0
            set rotation=0.05deg
            set size=1.0
            set distance_from_center=0.0
        }
    
        # Sun
        add Star {
            set source='./models/star.obj'
            set texture='./models/sun.jpg'
            set material_shininess=100.0
            set rotation=0.05deg
            set size=20.0
        }
    
    }
`