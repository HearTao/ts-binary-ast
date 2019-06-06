/// <reference path="../src/shims/json-diff.d.ts"/>

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import Parser from "../src/parser";
import Emitter from '../src/emitter';
import Ecmaify from '../src/ecmaify';
import Unecmaify from '../src/unecmaify';
import { arrayify, first } from '../src/utils';
import { Program } from '../src/types';
import * as glob from 'glob'
import { diffString } from 'json-diff';

const TESTS_PATH = "./tests/spidermonkey/**/*.binjs"

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
  console.log(diffString(program, script))
  return result
}

function test(path: string) {
  const buffer = fs.readFileSync(path)
  let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  console.log(`${''.padStart(10, '=')} step ${path} ${''.padEnd(10, '=')}`)
  step(arrayBuffer)
}

function runner () {
  glob.sync(TESTS_PATH).forEach(test)
}

runner()
