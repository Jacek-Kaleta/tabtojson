Array.prototype.last = function() {
    if (this.length == 0) return undefined;
    return this[this.length - 1];
};

exports.tab2json = function(text) {
    let tree = [];
    let stack = [tree];
    let lastDepth = 0;

    let lines = text.split('\r\n');
    for (let i = 0; i < lines.length; i++)
        processline(lines[i], i);

    return tree;

    function currentNode() {
        return stack.last();
    }

    function validateDepth(depth, lastDepth, i) {
        if (depth - lastDepth > 1) throw new Error("Invalid format in line '+i+', can't jump more than one tab in");
    }

    function processline(line, i) {


        var name = line.trim();

        if (name.length == 0) return;
        var depth = (line.match(/^\t*/))[0].length;

        var deeper = depth > lastDepth;
        var shallower = depth < lastDepth;

        if (deeper) {
            validateDepth(depth, lastDepth, i); // check the format is valid

            // convert the last line to a "parent" node
            var parent = currentNode().last();
            parent.children = [];

            // Make that line's children the "current node"
            stack.push(parent.children);
        } else if (shallower) {
            var pops = lastDepth - depth;
            while (pops--) stack.pop();
        }

        lastDepth = depth;
        currentNode().push({ name: name });
    };
}


exports.tab2json2 = function(text, cr = '\r\n') {
    let jsonObj = [];
    let lines = text.split(cr);
    let i = 0;
    processlines(0, jsonObj)
    return jsonObj;


    function processlines(d, node) {
        while (i < lines.length) {
            let line = lines[i];
            if (line.trim().length == 0) throw { error: 0, line: i };
            let l = (line.match(/^\t*/))[0].length;

            if (l == d) {
                node.push({ name: line.trim() /*, children: []*/ });
                i++
            } else
            if (l == d + 1) {
                if (node.length == 0) throw { error: 1, line: i }

                if (node[node.length - 1].children == undefined)
                    node[node.length - 1].children = [];
                node[node.length - 1].children.push({ 'name': line.trim() /*, children: [] */ });
                i++
                processlines(l, node[node.length - 1].children)
            } else
            if (l > d + 1) throw { error: 2, line: i }
            if (l < d) return;
        }
    };
}