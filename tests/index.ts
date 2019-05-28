import * as fs from 'fs'
import * as path from 'path'
import Parser from "../src/parser";
import Emitter from '../src/emitter';

const buffer = fs.readFileSync("./tests/forin-001.binjs")
const parser = new Parser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
const program = parser.parse()
const emitter = new Emitter()
const result = emitter.emit(program)
console.log(buffer.byteLength, result.byteLength)
const newParser = new Parser(result)
console.log(newParser.parse())
