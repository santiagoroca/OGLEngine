/*
* Constant Values
*/
const SKIP = ' /* skip */ ';

module.exports = {

    "lex": {

        "rules": [

            /* Reserver Words */
            ["\\s+", "/* skip whitespace */"],  
            ["add", "return 'ADD';"],
            ["set", "return 'SET';"],
            ["define", "return 'DEFINE';"],
            ["pass", "return 'PASS';"],
            ["scene", "return 'SCENE';"],
            ["extends", "return 'EXTENDS';"],
            ["ogl\.[a-zA-Z0-9]+", "return 'CONSTANT';"],
            ["[a-zA-Z_]+=", "return 'VARNAME';"],
            ["[a-zA-Z]+ ?(?=->)", "return 'FUNC_NAME';"],
            ["[a-zA-Z]+ ?(?=(\{|extends))", "return 'CLASS_NAME';"],

            /* natives */
            ["0x[0-9A-Fa-f]{8}", "return 'HEXA8';"],
            ["0x[0-9A-Fa-f]{6}", "return 'HEXA6';"],
            ["\\-?[0-9]+(?:\\.[0-9]+)?", "return 'NUMBER';"],
            ["'[a-zA-Z0-9\\._/]+'", "return 'STRING';"],
            ["(true|false)", "return 'BOOL';"],
            ["vec3", "return 'VEC3';"],
            ["deg", "return 'DEG';"],
            ["rad", "return 'RAD';"],

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
            ["->", "return 'ARROW';"],
            ["[\\*\\+\\-\\^\\%\\/]", "return 'OPERATOR';"],
            ["\\.[a-zA-Z0-9_]*", "return 'SCOPE_VARIABLE';"],
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
            [ " SCENE OBRACE statements CBRACE ",  ` $$ = new yy.Scene({}, $3); `]
        ],

        statements: 
        [
            [ " statements statement ", " $$.push($2); " ],
            [ " statement ", " $$ = [$1]; " ],
            [ " PASS ", " $$ = []; " ],
        ],

        statement:
        [
            [ " ADD class ", " $$ = [ '2addClass', $2 ]; " ],
            [ " SET class ", " $$ = [ '3setClass', $2 ]; " ],
            [ " SET VARNAME value ", " $$ = [ '0setVariable', [ $2.replace(/=/, '').trim(), $3 ] ]; " ],
            [ " DEFINE class_name EXTENDS class_name OBRACE statements CBRACE ", `
                $$ = [ '1extendClass', [ $2, $4, $6 ] ];
            `],
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
            [ " CLASS_NAME ", " $$ = $1.trim(); " ],
        ],

        class:
        [
            [" class_name OBRACE statements CBRACE ", ` $$ = [ $1, $3 ]; `],
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
            [ " HEXA6 ", `
                $$ = parseInt($1.replace(/0x/, ''), 16); 
                $$ = {
                    r: ($$ >> 16) & 255,
                    g: ($$ >> 8) & 255,
                    b: ($$ >> 0) & 255, 
                    a: 255
                };
            `],
            [ " HEXA8 ", `
                $$ = parseInt($1.replace(/0x/, ''), 16); 
                $$ = {
                    r: ($$ >> 24) & 255,
                    g: ($$ >> 16) & 255,
                    b: ($$ >> 8) & 255,
                    a: ($$ >> 0) & 255,
                };
            `],
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
            [ " number ", " $$ = [ 'const', parseFloat($1) ]; " ],
            [ " SCOPE_VARIABLE ", " $$ = [ 'var', $1.replace(/\./, '') ]; "],
            [ " hexadecimal ", " $$ = [ 'const', $1 ]; "],
            [ " constant ", " $$ = [ 'const', $1 ]; "],
            [ " string ", " $$ = [ 'const', $1 ]; " ],
            [ " BOOL ", " $$ = [ 'const', $1 == 'true' ]; " ],
            [ " vec3 ", " $$ = [ 'const', $1 ]; "],
            [ " expression ", " $$ = [ 'expr', $1 ]; " ],
            [ " OPAR function CPAR ", " $$ = [ 'func', $2 ]; " ],
        ],

        expression:
        [
            [ " OPAR value OPERATOR value CPAR ", " $$ = [ $3, [ $2, $4 ] ]; " ],
        ],

        constant:
        [
            [ " CONSTANT ", " $$ = yy.Constants[$1.replace(/ogl\./g, '')]; " ]
        ]

    }

}