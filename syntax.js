/*
* Constant Values
*/
const SKIP = ' /* skip */ ';

module.exports = {

    "lex": {

        "rules": [


            ["\\s+", "/* skip whitespace */"],
            ["add", "return 'ADD';"],
            ["set", "return 'SET';"],
            ["define", "return 'DEFINE';"],
            ["pass", "return 'PASS';"],
            ["scene", "return 'SCENE';"],
            ["extends", "return 'EXTENDS';"],
            ["ogl\.[a-zA-Z0-9]+", "return 'CONSTANT';"],
            ["[a-zA-Z]+=", "return 'VARNAME';"],
            ["[a-zA-Z]+ ?(?=->)", "return 'FUNC_NAME';"],
            ["[a-zA-Z]+ ?(?=(\{|extends))", "return 'CLASS_NAME';"],
            

            /* BUILT-IN FUNCTIONS */
            

            /* KEYWORDS */
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
            [ " ADD class ", " $$ = [ 'add', [ $2[0], $2[1] ] ]; " ],
            [ " SET class ", " $$ = [ 'set', [ $2[0], $2[1] ] ]; " ],
            [ " SET VARNAME value ", " $$ = [ 'set', [ $2.replace(/=/g, '').trim(), $3 ] ]; " ],
            [ " DEFINE class_name EXTENDS class_name OBRACE statements CBRACE ", `
                yy[$2] = class extends yy[$4] {
                    constructor (statements = []) {
                        super([ ...$6, ...statements ]);
                    }
                }

                $$ = null;
            ` ],
            [ " function ", " $$ = $1; " ],
        ],

        function:
        [
            [ " FUNC_NAME ARROW args ", `
                $$ = [ $1.trim(), $3 ];
            `],
        ],

        class_name:
        [
            [ " CLASS_NAME ", " $$ = ($1.charAt(0).toUpperCase() + $1.slice(1)).trim(); " ],
        ],

        class:
        [
            [" class_name OBRACE statements CBRACE ", `
                try {
                    $$ = [
                        yy[$1].name.toLowerCase(), new yy[$1]($3) 
                    ];
                } catch (error) {
                    console.log(error);
                    throw(new Error('Class ' + $1 + ' not found.'))
                }
            `],
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
            [ " OPAR function CPAR ", " $$ = $2; " ],
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
            [ " CONSTANT ", " $$ = yy.Constants[$1.replace(/ogl\./g, '')]; " ]
        ]

    }

}