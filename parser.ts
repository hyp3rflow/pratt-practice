import { Token } from './tokenizer.ts';

const enum Precedence {
  Add = 1,
  Mul = 2,
}

interface Parser {
  consume(): Token | undefined;
  parse(precedence?: Precedence): Expression;
  lookAhead(index?: number): Token | undefined;
}
export const parser = (tokens: Token[]): Parser => {
  const prefixParselets: Record<string, PrefixParselet> = {
    number: {
      parse(parser: Parser, token: Token): PrefixExpression {
        return { type: 'prefix', value: token.value };
      },
    },
    operator: {
      parse(parser: Parser, token: Token): PrefixExpression {
        const operand = parser.parse();
        return { type: 'prefix', value: token.value, operand };
      },
    },
    paren: {
      parse(parser: Parser, token: Token): PrefixExpression {
        const expression = parser.parse() as PrefixExpression;
        if (parser.lookAhead()?.value !== ')') {
          throw new Error('Expected )');
        }
        parser.consume();
        return expression;
      },
    },
  };

  const infixParselets: Record<string, InfixParselet> = {
    opAdd: {
      getPrecedence() {
        return Precedence.Add;
      },
      parse(parser: Parser, left: Expression, token: Token) {
        return {
          type: 'infix',
          value: token.value,
          left,
          right: parser.parse(Precedence.Add),
        };
      },
    },
    opMul: {
      getPrecedence() {
        return Precedence.Mul;
      },
      parse(parser: Parser, left: Expression, token: Token) {
        return {
          type: 'infix',
          value: token.value,
          left,
          right: parser.parse(Precedence.Mul),
        };
      },
    },
  };

  function consume() {
    return tokens.shift();
  }
  function lookAhead(index = 0) {
    return tokens[index];
  }

  function getPrecedence() {
    const parselet = infixParselets[lookAhead()?.type];
    if (parselet != null) return parselet.getPrecedence();
    return 0;
  }

  function parse(precedence: Precedence = 0): Expression {
    const token = consume();
    if (!token) throw new Error('exception');
    const prefixParselet = prefixParselets[token.type];
    if (!prefixParselet) throw new Error('exception 2');
    let left: Expression = prefixParselet.parse(
      { parse, consume, lookAhead },
      token
    );
    while (precedence < getPrecedence()) {
      const token = consume();
      if (!token) throw new Error('exception 3');
      const infix = infixParselets[token.type];
      if (!infix) throw new Error('exception 4');
      left = infix.parse({ parse, consume, lookAhead }, left, token);
    }
    return left;
  }

  return {
    consume,
    parse,
    lookAhead,
  };
};

type Expression = PrefixExpression | InfixExpression;

interface PrefixExpression {
  type: 'prefix';
  value: string;
  operand?: Expression;
}

interface PrefixParselet {
  parse(parser: Parser, token: Token): PrefixExpression;
}

interface InfixExpression {
  type: 'infix';
  value: string;
  left: Expression;
  right: Expression;
}

interface InfixParselet {
  parse(parser: Parser, left: Expression, token: Token): InfixExpression;
  getPrecedence(): Precedence;
}
