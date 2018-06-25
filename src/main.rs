#![allow(non_snake_case)]

mod Tokenizer;
mod Parser;
mod Compiler;

use Compiler::Compiler as OtherCompiler;
use Tokenizer::Tokenizer as OtherTokenizer;
use Parser::Parser as OtherParser;
use std::fs::File;
use std::io::prelude::*;

fn main () {

    // Open source file to parse
    let mut f = File::open("./test.file").expect("file not found");

    // Read file content to String
    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .expect("something went wrong reading the file");

    let chars:Vec<char> = contents.chars().collect();

    let mut compiler = OtherCompiler {
        parser: OtherParser {
            tokenizer: OtherTokenizer {
                _tokens: chars,
                _pointer: 0
            }
        }
    };

    let mut output = File::create("./build/out.js")
        .expect("Unable to create file");

    output.write_all(compiler.compile().as_bytes())
        .expect("Unable to write file");;

}
