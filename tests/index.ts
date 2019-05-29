import * as fs from 'fs'
import * as ts from 'typescript'
import Parser from "../src/parser";
import Emitter from '../src/emitter';
import * as Ecmaify from '../src/ecmaify';
import { arrayify } from '../src/utils';

function testParseAndEmit() {
  const buffer = fs.readFileSync("./tests/forin-001.binjs")
  const parser = new Parser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const program = parser.parse()
  const emitter = new Emitter()
  const result = emitter.emit(program)
  console.log(buffer.byteLength, result.byteLength)
  const newParser = new Parser(result)
  console.log(newParser.parse())
}

function testEcmaify() {
  const buffer = fs.readFileSync("./tests/forin-001.binjs")
  const parser = new Parser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const program = parser.parse()
  const nodes = arrayify(Ecmaify.Ecmaify(program)) as ts.SourceFile[]
  const printer = ts.createPrinter()
  console.log(printer.printFile(nodes[0]))
}

testParseAndEmit()
testEcmaify()