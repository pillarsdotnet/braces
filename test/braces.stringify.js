'use strict';

require('mocha');
const assert = require('assert').strict;
const stringify = require('../lib/stringify');

describe('braces.stringify()', () => {
  it('should reject deeply nested ASTs', () => {
    let ast = { type: 'text', value: 'a' };
    for (let i = 0; i < 101; i++) ast = { type: 'brace', nodes: [ast] };
    ast = { type: 'root', nodes: [ast] };
    assert.throws(() => stringify(ast), /exceeds max depth/);
  });

  it('should not escape valid nested braces with options.escapeInvalid', () => {
    const parse = require('../lib/parse');
    const cases = {
      '{a,{b}}': '{a,{b}}',
      '{{a}}': '{{a}}',
      '{{x}y}': '{{x}y}',
      '{a,{b,{c}}': '{a,{b,{c}}',
      '{}{a}': '{}{a}'
    };
    for (const [input, expected] of Object.entries(cases)) {
      assert.equal(stringify(parse(input), { escapeInvalid: true }), expected);
    }
  });
});
