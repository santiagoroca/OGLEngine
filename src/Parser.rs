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
            let mut token = self.tokenizer.read_next();
            let block = self.parse_next(token);

            if block._type != "EMPTY" {
                blocks.push(block);
            }
        }

        blocks

    }

    fn parse_next (&mut self, token: Token) -> Block {

        match token._value.as_ref() {

            "scene"  => return self.read_scene(),

            _        => return Block {
                            _type: String::from("EMPTY"),
                            _args: Vec::<Token>::new(),
                            _childs: Vec::<Block>::new()
                        }

        };

    }

    fn read_scene (&mut self) -> Block {

        println!("{:?}", "NEW SCENE");
        let mut block = Block {
            _type: String::from("SCENE"),
            _args: Vec::<Token>::new(),
            _childs: Vec::<Block>::new()
        };

        // Add two arguments to Scene
        block._args.push(self.tokenizer.read_next());
        block._args.push(self.tokenizer.read_next());

        // Skip OBRACE
        self.tokenizer.read_next();

        let mut token = self.tokenizer.read_next();
        println!("{:?}", token);
        while token._type != "CBRACE" {
            println!("{:?}", token);

            let __block = self.parse_next(token);

            if __block._type != "EMPTY" {
                block._childs.push(__block);
            }

            token = self.tokenizer.read_next();
        }

        block

    }

}
