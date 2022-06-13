export type Token = NumToken | OpToken | ParenToken;

interface NumToken {
  type: 'number';
  value: string;
}

interface OpToken {
  type: 'opAdd' | 'opMul';
  value: string;
}

interface ParenToken {
  type: 'paren';
  value: string;
}

export const tokenizer = (program: string): Token[] => {
  const tokens: Token[] = [];
  for (const char of program) {
    switch (char) {
      case '1':
      case '2':
      case '3': {
        tokens.push({ type: 'number', value: char });
        continue;
      }
      case '+':{
        tokens.push({ type: 'opAdd', value: char });
        continue;
      }
      case '*': {
        tokens.push({ type: 'opMul', value: char });
        continue;
      }
      case '(':
      case ')': {
        tokens.push({ type: 'paren', value: char });
        continue;
      }
    }
  }
  return tokens;
};
