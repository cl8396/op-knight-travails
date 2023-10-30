export default class Queue {
  constructor() {
    this.elements = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(element) {
    this.elements[this.backIndex] = element;
    this.backIndex++;
    return `${element} inserted`;
  }

  dequeue() {
    let item = this.elements[this.frontIndex];
    delete this.elements[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  peek() {
    return this.elements[this.frontIndex];
  }

  get printQueue() {
    return this.items;
  }

  get isEmpty() {
    return this.frontIndex === this.backIndex ? true : false;
  }
}
