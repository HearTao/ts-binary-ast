import * as fs from 'fs'
import * as path from 'path'
import Parser from "./src/io/parser";

const buffer = fs.readFileSync("./1.binjs")
const parser = new Parser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
parser.parse()
