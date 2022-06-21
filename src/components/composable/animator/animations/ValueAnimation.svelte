<script lang="ts">
	import type { Animator } from '../../../../core/animator';
	import { ValueAnimation } from '../../../../core/animator/animations/ValueAnimation';
	import { IllegalArgumentError } from '../../../../resources/errors';
	import { onDestroy as onComponentDestroy } from 'svelte';

	export let animator: Animator;
	export let inFrame: ValueAnimation['in'];
	export let outFrame: ValueAnimation['out'] | undefined = undefined;
	export let fps: ValueAnimation['fps'] = 60;
	export let length: ValueAnimation['length'] | undefined = undefined;
	export let onFrame: ValueAnimation['onFrame'] = (_) => {};
	export let onStart: ValueAnimation['onStart'] = () => {};
	export let onEnd: ValueAnimation['onEnd'] = () => {};
	export let onCreate: ValueAnimation['onCreate'] = () => {};
	export let onDestroy: ValueAnimation['onDestroy'] = () => {};

	let value: number;

	if (outFrame == null && length == null) {
		throw new IllegalArgumentError(
			'neither `outFrame` nor length was `supplied`',
		);
	}

	animator.add(
		ValueAnimation.from({
			fps: Number(fps),
			in: inFrame,
			out: length ? Number(inFrame) + Number(length) : outFrame ?? 0,
			onStart,
			onEnd,
			onFrame: (v, length) => {
				onFrame(v, length);

				value = v;
			},
			onCreate,
			onDestroy,
		}),
	);

	onComponentDestroy(() => {
		animator.composition.destroy();
	});
</script>

<slot {value} />

<style>
</style>
