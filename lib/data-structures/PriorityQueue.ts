/**
 * Generic Priority Queue implementation
 * Used for emergency request prioritization and handling
 */
export class PriorityQueue<T> {
  private heap: Array<{ item: T; priority: number }> = [];
  private compare: (a: number, b: number) => number;

  constructor(compareFn?: (a: number, b: number) => number) {
    // Default is min heap (lower number = higher priority)
    this.compare = compareFn || ((a, b) => a - b);
  }

  /**
   * Add an item to the queue with the specified priority
   */
  enqueue(item: T, priority: number): void {
    this.heap.push({ item, priority });
    this.siftUp(this.heap.length - 1);
  }

  /**
   * Remove and return the highest priority item
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    
    const top = this.heap[0].item;
    const last = this.heap.pop()!;
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    
    return top;
  }

  /**
   * Look at the highest priority item without removing it
   */
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.heap[0].item;
  }

  /**
   * Change the priority of an item that matches the predicate
   */
  changePriority(predicate: (item: T) => boolean, newPriority: number): boolean {
    for (let i = 0; i < this.heap.length; i++) {
      if (predicate(this.heap[i].item)) {
        const oldPriority = this.heap[i].priority;
        this.heap[i].priority = newPriority;
        
        if (this.compare(newPriority, oldPriority) < 0) {
          this.siftUp(i);
        } else {
          this.siftDown(i);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the queue is empty
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Get the number of items in the queue
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Get all items in the queue without removing them
   */
  getAll(): T[] {
    return this.heap.map(item => item.item);
  }

  /**
   * Helper method to maintain heap property when adding an item
   */
  private siftUp(index: number): void {
    let current = index;
    let parent = Math.floor((current - 1) / 2);

    while (
      current > 0 &&
      this.compare(this.heap[current].priority, this.heap[parent].priority) < 0
    ) {
      [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
      current = parent;
      parent = Math.floor((current - 1) / 2);
    }
  }

  /**
   * Helper method to maintain heap property when removing the top item
   */
  private siftDown(index: number): void {
    let current = index;
    let leftChild = 2 * current + 1;
    let rightChild = 2 * current + 2;
    let smallest = current;

    const length = this.heap.length;

    if (
      leftChild < length &&
      this.compare(this.heap[leftChild].priority, this.heap[smallest].priority) < 0
    ) {
      smallest = leftChild;
    }

    if (
      rightChild < length &&
      this.compare(this.heap[rightChild].priority, this.heap[smallest].priority) < 0
    ) {
      smallest = rightChild;
    }

    if (smallest !== current) {
      [this.heap[current], this.heap[smallest]] = [this.heap[smallest], this.heap[current]];
      this.siftDown(smallest);
    }
  }
}