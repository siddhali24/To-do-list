export class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(task) {
        this.items.push(task);
        this.items.sort((a, b) => b.priority - a.priority);
    }

    dequeue() {
        return this.items.shift();
    }

    remove(id) {
        this.items = this.items.filter((task) => task.id !== id);
    }

    getAll() {
        return this.items;
    }
}