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
    if (param.value == undefined) param.value = 'text';
    if (param.subnodes == undefined) param.subnodes = 'objarray';
    if (param.onError == undefined)
        param.onError = function(lineNumber) {
            return { lineNumber }
        }

    let lines = text.split(param.cr);
    let i = -1;
    return processlines(0);

    function tabcount(i) {
        if (i >= lines.length) return 0;
        let line = lines[i];
        if (line.trim().length == 0) return 0;
        return (line.match(/^\t*/))[0].length;
    }

    function getline(i) {
        if (i >= lines.length) return "";
        return lines[i].trim();
    }

    function processlines(d) {
        let obj = [];
        i++;
        while (i < lines.length && tabcount(i) == d) {
            obj.push({
                [param.value]: getline(i)
            });
            let l = tabcount(i + 1);
            if (l > d + 1) throw param.onError(i + 2);

            if (l == d + 1)
                obj[obj.length - 1][param.subnodes] = processlines(d + 1);
            else
                i++;
        }
        return obj;
    };
}
