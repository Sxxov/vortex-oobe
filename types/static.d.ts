declare module '*.svg' {
	const src: string;
	export default src;
}

// quicktime video
declare module '*.mov' {
	const src: string;
	export default src;
}

// png that should stay a png
declare module '*.png?png' {
	const src: string;
	export default src;
}

declare module '!tw' {
	const src: string;
	export default src;
}
