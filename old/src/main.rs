#![allow(non_snake_case)]

mod Tokenizer;
mod Parser;
mod Compiler;
mod GeometryWriter;
mod Geometry;
mod Shader;
mod Transformable;
mod Scene;
mod Event;

use Compiler::Compiler as OtherCompiler;
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

    let mut compiler = OtherCompiler::new(chars);

    let mut output = File::create("./build/out.js")
        .expect("Unable to create file");

    output.write_all(compiler.compile().as_bytes())
        .expect("Unable to write file");;

}
