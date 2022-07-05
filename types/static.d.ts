declare module '*.svg' {
	const src: string;
	export default src;
}

// png that should stay a png
declare module '*.png?png' {
	const src: string;
	export default src;
}
