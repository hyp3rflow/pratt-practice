import { parser } from './parser.ts';
import { tokenizer } from "./tokenizer.ts";

Deno.test("parser [#1]", () => {
  const tokens = tokenizer("1 + 2 + 3");
  const {parse} = parser(tokens);
  console.log(parse());
})

Deno.test("parser [#2]", () => {
  const tokens = tokenizer("1 * 2 * 3");
  const {parse} = parser(tokens);
  console.log(parse());
})

Deno.test("parser [#3]", () => {
  const tokens = tokenizer("1 + 2 * 3");
  const {parse} = parser(tokens);
  console.log(parse());
})

Deno.test("parser [#4]", () => {
  const tokens = tokenizer("(1 + 2) * 3");
  const {parse} = parser(tokens);
  console.log(parse());
})
