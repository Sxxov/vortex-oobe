<script lang="ts">
	import { onMount } from 'svelte';
	import { MathUtils, Object3D } from 'three';
	import type { IDreamContext } from '../components/game/renderers/dream/IDreamContext';
	import { Css3dObject } from '../components/game/renderers/dream/renderer/Css3dObject';

	const { degToRad } = MathUtils;

	export let ctx: IDreamContext;

	let containerDiv: HTMLDivElement;

	onMount(() => {
		// place object
		const pivotObject = new Object3D();
		const spriteObject = new Css3dObject(containerDiv);

		spriteObject.position.set(500, 0, 0);
		spriteObject.rotateY(degToRad(-90));

		pivotObject.add(spriteObject);

		ctx.root.add(pivotObject);

		// put in front of camera
		requestAnimationFrame(function initialCameraRotationRaf() {
			if (ctx.camera.rotation.y === 0) {
				requestAnimationFrame(initialCameraRotationRaf);
			} else {
				ctx.root.rotation.y = ctx.camera.rotation.y + Math.PI / 2;
			}
		});
	});
</script>

<div bind:this={containerDiv}>
	<h1>totally a video</h1>
</div>
