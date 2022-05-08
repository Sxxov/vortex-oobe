export interface IPlainable<PlainPropType> {
	/**
	 * A JSON stringify-able object representing the core of the class. Should
	 * not include any circular references
	 */
	plain: PlainPropType;
}
