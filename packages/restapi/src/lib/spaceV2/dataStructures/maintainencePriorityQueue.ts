/**
 * @file PriorityQueue<T>
 *
 * This TypeScript class implements a Priority Queue data structure, which allows
 * elements to be enqueued and dequeued based on their assigned priority. The higher
 * the priority value, the earlier an item will be dequeued. This implementation
 * maintains a min-heap structure to efficiently manage the priority order.
 *
 * Public Methods:
 * - `enqueue(item: T)`: Adds an item to the priority queue with an automatically
 *   assigned priority.
 * - `dequeue(): T | undefined`: Removes and returns the item with the highest
 *   priority from the queue.
 * - `peek(count = 1): T[]`: Returns an array of the top `count` items in the queue
 *   without removing them.
 * - `isEmpty(): boolean`: Checks if the priority queue is empty.
 * - `size(): number`: Returns the number of items in the queue.
 * - `serialize(): string`: Serializes the current state of the priority queue to
 *   a JSON string.
 * - `deserialize(serializedData: string): void`: Deserializes and updates the
 *   priority queue's state from a JSON string.
 *
 * Author: Nilesh Gupta
 * Date: 6 September 2023
 */

export class PriorityQueue<T> {
    private items: { item: T; priority: number }[] = [];
    private nextPriority = 1;

    private bubbleUp(index: number) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.items[index].priority < this.items[parentIndex].priority) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    private bubbleDown(index: number) {
        const length = this.items.length;

        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallest = index;

        if (
            leftChildIndex < length &&
            this.items[leftChildIndex].priority < this.items[smallest].priority
        ) {
            smallest = leftChildIndex;
        }

        if (
            rightChildIndex < length &&
            this.items[rightChildIndex].priority < this.items[smallest].priority
        ) {
            smallest = rightChildIndex;
        }

        if (smallest !== index) {
            this.swap(index, smallest);
            index = smallest;
        }
    }

    private swap(a: number, b: number) {
        const temp = this.items[a];
        this.items[a] = this.items[b];
        this.items[b] = temp;
    }

    enqueue(item: T) {
        const newItem = { item, priority: this.nextPriority++ };
        this.items.push(newItem);
        this.bubbleUp(this.items.length - 1);
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const length = this.items.length;

        this.swap(0, length - 1); // Move the last item to the root
        const highestPriorityItem = this.items.pop(); // Remove the last item
        this.bubbleDown(0); // Restore the heap property

        if (highestPriorityItem) {
            return highestPriorityItem.item;
        }
        return undefined;
    }

    peek(count = 1): T[] {
        if (this.isEmpty() || count <= 0) {
            return [];
        }

        // Extract the specified number of items from the front of the queue
        const itemsToPeek = this.items.slice(0, count).map((item) => item.item);

        return itemsToPeek;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    // Serialize the priority queue's state
    serialize(): string {
        const serializationObject = {
            items: this.items,
            nextPriority: this.nextPriority,
        };

        return JSON.stringify(serializationObject);
    }

    // Deserialize and update the priority queue's state
    deserialize(serializedData: string): void {
        try {
            const deserializedData = JSON.parse(serializedData);

            // Ensure the deserialized data has the required properties
            if (
                deserializedData &&
                deserializedData.items &&
                deserializedData.nextPriority !== undefined
            ) {
                // Update the priority queue's state with the deserialized data
                this.items = deserializedData.items;
                this.nextPriority = deserializedData.nextPriority;
            } else {
                throw new Error("Invalid deserialized data format.");
            }
        } catch (error) {
            console.error("Error deserializing data:", error);
        }
    }
}