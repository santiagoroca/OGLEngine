/*
* Constant Values
*/
const SKIP = ' /* skip */ ';

module.exports = {

    "lex": {

        "rules": [

            /* KEYWORDS */
            ["\\s+", "/* skip whitespace */"],
            ["scene", "return 'SCENE';"],
            ["print", "return 'PRINT';"],
            ["geometry", "return 'GEOMETRY';"],
            ["vertexs", "return 'VERTEXS';"],
            ["indexes", "return 'INDEXES';"],
            ["transform", "return 'TRANSFORM';"],
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
            ["camera", "return 'CAMERA';"],
            ["projection", "return 'PROJECTION';"],

            /* Constant Values */
            ["@UP", "return 'UP_VECTOR';"],
            ["@RIGHT", "return 'RIGHT_VECTOR';"],
            ["@BACK", "return 'BACK_VECTOR';"],
            ["@DRAG", "return 'DRAG';"],
            ["@KEYPRESS", "return 'KEYPRESS';"],
            ["@KEYDOWN", "return 'KEYDOWN';"],
            ["@INTERVAL", "return 'INTERVAL';"],

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
            ["[a-zA-Z]*?=", "return 'VARNAME';"],
            ["\.[a-zA-Z0-9_/]*", "return 'SCOPE_VARIABLE';"],
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
            [ " scene EOF ", " return $1; " ],
            [ " EOF ", SKIP ],
        ],

        scene_definition:
        [
            [ " SCENE ",  SKIP ]
        ],

        scene: [
            [ " scene_definition body ",  ` 
                $$ = $2.toString();
            `]
        ],

        body:
        [
            [ " OBRACE CBRACE ", " $$ = new yy.Scene(); " ],
            [ " OBRACE statements CBRACE ", " $$ = $2; " ]
        ],

        statements: [
            [ " statements statement ", " $$[$2.k]($2.v); " ],
            [ " statement ", " $$ = new yy.Scene(); $$[$1.k]($1.v); " ]
        ],

        statement: [
            [ " CAMERA OBRACE CBRACE ", ` $$ = { k: 'appendCamera', v: null }; `],
            [ " GEOMETRY OBRACE CBRACE ", ` $$ = { k: 'appendGeometry', v: null }; `],
            [ " CAMERA OBRACE c_statements CBRACE ", `
                $$ = { k: 'appendCamera', v: $3 };
            `],
            [ " GEOMETRY OBRACE g_statements CBRACE ", `
                $$ = { k: 'appendGeometry', v: $3 };
            `]
        ],

        c_statements:
        [
            [ " c_statements c_statement ", " $$[$2[0]]($2[1]); " ],
            [ " c_statement ", " $$ = new yy.Camera(); $$[$1[0]]($1[1]); "]
        ],

        c_statement:
        [
            [ " transform ", `$$ = $1;`],
            [ " PROJECTION ARROW args", `$$ = [ 'setProjection', $3 ];`],
        ],

        g_statements:
        [
            [ " g_statements g_statement ", " $$[$2[0]]($2[1]); " ],
            [ " g_statement ", " $$ = new yy.Geometry(); $$[$1[0]]($1[1]); "]
        ],

        g_statement:
        [
            [ " VERTEXS array ", " $$ = ['setVertexs', $2] " ],
            [ " INDEXES array ", " $$ = ['setIndexes', $2]; " ],
            [ " SOURCE ARROW arg ", `$$ = ['loadFromFile', $3];`],
            [ " transform ", `$$ = $1;`],
            [ " STATIC transform ", " $$ = ['applyTransformation', $4] "],
            [ " ON ARROW args ", " $$ = [ 'addEvent', $3 ] "],
            [ " COLOR ARROW args ", " $$ = [ 'setColor', $3 ] "],
        ],

        transform:
        [
            [ " TRANSFORM OBRACE transformations CBRACE ", `
                $$ = ['applyTransformation', $3];
            `],
        ],

        transformation_event:
        [
            [ " ROTATE ARROW args ", " $$ = yy.TransformEvents.RotateEvent($3); "],
            [ " TRANSLATE ARROW args ", " $$ = yy.TransformEvents.TranslateEvent($3); "],
            [ " SCALE ARROW args ", " $$ = yy.TransformEvents.ScaleEvent($3); "]
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
            [ " VARNAME value ", " $$ = { [`${$1.replace(/=/g, '')}`]: $2 }; " ],
        ],

        value: 
        [
            [ " number ", " $$ = $1 " ],
            [ " string ", " $$ = $1 " ],
            [ " SCOPE_VARIABLE ", " $$ = $1; "],
            [ " vec3 ", " $$ = $1; "],
            [ " expression ", " $$ = $1; " ],
            [ " UP_VECTOR ", " $$ = [0, 1, 0]; " ],
            [ " RIGHT_VECTOR ", " $$ = [1, 0, 0]; " ],
            [ " BACK_VECTOR ", " $$ = [0, 0, 1]; " ],
            [ " DRAG ", " $$ = 'drag'; " ],
            [ " KEYPRESS ", " $$ = 'keypres'; " ],
            [ " KEYDOWN ", " $$ = 'keydown'; " ],
            [ " INTERVAL ", " $$ = 'interval'; " ],
            [ " OPAR transformation_event CPAR ", " $$ = $2; " ],
            [ " hexadecimal ", ` $$ = {
                    r: ($1 >> 16) & 255,
                    g: ($1 >> 8) & 255,
                    b: ($1 >> 0) & 255
                };
            `],
        ],

        expression:
        [
            [ " OPAR expression CPAR ", " $$ = $2; " ],
            [ " SCOPE_VARIABLE PRODUCT number ", " $$ = $1 + '*' + $3; " ],
            [ " number PRODUCT number ", " $$ = $1 * $3; " ]
        ],

    }

}