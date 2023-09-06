/**
 * @file ActionPerformerQueue<T>
 *
 * This TypeScript class represents an Action Performer Queue, which is designed
 * to manage performers with different roles (speakers, co-hosts, and hosts) in a
 * priority order. It allows actions like adding, removing, promoting, and demoting
 * performers within the queue.
 *
 * Public Methods:
 * - `addActionPerformer(performer: T, type: 'speaker' | 'coHost' | 'host')`: Adds
 *   a performer to the queue with the specified role type.
 * - `removeActionPerformer(performer: T)`: Removes a performer from the queue.
 * - `getHighestPriorityPerformer(): T | undefined`: Retrieves the performer with
 *   the highest priority role (host > co-host > speaker) from the queue.
 * - `promoteToCoHost(speaker: T)`: Promotes a speaker to a co-host role within
 *   the queue.
 * - `demoteToSpeaker(coHost: T)`: Demotes a co-host to a speaker role within the
 *   queue.
 * - `serialize(): string`: Serializes the current state of the action performer
 *   queue to a JSON string.
 * - `deserialize(serializedData: string): void`: Deserializes and updates the
 *   action performer queue's state from a JSON string.
 *
 * Author: Nilesh Gupta
 * Date: 6 September 2023
 */

export class ActionPerformerQueue<T> {
    private speakers: T[] = [];
    private coHosts: T[] = [];
    private hosts: T[] = [];

    // Add an action performer to the queue with a specified type
    addActionPerformer(performer: T, type: 'speaker' | 'coHost' | 'host') {
        switch (type) {
            case 'speaker':
                this.speakers.push(performer);
                break;
            case 'coHost':
                this.coHosts.push(performer);
                break;
            case 'host':
                this.hosts.push(performer);
                break;
            default:
                throw new Error('Invalid performer type.');
        }
    }

    // Remove an action performer from the queue
    removeActionPerformer(performer: T) {
        const removeFromArray = (arr: T[]) => {
            const index = arr.indexOf(performer);
            if (index !== -1) {
                arr.splice(index, 1);
            }
        };

        removeFromArray(this.speakers);
        removeFromArray(this.coHosts);
        removeFromArray(this.hosts);
    }

    // Get the highest priority action performer (host > co-host > speaker)
    getHighestPriorityPerformer(): T | undefined {
        if (this.hosts.length > 0) {
            return this.hosts[0];
        }
        if (this.coHosts.length > 0) {
            return this.coHosts[0];
        }
        if (this.speakers.length > 0) {
            return this.speakers[0];
        }
        return undefined;
    }

    // Promote a speaker to a co-host
    promoteToCoHost(speaker: T) {
        this.removeActionPerformer(speaker);
        this.addActionPerformer(speaker, 'coHost');
    }

    // Demote a co-host to a speaker
    demoteToSpeaker(coHost: T) {
        this.removeActionPerformer(coHost);
        this.addActionPerformer(coHost, 'speaker');
    }

    // Serialize the action performer queue's state
    serialize(): string {
        const serializationObject = {
            speakers: this.speakers,
            coHosts: this.coHosts,
            hosts: this.hosts,
        };

        return JSON.stringify(serializationObject);
    }

    // Deserialize and update the action performer queue's state
    deserialize(serializedData: string): void {
        try {
            const deserializedData = JSON.parse(serializedData);

          // Ensure the deserialized data has the required properties
            if (
                deserializedData &&
                deserializedData.speakers &&
                deserializedData.coHosts &&
                deserializedData.hosts
            ) {
                // Update the action performer queue's state with the deserialized data
                this.speakers = deserializedData.speakers;
                this.coHosts = deserializedData.coHosts;
                this.hosts = deserializedData.hosts;
            } else {
                throw new Error("Invalid deserialized data format.");
            }
        } catch (error) {
            console.error("Error deserializing data:", error);
        }
    }
}