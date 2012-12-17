var Graph = ClassFactory.createClass("Graph", null, {
    context: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    image: null,
    children: [],
    draw: function () {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].deleted) {
                this.remove(this.children[i]);
                break;
            }
            else {
                this.children[i].draw();
            }
        }
    },
    add: function (graph) {
        if (graph.draw && graph.draw.constructor == Function) {
            graph.context = this.context;
            this.children.push(graph);
        }
    },
    remove: function (graph) {
        var i = 0;
        for (; i < this.children.length; i++) {
            if (this.children[i] == graph) {
                break;
            }
        }
        this.children.splice(i, 1);
    },
    getChild: function (index) {
        if (index < 0 || index > this.children.length) {
            alert("Out of Range");
        }
        return this.children[index];
    },
    clear: function () {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    },
    deleted: false
});