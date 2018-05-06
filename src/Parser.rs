use Tokenizer::Tokenizer as OtherTokenizer;
use Tokenizer::Token;

#[derive(Debug, PartialEq, Clone)]
pub struct Block {
    pub _type: String,
    pub _args: Vec<Token>,
    pub _childs: Vec<Block>
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
            let token = self.tokenizer.read_next();
            let block = self.parse_next(token);

            if block._type != "EMPTY" {
                blocks.push(block);
            }
        }

        blocks

    }

    fn parse_next (&mut self, token: Token) -> Block {

        match token._type.as_ref() {

            "STRING"  => return self.read_key_value(token),

            _         => return Block {
                            _type: String::from("EMPTY"),
                            _args: Vec::<Token>::new(),
                            _childs: Vec::<Block>::new()
                        }

        };

    }

    fn read_key_value (&mut self, token: Token) -> Block {

        let mut block = Block {
            _type: token._value,
            _args: Vec::<Token>::new(),
            _childs: Vec::<Block>::new()
        };

        let token = self.tokenizer.read_next();

        // Optional two arguments
        if token._type != "OBRACE" {

            // Add two arguments to Scene
            block._args.push(token);
            block._args.push(self.tokenizer.read_next());

            // Skip OBRACE
            self.tokenizer.read_next();

        }

        let mut token = self.tokenizer.read_next();
        while token._type != "CBRACE" {
            let __block = self.parse_next(token);

            if __block._type != "EMPTY" {
                block._childs.push(__block);
            }

            token = self.tokenizer.read_next();
        }

        block

    }

}
