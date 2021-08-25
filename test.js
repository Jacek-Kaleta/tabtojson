"use strict";
const tj = require("./tab2json");
const fs = require('fs');


let text = fs.readFileSync('./test.txt').toString();
let json = tj.tab2json(text)
console.log(JSON.stringify(json, undefined, "  "));