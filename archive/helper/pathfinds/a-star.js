/**
 * @ignore
 */
export class AStar {
    constructor() {
        this.openList = [];
        this.closeList = [];

        this.NODE_DISTANCE_VALUE = 100;
    }

    findPath(nodes, startNode, endNode) {
        const path = [];
        let currentNode = null;
        let neighbours = [];
        let g = 0;
        let h = 0;
        let f = 0;

        this.addToOpenList(startNode);
        while (this.openList.length > 0) {
            currentNode = this.getCurrentNode();
            if (currentNode.posX === endNode.posX && currentNode.posY === endNode.posY) {
                break;
            }

            this.addToCloseList(currentNode);
            this.getNeighbours(currentNode, nodes).forEach(node => {
                if (this.isOnCloseList(node) || !node.walkable) {
                    return;
                }

                g = (!!node.parent ? node.parent.g : node.g) + this.NODE_DISTANCE_VALUE;
                h = (Math.abs(endNode.posX - node.posX) + Math.abs(endNode.posY - node.posY)) * this.NODE_DISTANCE_VALUE;
                f = h + g;

                if (this.isOnOpenList(node)) {
                    if (g < node.g) {
                        node.parent = currentNode;
                        node.g = g;
                        node.h = h;
                        node.f = f;
                    }
                } else {
                    this.addToOpenList(node);
                    node.parent = currentNode;
                    node.g = g;
                    node.h = h;
                    node.f = f;
                }
            });
        }

        if (this.openList.length === 0) {
            return path;
        }

        var lastNode = this.getNode(endNode.posX, endNode.posY, nodes);
        while (lastNode.posX !== startNode.posX || lastNode.posY !== startNode.posY) {
            path.push(lastNode);
            lastNode = lastNode.parent;
        }
        path.push(this.getNode(startNode.posX, startNode.posY, nodes));

        return path.reverse();
    }

    removeFromCloseList(node) {
        const index = this.closeList.findIndex(n => n.posX === node.posX && n.posY === node.posY);

        if (index > -1) {
            this.closeList.splice(index, 1);
        }
    }

    removeFromOpenList(node) {
        const index = this.openList.findIndex(n => n.posX === node.posX && n.posY === node.posY);

        if (index > -1) {
            this.openList.splice(index, 1);
        }
    }

    addToCloseList(node) {
        const hasNode = this.closeList.find(n => n.posX === node.posX && n.posY === node.posY);

        if (!hasNode) {
            this.removeFromOpenList(node);
            this.closeList.push(node);
        }
    }

    addToOpenList(node) {
        const hasNode = this.openList.find(n => n.posX === node.posX && n.posY === node.posY);

        if (!hasNode) {
            this.removeFromCloseList(node);
            this.openList.push(node);
        }
    }

    getCurrentNode() {
        let minF = 1000000;
        let currentNode = null;
        this.openList.forEach(node => {
            if (node.f < minF) {
                minF = node.f;
                currentNode = node;
            }
        });

        return currentNode;
    }

    getNeighbours(node, nodes) {
        const neighbours = [];

        if (this.getNode(node.posX, node.posY - 1, nodes)) {
            neighbours.push(this.getNode(node.posX, node.posY - 1, nodes));
        }

        if (this.getNode(node.posX, node.posY + 1, nodes)) {
            neighbours.push(this.getNode(node.posX, node.posY + 1, nodes));
        }

        if (this.getNode(node.posX - 1, node.posY, nodes)) {
            neighbours.push(this.getNode(node.posX - 1, node.posY, nodes));
        }

        if (this.getNode(node.posX + 1, node.posY, nodes)) {
            neighbours.push(this.getNode(node.posX + 1, node.posY, nodes));
        }

        return neighbours;
    }

    getNode(posX, posY, nodes) {
        return nodes.find(node => node.posX === posX && node.posY === posY);
    }

    isOnCloseList(node) {
        return this.closeList.some(n => n.posX === node.posX && n.posY === node.posY);
    }

    isOnOpenList(node) {
        return this.openList.some(n => n.posX === node.posX && n.posY === node.posY);
    }
}
