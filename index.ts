import MultipartReader from "./src/io/reader"
import * as fs from 'fs'

const buffer = fs.readFileSync('./1.binjs')
const reader = new MultipartReader(new Uint8Array(buffer).buffer)
reader.readHeader()