import { IllegalInvocationError } from '../../resources/errors/IllegalInvocationError.js';
import type { AbstractTypedDoublyLinkedNode } from './AbstractTypedDoublyLinkedNode.js';
import type { IPlainable } from './IPlainable.js';

export class DoublyLinkedList<
	Head extends AbstractTypedDoublyLinkedNode<
		AbstractTypedDoublyLinkedNode<any>
	>,
> implements
		RelativeIndexable<Head['next']>,
		IPlainable<(Record<string | number, unknown> | string | number)[]>
{
	constructor(public head: Head) {}

	public get plain() {
		return Array.from(
			this,
			(node) =>
				(
					node as unknown as IPlainable<
						Record<string | number, unknown> | string | number
					>
				).plain ?? node,
		);
	}

	public at(index: number): Head | Head['next'] {
		let node: Head | Head['next'] = this.head;

		for (let i = 0, l = index + 1; i < l; ++i) {
			if (!node) break;

			node = node.next as Head['next'];
		}

		return node;
	}

	/**
	 * Replaces the head of the list with its {@linkcode next} neighbour
	 *
	 * @returns The original head node
	 * @see {@link DoublyLinkedNode.next}
	 */
	public unshift(): Head | Head['next'] {
		const { next }: { next?: Head | Head['next'] } = this.head;

		if (!next)
			throw new IllegalInvocationError(
				'Attempted to unshift a list with only the head node',
			);

		const unshifted = next.unlinkPrev() as Head;

		this.head = next as Head;

		return unshifted;
	}

	public forEach(
		callback: (
			node: NonNullable<Head | Head['next']>,
			index: number,
			list: this,
		) => void,
	) {
		let node: Head | Head['next'] | undefined = this.head;
		let i = 0;

		while (node) {
			callback(node!, i, this);

			node = node.next as Head;
			++i;
		}
	}

	*[Symbol.iterator]() {
		let node: Head | Head['next'] = this.head;

		while (node) {
			yield node as NonNullable<Head | Head['next']>;

			node = node.next as Head;
		}
	}

	public get tail(): Head | NonNullable<Head['next']> {
		return this.head.tail as Head | NonNullable<Head['next']>;
	}

	/**
	 * The number of nodes present in the list
	 *
	 * @see {@link DoublyLinkedNode}
	 */
	public get length() {
		let node: Head | Head['next'] | undefined = this.head;
		let i = 0;

		while (node) {
			++i;

			node = node.next as Head['next'];
		}

		return i;
	}
}
