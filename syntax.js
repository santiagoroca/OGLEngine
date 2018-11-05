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

            /* natives */
            ["\\-?[0-9]+(?:\\.[0-9]+)?", "return 'NUMBER';"],
            ["[a-zA-Z0-9\\._/]+\\b", "return 'STRING';"],

            /* Scoped Variables */
            ["\\.[a-zA-Z0-9\\._/]+", "return 'SCOPE_VARIABLE';"],

            /* Tokens */
            ["\\{", "return 'OBRACE';"],
            ["\\}", "return 'CBRACE';"],
            ["\\(", "return 'OPAR';"],
            ["\\)", "return 'CPAR';"],
            ["\\[", "return 'OARR';"],
            ["\\]", "return 'CARR';"],
            ["/\\*]", "return 'C_START';"],
            ["\\*/]", "return 'C_END';"],
            [",", "return 'COLON';"],
            ["\\*", "return 'PRODUCT';"],
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

        string:
        [
            [ " QUOTE STRING QUOTE " , " $$ = $2 "]
        ],

        statement: [
            [ " PRINT OPAR string CPAR ", " console.log($3); " ],
            [ " GEOMETRY OBRACE CBRACE ", ` $$ = { k: 'appendGeometry', v: null }; `],
            [ " GEOMETRY OBRACE g_statements CBRACE ", `
                $$ = { k: 'appendGeometry', v: $3 };
            `],
            [ " ON event ", `
                $$ = { k: 'addEvents', v: $2 }
            `]
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
            [ " SOURCE string ", `$$ = ['loadFromFile', $2];`],
            [ " transform ", `$$ = $1;`],
            [ " STATIC transform ", `
                $$ = ['applyTransformation', $4]
            `],
            [ " ON event ", `
                $$ = [ 'addEvents', $2['events'] ]
            `]
        ],

        transform:
        [
            [ " TRANSFORM OBRACE transformations CBRACE ", `
                $$ = ['applyTransformation', $3];
            `],
        ],

        event:
        [
            [ " DRAG OBRACE transformations_events CBRACE ", `
                $$ = $3;
            `]
        ],

        transformations_events:
        [
            [ " transformations_events transformation_event ", " $$[$2[0]].apply($$, $2[1]); " ],
            [ " transformation_event ", `
                $$ = new yy.DragEvents();
                $$[$1[0]].apply($$, $1[1]);
            `],
        ],

        transformation_event:
        [
            [ " ROTATE vec3 numeric_expression ", `
                $$ = ['addRotateEvent', [$2[0], $2[1], $2[2], $3]];
            `],
            [ " ROTATE vec3 SCOPED_VARIABLE ", `
                $$ = ['addRotateEvent', [$2[0], $2[1], $2[2], $3]];
            `],
            [ " TRANSLATE vec3 ", " $$ = ['addTranslateEvent', [$2[0], $2[1], $2[2]]]; "],
            [ " SCALE vec3 ", " $$ = ['ScaleEvent', [$2[0], $2[1], $2[2]]]; "]
        ],

        transformations:
        [
            [ " transformations transformation ", " $$[$2[0]].apply($$, $2[1]); " ],
            [ " transformation ", `
                $$ = new yy.Transform();
                $$[$1[0]].apply($$, $1[1]);
            `],
        ],

        transformation:
        [
            [ " ROTATE vec3 number ", " $$ = ['rotate', [$2, $3, $4]]; "],
            [ " TRANSLATE vec3 ", " $$ = ['translate', [$2[0], $2[1], $2[2]]]; "],
            [ " SCALE vec3 ", " $$ = ['scale', [$2[0], $2[1], $2[2]]]; "]
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

        number:
        [
            [ " number unit ", " $$ = $1 * $2; " ],
            [ " NUMBER ", " $$ = parseFloat($1); " ]
        ],

        strings:
        [
            [ " numbers COLON STRING ", " $$.push('$3'); " ],
            [ " STRING ", " $$ = ['$1']; " ]
        ],

        numeric_expression:
        [
            [ " number PRODUCT number ", " $$ = $1 * $3; " ],
            [ " number ", " $$ = $1; " ],
        ]

    }

}
