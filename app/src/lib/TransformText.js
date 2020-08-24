var transformHeadings = (headings) => {
    var root = {
        name: 'root',
        depth: 0,
        children: []
    };
    var node = root;
    var stack = [];
    var tmp;

    headings.forEach(h => {

        while (h.depth < node.depth + 1) {
            node = stack.pop();
        }

        while (h.depth > node.depth + 1) {
            if (!node.children || node.children.length === 0) {
                tmp = {
                    name: '',
                    depth: node.depth + 1
                };
                node.children = node.children || [];
                node.children.push(tmp);
            }
            stack.push(node);
            node = node.children[node.children.length - 1];
        }

        node.children = node.children || [];
        node.children.push(h);
    });

    root = autoCollapse(root, 0);
    if (root.children.length === 1) {
        // there is only one child - it is the title, make it root
        root = root.children[0];
    }

    return root;
};

var autoCollapse = (node, offset) => {
    node.depth -= offset;
    if (node.children && node.children.length === 1 && node.children[0].autoCollapse) {
        node.children = node.children[0].children;
        offset += 1;
    }
    if (node.children) {
        node.children = node.children.map(function(child) {
            if (child.autoCollapse && child.children && child.children.length === 1) {
                return autoCollapse(child.children[0], offset + 1);
            }
            return autoCollapse(child, offset)
        });
    }
    if (node.autoCollapse) {
        delete node.autoCollapse;
    }
    return node;
}

export default transformHeadings;