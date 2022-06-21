<script lang="ts">
	import { onMount } from 'svelte';
	import { Object3D, PerspectiveCamera, Scene, MathUtils } from 'three';
	import { ConsumableComponent } from '../../../../core/game/components/consumable/ConsumableComponent';
	import { DreamComponent } from '../../../../core/game/components/dream/DreamComponent';
	import type { IDream } from '../../../../core/game/components/dream/IDream';
	import { UiKinds } from '../../../../core/game/components/ui/UiKinds';
	import type { Game } from '../../../../core/game/Game';
	import { PlaceholderSprite } from '../../../../core/game/sprite/PlaceholderSprite';
	import UiRenderer from '../UiRenderer.svelte';
	import { DeviceOrientationControls } from './controls/DeviceOrientationControls';
	import type { IDreamContext } from './IDreamContext';
	import { Css3dObject } from './renderer/Css3dObject';
	import { Css3dRenderer } from './renderer/Css3dRenderer';

	const { degToRad } = MathUtils;

	const MAX_VISIBLE_COUNT = 4;

	export let ctx: IDreamContext;
	export let game: Game;

	let uis = game.round
		.value!.entityPool.value.map(
			(entity) =>
				entity.component(ConsumableComponent)?.isConsumed.value &&
				entity.component(DreamComponent)?.ui,
		)
		.filter(Boolean) as IDream[];
	let uisDiv: HTMLDivElement;
	let uisDivHeight = 0;
	let uisDivWidth = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: Css3dRenderer;
	let root: THREE.Object3D;

	let hasMounted = false;

	if (uis.length <= 0) {
		uis = [
			{
				heading: 'You did nothing today',
				message: 'Very productive.',
				options: ['ok'],
				sprite: new PlaceholderSprite(),
			},
		];
	}

	onMount(() => {
		if (uis.length <= 0) {
			return;
		}

		// setup scene
		scene = new Scene();
		camera = new PerspectiveCamera(90, 1, 0.1, 2000);
		renderer = new Css3dRenderer({ element: uisDiv });
		root = new Object3D();
		scene.add(root);

		// calculate random rotations
		const rotations = new Array(uis.length).fill(undefined).map((_, i) => {
			const spread = Math.sqrt(uis.length);
			const ys = 360 / spread; // x spacing
			const zs = 180 / spread; // y spacing
			const n = i % uis.length;
			const y = (n % spread) * ys;
			const z = Math.floor(n / spread) * zs;
			const yy = Math.floor(Math.random() * ys + y);
			const zz = Math.floor(Math.random() * zs + z);

			return [yy, zz];
		});
		rotations.sort(() => (Math.random() < 0.5 ? 1 : -1));

		// place objects
		for (let i = 0, l = uis.length; i < l; ++i) {
			const ui = uis[i];
			const element = elements[i];
			const [yy, zz] = rotations[i];

			const pivotObject = new Object3D();
			const spriteObject = new Css3dObject(element);

			spriteObject.position.set(500, 0, 0);
			spriteObject.rotateY(degToRad(-90));

			pivotObject.add(spriteObject);

			[
				pivotObject.rotation.x,
				pivotObject.rotation.y,
				pivotObject.rotation.z,
			] = [degToRad(Math.random() * 0), degToRad(yy), degToRad(zz - 90)];

			root.add(pivotObject);
			uiToObject.set(ui, pivotObject);
		}

		// setup camera to use gyro
		const controls = new DeviceOrientationControls(camera);
		controls.connect();

		requestAnimationFrame(function raf() {
			controls.update();
			renderer.render(scene, camera);

			requestAnimationFrame(raf);
		});

		hasMounted = true;
	});

	const elements: HTMLElement[] = new Array(uis.length);
	const elementIndexToIsVisible: (boolean | undefined)[] = new Array(
		uis.length,
	).fill(false);
	const uiToObject = new Map<IDream, Object3D>();

	// when everything is false
	$: if (
		!elementIndexToIsVisible.some((isVisible) => isVisible !== undefined)
	) {
		ctx.awaken();
	}

	// responsive THREE canvas
	$: if (hasMounted) {
		renderer.setSize(uisDivWidth, uisDivHeight);

		camera.aspect = uisDivWidth / uisDivHeight;
		camera.updateProjectionMatrix();

		renderer.render(scene, camera);
	}

	$: {
		let currVisibleCount = 0;

		for (
			let i = 0, l = elementIndexToIsVisible.length;
			i < l && currVisibleCount < MAX_VISIBLE_COUNT;
			++i
		) {
			if (elementIndexToIsVisible[i]) {
				++currVisibleCount;
			} else if (elementIndexToIsVisible[i] === false) {
				elementIndexToIsVisible[i] = true;
				++currVisibleCount;
			}
		}
	}
</script>

<div
	type="DreamUiContent"
	class="component"
	bind:this={uisDiv}
	bind:clientHeight={uisDivHeight}
	bind:clientWidth={uisDivWidth}
>
	{#each uis as ui, i}
		<div
			class="ui"
			class:no={!elementIndexToIsVisible[i]}
			bind:this={elements[i]}
		>
			{#if elementIndexToIsVisible[i]}
				<UiRenderer
					{game}
					ui={{ kind: UiKinds.ALERT, ...ui }}
					on:result={() => {
						const object = uiToObject.get(ui);

						if (object) {
							root.remove(object);
							uiToObject.delete(ui);
						}

						elementIndexToIsVisible[i] = undefined;
					}}
				/>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.component {
		@apply h-full
			w-full;

		& .ui {
			height: 400px;
			width: 400px;

			&.no {
				pointer-events: none !important;
			}
		}
	}
</style>
