/*
MIT License

Copyright (c) 2021 Jacek Kaleta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

exports.tab2json = function(text, param) {
    if (param == undefined) param = {}
    if (param.cr == undefined) param.cr = '\r\n';
    if (param.onError == undefined)
        param.onError = function(error, line) {
            throw { error, line }
        }
    let jsonObj = [];
    let lines = text.split(param.cr);
    let i = 0;
    processlines(0, jsonObj)
    return jsonObj;

    function processlines(d, node) {
        while (i < lines.length) {
            let line = lines[i];
            if (line.trim().length == 0) throw param.onError(0, i);
            let l = (line.match(/^\t*/))[0].length;

            if (l == d) {
                node.push({ name: line.trim() /*, children: []*/ });
                i++
            } else
            if (l == d + 1) {
                if (node.length == 0) throw param.onError(1, i);

                if (node[node.length - 1].children == undefined)
                    node[node.length - 1].children = [];
                node[node.length - 1].children.push({ 'name': line.trim() /*, children: [] */ });
                i++
                processlines(l, node[node.length - 1].children)
            } else
            if (l > d + 1) throw param.onError(2, i);
            if (l < d) return;
        }
    };
}