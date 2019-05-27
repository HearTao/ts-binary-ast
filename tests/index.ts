import * as fs from 'fs'
import * as path from 'path'
import Parser from "../src/io/parser";
import Emitter from '../src/io/emitter';

const buffer = fs.readFileSync("./tests/forin-001.binjs")
const parser = new Parser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
const program = parser.parse()
const emitter = new Emitter()
emitter.emit(program)
