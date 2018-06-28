#[derive(Debug, PartialEq, Clone)]
pub struct Token {
    pub _type: String,
    pub _value: String
}

#[derive(Debug, PartialEq, Clone)]
pub struct Tokenizer {
    pub _tokens: Vec<char>,
    pub _pointer: usize
}

impl Tokenizer {

    pub fn new (chars: Vec<char>) -> Tokenizer {
        Tokenizer {
            _tokens: chars,
            _pointer: 0
        }
    }

    // Numbers and letters a-z 0-9
    fn is_digit (&self, _char: char) -> bool {
        _char.is_alphanumeric() || _char == '-' || _char == '.'
    }

    // Numbers and letters a-z 0-9
    fn is_obrace (&self, _char: char) -> bool {
        _char == '{'
    }

    // Numbers and letters a-z 0-9
    fn is_cbrace (&self, _char: char) -> bool {
        _char == '}'
    }

    // Numbers and letters a-z 0-9
    fn is_semicolon (&self, _char: char) -> bool {
        _char == ';'
    }

    // Reads from the chars stream, in the current _pointer
    // Position, forward, until it finds a non-white space char
    fn read_while_is_white_space (&mut self) {
        while self._tokens[self._pointer].is_whitespace() {
            self._pointer += 1;
        }
    }

    pub fn read_next (&mut self) -> Token {

        // Reads the file until it finds a non-white space char
        self.read_while_is_white_space();

        // If its the end of file
        if self.eof() {
            return Token {
                _type: String::from("EOF"),
                _value: String::new()
            }
        }

        // Peek next character and decide what to read
        let _char = self.peek();

        // If its a digit, keep reading the rest of the string
        if self.is_digit(_char) {
            return self.read_string()
        }

        // If its a digit, keep reading the rest of the string
        if self.is_obrace(_char) {
            self._pointer += 1;
            return Token {
                _type: String::from("OBRACE"),
                _value: String::new()
            }
        }

        // If its a digit, keep reading the rest of the string
        if self.is_cbrace(_char) {
            self._pointer += 1;
            return Token {
                _type: String::from("CBRACE"),
                _value: String::new()
            }
        }

        // If its a digit, keep reading the rest of the string
        if self.is_semicolon(_char) {
            self._pointer += 1;
            return Token {
                _type: String::from("SEMICOLON"),
                _value: String::new()
            }
        }

        return Token {
            _type: String::from("EOF"),
            _value: String::new()
        }

    }

    fn peek (&self) -> char {
        self._tokens[self._pointer]
    }

    // Returns true if the current position is the end of the file
    // False otherwise
    pub fn eof (&self) -> bool {
        self._pointer == self._tokens.len() - 1
    }

    // Reads from the current position-on, and returns a new token Struct with the string
    fn read_string (&mut self) -> Token {

        let mut token = Token {
            _type: String::from("STRING"),
            _value: String::new()
        };

        while self.is_digit(self._tokens[self._pointer]) {
            token._value.push(self._tokens[self._pointer]);
            self._pointer += 1;
        }

        token

    }


}
