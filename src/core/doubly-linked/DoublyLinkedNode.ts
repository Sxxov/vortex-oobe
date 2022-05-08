import { AbstractTypedDoublyLinkedNode } from './AbstractTypedDoublyLinkedNode.js';

/**
 * This class is an alias for {@linkcode AbstractTypedDoublyLinkedNode}, so that
 * consumers of this class won't be able to set their own generic type, which
 * might trip people up since it won't match what they're actually instantiating
 */
export class DoublyLinkedNode extends AbstractTypedDoublyLinkedNode {}
