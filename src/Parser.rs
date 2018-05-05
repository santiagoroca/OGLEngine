use Tokenizer::Tokenizer as OtherTokenizer;
use Tokenizer::Token;


#[derive(Debug, PartialEq, Clone)]
pub struct Block {
    _type: String,
    _args: Vec<Token>,
    _childs: Vec<Block>
}

#[derive(Debug, PartialEq, Clone)]
pub struct Parser {
    pub tokenizer: OtherTokenizer
}

impl Parser {

    // Reads the entire string and returns a vector of tokens
    pub fn parse (&mut self) -> Vec<Block> {

        let mut blocks = Vec::<Block>::new();

        while !self.tokenizer.eof() {
            println!("{:?}", ":)");
            blocks.push(self.read_next());
        }

        blocks

    }

    fn read_next (&mut self) -> Block {

        let token = self.tokenizer.read_next();

        match token._type.as_ref() {

            "STRING" => return self.read_string(token._value),

            _        => return Block {
                            _type: String::new(),
                            _args: Vec::<Token>::new(),
                            _childs: Vec::<Block>::new()
                        }

        };

    }

    fn read_string (&mut self, _key: String) -> Block {

        match _key.as_ref() {

            "scene"  => return self.read_block(_key),

            _        => return Block {
                            _type: String::new(),
                            _args: Vec::<Token>::new(),
                            _childs: Vec::<Block>::new()
                        }

        };

    }

    fn read_block (&mut self, _type: String) -> Block {

        let mut block = Block {
            _type: _type,
            _args: Vec::<Token>::new(),
            _childs: Vec::<Block>::new()
        };

        // Add two arguments to Scene
        block._args.push(self.tokenizer.read_next());
        block._args.push(self.tokenizer.read_next());

        // Skip OBRACE
        self.tokenizer.read_next();

        let mut token = self.tokenizer.read_next();
        while token._type != "CBRACE" {
            block._childs.push(self.read_attribute(token._value));
            token = self.tokenizer.read_next();
        }

        block

    }

    fn read_attribute (&mut self, _type: String) -> Block {

        match _type.as_ref() {

            "cube" => return self.read_cube(),

            _      => return Block {
                            _type: String::new(),
                            _args: Vec::<Token>::new(),
                            _childs: Vec::<Block>::new()
                      }

        };

    }

    fn read_cube (&mut self) -> Block {

        let mut block = Block {
            _type: String::from("cube"),
            _args: Vec::<Token>::new(),
            _childs: Vec::<Block>::new()
        };

        // Add two arguments to Scene
        block._args.push(self.tokenizer.read_next());
        block._args.push(self.tokenizer.read_next());

        // Skip OBRACE
        self.tokenizer.read_next();

        block

    }


}
