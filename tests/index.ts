/// <reference path="../src/shims/json-diff.d.ts"/>

import * as fs from 'fs'
import * as ts from 'typescript'
import Parser from "../src/parser";
import Emitter from '../src/emitter';
import Ecmaify from '../src/ecmaify';
import Unecmaify from '../src/unecmaify';
import { arrayify, first } from '../src/utils';
import { Program } from '../src/types';
import { diffString } from 'json-diff'

function step(buffer: ArrayBuffer) {
  const parser = new Parser(buffer)
  const program = parser.parse()
  const parserEmitter = new Emitter()
  const parseResult = parserEmitter.emit(program)
  const ecmaify = new Ecmaify()
  const sourceFile = first(arrayify(ecmaify.Ecmaify(program))) as ts.SourceFile
  const unecmaify = new Unecmaify()
  const script = first(arrayify(unecmaify.Unecmaify(sourceFile))) as Program
  const emitter = new Emitter()
  const result = emitter.emit(script)
  fs.writeFileSync("./tests/out/1.json", JSON.stringify(program, undefined, 2))
  fs.writeFileSync("./tests/out/2.json", JSON.stringify(program, undefined, 2))
  console.log(diffString(program, script))
  return result
}

function test() {
  const buffer = fs.readFileSync("./tests/spidermonkey/emca_2/String/split-002.binjs")
  let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  for (let i = 0; i < 1; ++i) {
    console.log(`${''.padStart(10, '-')} step ${i} ${''.padEnd(10, '-')}`)
    arrayBuffer = step(arrayBuffer)
  }
}

test()
