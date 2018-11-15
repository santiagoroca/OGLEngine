/*
* Constant Values
*/
const SKIP = ' /* skip */ ';

module.exports = {

    "lex": {

        "rules": [

            /* Variables */
            ["[a-zA-Z]*?=", "return 'VARNAME';"],

            /* BUILT-IN FUNCTIONS */
            ["add", "return 'ADD';"],
            ["set", "return 'SET';"],
            ["define", "return 'DEFINE';"],
            ["pass", "return 'PASS';"],

            /* KEYWORDS */
            ["\\s+", "/* skip whitespace */"],
            ["scene", "return 'SCENE';"],
            ["camera", "return 'CAMERA';"],
            ["transform", "return 'TRANSFORM';"],
            ["light", "return 'LIGHT';"],
            ["world", "return 'WORLD';"],
            ["model", "return 'MODEL';"],

            ["print", "return 'PRINT';"],
            ["geometry", "return 'GEOMETRY';"],
            ["vertexs", "return 'VERTEXS';"],
            ["indexes", "return 'INDEXES';"],
            ["static", "return 'STATIC';"],
            ["dynamic", "return 'DYNAMIC';"],
            ["rotate", "return 'ROTATE';"],
            ["translate", "return 'TRANSLATE';"],
            ["scale", "return 'SCALE';"],
            ["vec3", "return 'VEC3';"],
            ["deg", "return 'DEG';"],
            ["rad", "return 'RAD';"],
            ["import", "return 'IMPORT';"],
            ["ogl", "return 'OGL';"],
            ["on", "return 'ON';"],
            ["drag", "return 'DRAG';"],
            ["source", "return 'SOURCE';"],
            ["color", "return 'COLOR';"],
            
            ["projection", "return 'PROJECTION';"],
            
            ["texture", "return 'TEXTURE';"],

            /* Constant Values */
            ["@", "return 'AT';"],

            /* natives */
            ["0x[0-9A-Fa-f]{6}", "return 'HEXA';"],
            ["\\-?[0-9]+(?:\\.[0-9]+)?", "return 'NUMBER';"],
            ["'[a-zA-Z0-9\\._/]+'", "return 'STRING';"],

            /* Tokens */
            ["\\{", "return 'OBRACE';"],
            ["\\}", "return 'CBRACE';"],
            ["\\(", "return 'OPAR';"],
            ["\\)", "return 'CPAR';"],
            ["\\[", "return 'OARR';"],
            ["\\]", "return 'CARR';"],
            ["#.*", "/* IGNORE */"],
            ["[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]", "/* IGNORE */"],
            [",", "return 'COLON';"],
            ["\\*", "return 'PRODUCT';"],
            ["->", "return 'ARROW';"],
            ["\\.[a-zA-Z0-9_/]*", "return 'SCOPE_VARIABLE';"],
            ["[a-zA-Z0-9_/]+", "return 'CONSTANT';"],
            ["'", "return 'QUOTE';"],
            [
                "[#|\\.]-?[_a-zA-Z]+[_a-zA-Z0-9-]*",
                "return 'SELECTOR';"
            ],

            /* Delimiters */
            ["$", "return 'EOF';"],

        ]

    },

    "bnf": {

        run:
        [
            [ " scene EOF ", " return ''; " ],
            [ " EOF ", SKIP ],
        ],

        scene: [
            [ " SCENE OBRACE statements CBRACE ",  ` $$ = new yy.Scene($3); `]
        ],

        statements: 
        [
            [ " statements statement ", " $$.push($2); " ],
            [ " statement ", " $$ = [$1]; " ],
            [ " PASS ", " $$ = []; " ],
        ],

        statement:
        [
            [ " ADD object ", " $$ = [ 'add' + $2[0], [ $2[1] ] ] " ],
            [ " SET object ", " $$ = [ 'set', [ $2[0], $2[1] ] ]; " ],
            [ " SET arg ", " $$ = [ 'set', [ $2[0], $2[1] ] ]; " ],
        ],

        object:
        [
            [ " CAMERA OBRACE statements CBRACE ", ` $$ = [ 'Camera', new yy.Camera($3) ]; `],
            [ " GEOMETRY OBRACE statements CBRACE ", ` $$ = [ 'Geometry', new yy.Geometry($3) ]; `],
            [ " TRANSFORM OBRACE statements CBRACE ", ` $$ = [ 'Transform', new yy.Transform($3) ]; `],
            [ " WORLD OBRACE statements CBRACE ", ` $$ = [ 'World', new yy.Matrix($3) ]; `],
            [ " MODEL OBRACE statements CBRACE ", ` $$ = [ 'Model', new yy.Matrix($3) ]; `],
            [ " LIGHT OBRACE statements CBRACE ", ` $$ = [ 'Light', new yy.Light($3) ]; `]
        ],

        function:
        [
            [ " LIGHT ARROW args ", ` $$ = { k: 'appendLight', v: $3 }; `],
            [ " PROJECTION ARROW args", `$$ = [ 'setProjection', $3 ];`],
            [ " ON ARROW args ", " $$ = [ 'addEvent', $3 ] "],
            [ " SOURCE ARROW arg ", `$$ = ['loadFromFile', $3];`],
            [ " COLOR ARROW args ", " $$ = [ 'setColor', $3 ] "],
            [ " TEXTURE ARROW args ", ` $$ = [ 'setTexture', $3 ]; `],
            [ " ROTATE ARROW args ", " $$ = yy.TransformEvents.RotateEvent($3); "],
            [ " TRANSLATE ARROW args ", " $$ = yy.TransformEvents.TranslateEvent($3); "],
            [ " SCALE ARROW args ", " $$ = yy.TransformEvents.ScaleEvent($3); "]
        ],

        body:
        [
            [ " OBRACE CBRACE ", " $$ = new yy.Scene(); " ],
            [ " OBRACE statements CBRACE ", " $$ = $2; " ]
        ],

        transform:
        [
            [ " TRANSFORM OBRACE transformations CBRACE ", `
                $$ = ['applyTransformation', $3];
            `],
        ],

        transformation_event:
        [
            
        ],

        transformations:
        [
            [ " transformations transformation ", " $$[$2[0]]($2[1]); " ],
            [ " transformation ", `
                
                $$ = new yy.Transform();
                $$[$1[0]]($1[1]);
            `],
        ],

        transformation:
        [
            [ " ROTATE ARROW args ", " $$ = ['rotate', $3]; "],
            [ " TRANSLATE ARROW args ", " $$ = ['translate', $3]; "],
            [ " SCALE ARROW args ", " $$ = ['scale', $3]; "]
        ],

        vec3:
        [
            [ " VEC3 OPAR NUMBER COLON NUMBER COLON NUMBER CPAR ", ` 
                $$ = [
                    parseFloat($3), 
                    parseFloat($5),
                    parseFloat($7)
                ]; 
            `],
            [ " VEC3 OPAR STRING COLON STRING COLON STRING CPAR ", " $$ = [$3, $5, $7]; " ]
        ],

        unit:
        [
            [ " DEG ", " $$ = parseFloat(0.0174533); " ],
            [ " RAD ", " $$ = parseFloat(1); " ]
        ],

        array:
        [
            [ " OARR numbers CARR ", " $$ = $2; " ],
            [ " OARR strings CARR ", " $$ = $2; " ]
        ],

        numbers:
        [
            [ " numbers COLON NUMBER ", " $$.push( parseFloat($3) ); " ],
            [ " number ", " $$ = [$1]; " ]
        ],

        hexadecimal: [
            [ " HEXA ", " $$ = parseInt($1.replace(/0x/, ''), 16); " ],
        ],

        number:
        [
            [ " number unit ", " $$ = $1 * $2; " ],
            [ " NUMBER ", " $$ = parseFloat($1); " ],
        ],

        strings:
        [
            [ " numbers COLON STRING ", " $$.push('$3'); " ],
            [ " string ", " $$ = [$1]; " ]
        ],

        string:
        [
            [ " STRING ", " $$ = $1.replace(/'/g, ''); " ]
        ],

        args: [
            [ " args COLON arg ", " Object.assign($$, $3); " ],
            [ " arg ", " $$ = {}; Object.assign($$, $1); " ],
        ],

        arg: [
            [ " VARNAME value ", " $$ = [ $1.replace(/=/g, ''), $2 ]; " ],
        ],

        value: 
        [
            [ " number ", " $$ = $1 " ],
            [ " string ", " $$ = $1 " ],
            [ " SCOPE_VARIABLE ", " $$ = $1; "],
            [ " vec3 ", " $$ = $1; "],
            [ " expression ", " $$ = $1; " ],
            [ " OPAR transformation_event CPAR ", " $$ = $2; " ],
            [ " hexadecimal ", ` $$ = {
                    r: ($1 >> 16) & 255,
                    g: ($1 >> 8) & 255,
                    b: ($1 >> 0) & 255
                };
            `],
            [ " constant ", " $$ = $1; "]
        ],

        expression:
        [
            [ " OPAR expression CPAR ", " $$ = $2; " ],
            [ " SCOPE_VARIABLE PRODUCT number ", " $$ = $1 + '*' + $3; " ],
            [ " number PRODUCT number ", " $$ = $1 * $3; " ]
        ],

        constant:
        [
            [ " AT CONSTANT ", " $$ = yy.Constants[$2]; " ]
        ]

    }

}