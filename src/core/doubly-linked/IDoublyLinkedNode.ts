export interface IDoublyLinkedNode {
	/**
	 * The previous node, relative to this one, in the doubly linked list.
	 * `undefined` means there are no more nodes before this one
	 */
	prev: IDoublyLinkedNode | undefined;
	/**
	 * The next node, relative to this one, in the doubly linked list.
	 * `undefined` means there are no more nodes after this one
	 */
	next: IDoublyLinkedNode | undefined;
	/**
	 * A stub implementation of {@linkcode prev} which contains `this` as its
	 * `next` property.
	 *
	 * It may or may not be the same as {@linkcode prev} depending on
	 * implementation & whether it is currently nullish.
	 *
	 * It is mainly used for loops where one would use {@linkcode next} for the
	 * first node onwards
	 *
	 * @example
	 * 	let collected: CharLinkedNode = this.currChar.prevStub;
	 *
	 * 	while ((collected = collected.next)) {
	 * 		// do something
	 * 	}
	 *
	 * @see {@link prev}
	 * @see {@link next}
	 */
	prevStub: IDoublyLinkedNode;
	/**
	 * A stub implementation of {@linkcode next} which contains `this` as its
	 * `prev` property.
	 *
	 * It may or may not be the same as {@linkcode prev} depending on
	 * implementation & whether it is currently nullish.
	 *
	 * It is mainly used for loops where one would use {@linkcode prev} for the
	 * first node onwards
	 *
	 * @example
	 * 	let collected: CharLinkedNode = this.currChar.nextStub;
	 *
	 * 	while ((collected = collected.prev)) {
	 * 		// do something
	 * 	}
	 *
	 * @see {@link prev}
	 * @see {@link next}
	 */
	nextStub: IDoublyLinkedNode;
	/** The first node in the list. Will be `this` if it's the first node */
	head: IDoublyLinkedNode;
	/** The last node in the list. Will be `this` if it's the last node */
	tail: IDoublyLinkedNode;
}
