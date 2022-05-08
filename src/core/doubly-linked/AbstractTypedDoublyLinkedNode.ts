/* eslint-disable no-unmodified-loop-condition */
import { IllegalInvocationError } from '../../resources/errors/IllegalInvocationError.js';
import type { TCoalesceNever } from '../blocks/types/TCoalesceNever.js';
import type { IDoublyLinkedNode } from './IDoublyLinkedNode.js';

export abstract class AbstractTypedDoublyLinkedNode<
	T extends AbstractTypedDoublyLinkedNode<any> = never,
> implements IDoublyLinkedNode
{
	public prev: TCoalesceNever<T, typeof this> | undefined;
	public next: TCoalesceNever<T, typeof this> | undefined;

	public get head(): TCoalesceNever<T, typeof this> {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (node!.prev) {
			node = node!.prev as TCoalesceNever<T, typeof this> | undefined;
		}

		return node!;
	}

	public get tail(): TCoalesceNever<T, typeof this> {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (node!.next) {
			node = node!.next as TCoalesceNever<T, typeof this> | undefined;
		}

		return node!;
	}

	public get nextStub(): typeof this {
		return (this.next ??
			new (this.constructor as new (...args: any[]) => any)(
				this,
				undefined,
			)) as this;
	}

	public get prevStub(): typeof this {
		return (this.prev ??
			new (this.constructor as new (...args: any[]) => any)(
				undefined,
				this,
			)) as this;
	}

	constructor(
		prev?: AbstractTypedDoublyLinkedNode['prev'],
		next?: AbstractTypedDoublyLinkedNode['next'],
	) {
		if (prev)
			this.linkPrev(prev as unknown as TCoalesceNever<T, typeof this>);
		if (next)
			this.linkNext(next as unknown as TCoalesceNever<T, typeof this>);
	}

	/**
	 * Unlinks {@linkcode prev} & links to {@linkcode prev.prev} instead
	 *
	 * @returns The unlinked node ({@linkcode prev})
	 * @see {@link unlink}
	 */
	public popPrev(): TCoalesceNever<T, typeof this> | undefined {
		const { prev } = this;

		if (!prev) return prev;

		this.prev = prev.prev as typeof this.prev;
		if (prev.prev) prev.prev.next = this;

		prev.next = undefined;
		prev.prev = undefined;

		return prev;
	}

	/**
	 * Unlinks {@linkcode next} & links to {@linkcode next.next} instead
	 *
	 * @returns The unlinked node ({@linkcode next})
	 * @see {@link unlink}
	 */
	public popNext(): TCoalesceNever<T, typeof this> | undefined {
		const { next } = this;

		if (!next) return next;

		this.next = next.next as typeof this.next;
		if (next.next) next.next.prev = this;

		next.next = undefined;
		next.prev = undefined;

		return next;
	}

	/**
	 * Links {@linkcode next prev.next} to {@linkcode next}, &
	 * {@linkcode prev next.prev} to {@linkcode prev}
	 *
	 * @returns The unlinked node ({@linkcode AbstractTypedDoublyLinkedNode this})
	 * @see {@link popNext}
	 * @see {@link popPrev}
	 */
	public pop(): this {
		if (this.prev) this.prev.next = this.next;
		if (this.next) this.next.prev = this.prev;

		return this;
	}

	/**
	 * Doubly links to a new next node
	 *
	 * @param node Node to link to
	 * @see {@link next}
	 */
	public linkNext(node: TCoalesceNever<T, typeof this> | undefined) {
		this.next = node;
		if (node) node.prev = this;
	}

	/**
	 * Doubly links to a new previous node
	 *
	 * @param node Node to link to
	 * @see {@link prev}
	 */
	public linkPrev(node: TCoalesceNever<T, typeof this> | undefined) {
		this.prev = node;
		if (node) node.next = this;
	}

	/**
	 * Unlinks both {@linkcode next} & {@linkcode prev}
	 *
	 * @returns An array containing both unlinked values (`[`{@linkcode prev}`,
	 *   `{@linkcode next}`]`)
	 * @throws {IllegalInvocationError} If you try to unlink both
	 *   {@linkcode next} & {@linkcode prev} before giving them a non-nullish value
	 * @see {@link unlinkPrev}
	 * @see {@link unlinkNext}
	 */
	public unlink(): TCoalesceNever<T, typeof this>[] {
		const prev = this.unlinkPrev();
		const next = this.unlinkNext();

		// returns an array to not be confused as returning another IDoublyLinkedNode
		// since `prev` & `next` aren't connected to each other
		return [prev, next];
	}

	/**
	 * Unlinks {@linkcode prev} by setting it & {@linkcode prev.next} to `null`
	 *
	 * @returns The unlinked node ({@linkcode prev})
	 * @throws {IllegalInvocationError} If you try to unlink {@linkcode prev}
	 *   before giving it a non-nullish value
	 */
	public unlinkPrev(): TCoalesceNever<T, typeof this> {
		if (!this.prev)
			throw new IllegalInvocationError(
				'Attempted to unlink `this.prev` before giving it a non-nullish value or when it is already unlinked',
			);

		const { prev } = this;

		prev.next = undefined;
		this.prev = undefined;

		return prev;
	}

	/**
	 * Unlinks {@linkcode next} by setting it & {@linkcode next.prev} to `null`
	 *
	 * @returns The unlinked node ({@linkcode next})
	 * @throws {IllegalInvocationError} Thrown if you try to unlink
	 *   {@linkcode next} before giving it a non-nullish value
	 */
	public unlinkNext(): TCoalesceNever<T, typeof this> {
		if (!this.next)
			throw new IllegalInvocationError(
				'Attempted to unlink `next` before giving it a non-nullish value or when it is already unlinked',
			);

		const { next } = this;

		next.prev = undefined;
		this.next = undefined;

		return next;
	}

	/**
	 * Iterates through the list, starting from {@linkcode next} & finds a node
	 * according to `predicate`
	 *
	 * @param predicate A callback returning a `boolean` to tell the method
	 *   which node to return — a falsy value means to continue; truthy means to return
	 * @returns The node at where `predicate` returned a truthy value
	 */
	public findNext(
		predicate: (node: TCoalesceNever<T, typeof this>) => boolean,
	): TCoalesceNever<T, typeof this> | undefined {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (
			(node = node.next as TCoalesceNever<T, typeof this> | undefined)
		) {
			const result = predicate(node);

			if (result) return node;
		}

		return undefined;
	}

	/**
	 * Iterates through the list, starting from {@linkcode prev} until
	 * {@linkcode head} & finds a node according to `predicate`
	 *
	 * @param predicate A callback returning a `boolean` to tell the method
	 *   which node to return — a falsy value means to continue; truthy means to return
	 * @returns The node at where `predicate` returned a truthy value
	 */
	public findPrev(
		predicate: (node: TCoalesceNever<T, typeof this>) => boolean,
	): TCoalesceNever<T, typeof this> | undefined {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (
			(node = node.prev as TCoalesceNever<T, typeof this> | undefined)
		) {
			const result = predicate(node);

			if (result) return node;
		}

		return undefined;
	}

	public neighbour(
		offset: number,
	): TCoalesceNever<T, typeof this> | undefined {
		let i = 0;
		return offset === 0
			? (this as TCoalesceNever<T, typeof this>)
			: offset > 0
			? this.findNext(() => ++i === offset)
			: this.findPrev(() => --i === offset);
	}

	/**
	 * Iterates through the list, starting from {@linkcode next} until
	 * {@linkcode tail} & executes `callback`
	 *
	 * @param callback Callback to run at every iteration
	 */
	public whileNext(callback: (node: TCoalesceNever<T, typeof this>) => void) {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (
			(node = node.next as TCoalesceNever<T, typeof this> | undefined)
		) {
			callback(node);
		}
	}

	/**
	 * Iterates through the list, starting from {@linkcode prev} until
	 * {@linkcode head} & executes `callback`
	 *
	 * @param callback Callback to run at every iteration
	 */
	public whilePrev(callback: (node: TCoalesceNever<T, typeof this>) => void) {
		let node: TCoalesceNever<T, typeof this> | undefined =
			this as TCoalesceNever<T, typeof this>;

		while (
			(node = node.prev as TCoalesceNever<T, typeof this> | undefined)
		) {
			callback(node);
		}
	}
}
