<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { Object3D, PerspectiveCamera, Scene } from 'three';
	import { degToRad } from 'three/src/math/MathUtils';
	import type { TDream } from '../../core/game/components/dream/TDream';
	import { UiKinds } from '../../core/game/components/ui/UiKinds';
	import type { Game } from '../../core/game/Game';
	import { PlaceholderSprite } from '../../core/game/sprite/PlaceholderSprite';
	import { DeviceOrientationControls } from './dream/DeviceOrientationControls';
	import { Css3dObject } from './dream/renderer/Css3dObject';
	import { Css3dRenderer } from './dream/renderer/Css3dRenderer';
	import UiRenderer from './UiRenderer.svelte';
	import { fade } from '../../core/transitioner/Transitioner';

	const dispatch = createEventDispatcher();

	export let game: Game;
	export let uis: TDream[];

	const MAX_VISIBLE_COUNT = 4;
	const VIDEO_LUMINANCE_CHECK_BLOCK_SIZE = 16;

	let rendererDiv: HTMLDivElement;
	let containerDivHeight = 0;
	let containerDivWidth = 0;

	let video: HTMLVideoElement;
	let videoLuminance = Infinity;
	let videoLuminanceCanvas: HTMLCanvasElement;
	let videoLuminanceUpdateIntervalHandle: ReturnType<typeof setInterval>;
	let isTooBright = false;
	let hasDarkenedOnce = false;

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

	const elements: HTMLElement[] = new Array(uis.length);
	const elementIndexToIsVisible: (boolean | undefined)[] = new Array(
		uis.length,
	).fill(false);
	const uiToObject = new Map<TDream, Object3D>();
	const uiIndexToIsDismissed: boolean[] = [];

	onMount(() => {
		// set camera video feed
		void (async () => {
			video.srcObject = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: 'environment',
				},
			});
		})();

		// update video luminance
		videoLuminanceCanvas = document.createElement('canvas');
		const ctx = videoLuminanceCanvas.getContext('2d')!;
		videoLuminanceUpdateIntervalHandle = setInterval(() => {
			ctx.drawImage(
				video,
				0,
				0,
				videoLuminanceCanvas.width,
				videoLuminanceCanvas.height,
			);

			const data = ctx.getImageData(
				0,
				0,
				videoLuminanceCanvas.width,
				videoLuminanceCanvas.height,
			);
			const pixelCount =
				(videoLuminanceCanvas.width * videoLuminanceCanvas.height) /
				VIDEO_LUMINANCE_CHECK_BLOCK_SIZE;
			let r = 0;
			let g = 0;
			let b = 0;

			for (
				let i = 0, l = data.data.length;
				i < l;
				i += 4 * VIDEO_LUMINANCE_CHECK_BLOCK_SIZE
			) {
				const a = data.data[i + 3];
				const aFloat = a / 255;
				r += data.data[i + 0] * aFloat;
				g += data.data[i + 1] * aFloat;
				b += data.data[i + 2] * aFloat;
			}

			// https://gist.github.com/jfsiii/5641126
			const rFloat = r / 255 / pixelCount;
			const gFloat = g / 255 / pixelCount;
			const bFloat = b / 255 / pixelCount;

			videoLuminance =
				0.2126 *
					(rFloat <= 0.03928
						? rFloat / 12.92
						: ((rFloat + 0.055) / 1.055) ** 2.4) +
				0.7152 *
					(gFloat <= 0.03928
						? gFloat / 12.92
						: ((gFloat + 0.055) / 1.055) ** 2.4) +
				0.0722 *
					(bFloat <= 0.03928
						? bFloat / 12.92
						: ((bFloat + 0.055) / 1.055) ** 2.4);
		}, 500);

		// setup scene
		scene = new Scene();
		camera = new PerspectiveCamera(90, 1, 0.1, 2000);
		renderer = new Css3dRenderer({ element: rendererDiv });
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
			] = [
				degToRad(Math.random() * 0),
				// degToRad(Math.random() * 360),
				degToRad(yy),
				// degToRad(Math.random() * 160 - 80),
				degToRad(zz - 90),
			];

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

	onDestroy(() => {
		clearInterval(videoLuminanceUpdateIntervalHandle);
	});

	// when everything is false
	$: if (
		!elementIndexToIsVisible.some((isVisible) => isVisible !== undefined)
	) {
		dispatch('wake');
	}

	// reset
	$: uis, uiIndexToIsDismissed.fill(false);

	// responsive THREE canvas
	$: if (hasMounted) {
		renderer.setSize(containerDivWidth, containerDivHeight);

		camera.aspect = containerDivWidth / containerDivHeight;
		camera.updateProjectionMatrix();

		renderer.render(scene, camera);
	}

	// responsive video luminance canvas
	$: if (videoLuminanceCanvas && video) {
		videoLuminanceCanvas.height = containerDivHeight;
		videoLuminanceCanvas.width = containerDivWidth;
	}

	$: if (videoLuminance < 0.02) {
		hasDarkenedOnce = true;
	}

	$: isTooBright = videoLuminance > (hasDarkenedOnce ? 0.08 : 0.02);

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
	class="dream"
	bind:clientHeight={containerDivHeight}
	bind:clientWidth={containerDivWidth}
	bind:this={rendererDiv}
>
	<video playsinline autoplay muted src="" bind:this={video} />
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
	{#if isTooBright}
		<div class="too-bright" in:fade out:fade>
			<p>It's currently too bright to dream, dim your surroundings.</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.dream {
		@apply h-screen
			w-screen;

		& > video {
			@apply absolute
				h-full
				w-full
				object-cover
				top-0;
		}

		& .ui {
			height: 400px;
			width: 400px;

			&.no {
				pointer-events: none !important;
			}
		}

		& > .too-bright {
			@apply absolute
				box-border
				top-0
				grid
				items-center
				justify-items-center
				h-full
				w-full;

			background: #000;
			padding: theme('padding');

			& > p {
				@apply text-center;
			}
		}
	}
</style>
