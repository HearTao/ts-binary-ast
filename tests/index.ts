import * as fs from 'fs'
import * as ts from 'typescript'
import Parser from "../src/parser";
import Emitter from '../src/emitter';
import * as Ecmaify from '../src/ecmaify';
import * as Unecmaify from '../src/unecmaify';
import { arrayify, first } from '../src/utils';
import { Program } from '../src/types';

function step(buffer: ArrayBuffer) {
  const parser = new Parser(buffer)
  const program = parser.parse()
  const parserEmitter = new Emitter()
  const parseResult = parserEmitter.emit(program)
  const sourceFile = first(arrayify(Ecmaify.Ecmaify(program))) as ts.SourceFile
  const script = first(arrayify(Unecmaify.Unecmaify(sourceFile))) as Program
  const emitter = new Emitter()
  const result = emitter.emit(script)
  console.log(buffer.byteLength, parseResult.byteLength, result.byteLength)
  return result
}

function test() {
  const buffer = fs.readFileSync("./tests/forin-001.binjs")
  let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  for (let i = 0; i < 3; ++i) {
    console.log(`${''.padStart(10, '-')} step ${i} ${''.padEnd(10, '-')}`)
    arrayBuffer = step(arrayBuffer)
  }
}

test()
