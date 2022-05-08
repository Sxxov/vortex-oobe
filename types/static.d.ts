declare module '*.svg' {
	export default '';
}

declare module '!p::*' {
	export default '';
}

declare module '!r::*' {
	export default '';
}

declare module '!tw' {
	export const theme: Record<string, any> = {};
}
