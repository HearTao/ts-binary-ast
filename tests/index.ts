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
  const nodes = arrayify(Ecmaify.Ecmaify(program)) as ts.SourceFile[]
  const sourceFile = first(nodes)
  const scripts = arrayify(Unecmaify.Unecmaify(sourceFile)) as Program[]
  const emitter = new Emitter()
  const result = emitter.emit(first(scripts))
  console.log(buffer.byteLength, result.byteLength)
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
