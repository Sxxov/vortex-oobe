<script lang="ts" context="module">
	export interface IRippleVector {
		x: number;
		y: number;
		size: number;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';

	export let x: number;
	export let y: number;
	export let sizeIn: number;
	export let size: number;
	export let speed: number;
	export let opacityIn: number;
	export let fill: Css;

	const rippleSize = tweened(sizeIn, { duration: speed });
	const rippleOpacity = tweened(opacityIn, {
		duration: speed + speed * 2.5,
		easing: expoOut,
	});

	onMount(() => {
		void rippleSize.set(size);
		void rippleOpacity.set(0);
	});
</script>

<circle
	style="fill: {CssUtility.parse(fill)};"
	cx={x}
	cy={y}
	r={$rippleSize}
	opacity={$rippleOpacity}
/>
