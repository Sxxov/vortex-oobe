<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { Object3D, PerspectiveCamera, Scene, MathUtils } from 'three';
	import type { TDream } from '../../core/game/components/dream/TDream';
	import { UiKinds } from '../../core/game/components/ui/UiKinds';
	import type { Game } from '../../core/game/Game';
	import { PlaceholderSprite } from '../../core/game/sprite/PlaceholderSprite';
	import { DeviceOrientationControls } from './dream/DeviceOrientationControls';
	import { Css3dObject } from './dream/renderer/Css3dObject';
	import { Css3dRenderer } from './dream/renderer/Css3dRenderer';
	import UiRenderer from './UiRenderer.svelte';
	import { fade } from '../../core/transitioner/Transitioner';

	const { degToRad } = MathUtils;
	const dispatch = createEventDispatcher();

	export let game: Game;
	export let uis: TDream[];
	export let enforceLuminance =
		new URLSearchParams(window.location.search).get(
			'dream-enforce-luminance',
		) !== 'false';

	const MAX_VISIBLE_COUNT = 4;
	const VIDEO_LUMINANCE_CHECK_BLOCK_SIZE = 16;

	let rendererDiv: HTMLDivElement;
	let containerDivHeight = 0;
	let containerDivWidth = 0;

	let video: HTMLVideoElement;
	let videoLuminanceCanvas: HTMLCanvasElement;
	let videoLuminanceUpdateIntervalHandle: ReturnType<typeof setInterval>;
	let videoLuminanceHistory = new Array<number>(10).fill(0);
	let videoLuminance = 0;
	let isTooBright = false;

	let isEyeOpen = true;
	let isWaking = false;

	let wobblyInFilter: SVGFilterElement;
	let wobblyOutFilter: SVGFilterElement;

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

			videoLuminanceHistory.shift();
			videoLuminanceHistory.push(
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
							: ((bFloat + 0.055) / 1.055) ** 2.4),
			);
			videoLuminanceHistory = videoLuminanceHistory;
		}, 100);

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
		isWaking = true;
	}

	$: if (isWaking) {
		setTimeout(() => {
			dispatch('wake');
		}, 2000);
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

	$: videoLuminance =
		videoLuminanceHistory.reduce((a, b) => a + b) /
		videoLuminanceHistory.length;

	$: isTooBright = enforceLuminance && videoLuminance > 0.08;

	$: isEyeOpen = !isTooBright;

	$: if (isWaking) {
		wobblyOutFilter?.querySelectorAll('animate').forEach((elem) => {
			elem.beginElement();
		});
	} else {
		wobblyInFilter?.querySelectorAll('animate').forEach((elem) => {
			elem.beginElement();
		});
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
	class="dream"
	bind:clientHeight={containerDivHeight}
	bind:clientWidth={containerDivWidth}
>
	<svg class="filters" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<filter id="wobbly-out-filter" bind:this={wobblyOutFilter}>
				<feTurbulence
					type="turbulence"
					baseFrequency="0"
					numOctaves="1"
					result="turbulence"
					seed="10"
					stitchTiles="noStitch"
				>
					<animate
						attributeName="baseFrequency"
						attributeType="XML"
						from="0"
						to=".03"
						begin="0s"
						dur="2s"
						repeatCount="1"
						fill="freeze"
						calcMode="spline"
						keySplines=".64 0 .78 0"
					/>
				</feTurbulence>
				<feColorMatrix
					in="turbulence"
					type="hueRotate"
					values="0"
					result="displacementMap"
				>
					<animate
						attributeName="values"
						from="0"
						to="360"
						dur=".3s"
						repeatCount="7"
						fill="freeze"
					/>
				</feColorMatrix>
				<feDisplacementMap
					in2="displacementMap"
					in="SourceGraphic"
					scale="-100"
					xChannelSelector="R"
					yChannelSelector="G"
				>
					<animate
						attributeName="scale"
						from="0"
						to="-100"
						dur="2s"
						repeatCount="1"
						fill="freeze"
						calcMode="spline"
						keySplines=".64 0 .78 0"
					/>
				</feDisplacementMap>
			</filter>
			<filter id="wobbly-in-filter" bind:this={wobblyInFilter}>
				<feTurbulence
					type="turbulence"
					baseFrequency="0"
					numOctaves="1"
					result="turbulence"
					seed="10"
					stitchTiles="noStitch"
				>
					<animate
						attributeName="baseFrequency"
						attributeType="XML"
						from=".03"
						to="0"
						begin="0s"
						dur="5s"
						repeatCount="1"
						fill="freeze"
						calcMode="spline"
						keySplines=".83 0 .17 1"
					/>
				</feTurbulence>
				<feColorMatrix
					in="turbulence"
					type="hueRotate"
					values="0"
					result="displacementMap"
				>
					<animate
						attributeName="values"
						from="0"
						to="360"
						dur=".3s"
						repeatCount="17"
						fill="freeze"
					/>
				</feColorMatrix>
				<feDisplacementMap
					in2="displacementMap"
					in="SourceGraphic"
					scale="0"
					xChannelSelector="R"
					yChannelSelector="G"
				>
					<animate
						attributeName="scale"
						from="-100"
						to="0"
						dur="5s"
						repeatCount="1"
						fill="freeze"
						calcMode="spline"
						keySplines=".83 0 .17 1"
					/>
				</feDisplacementMap>
			</filter>
		</defs>
	</svg>
	<div
		class="content"
		bind:this={rendererDiv}
		class:wobbly-in={!isWaking}
		class:wobbly-out={isWaking}
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
		<div class="eyelids" class:closed={!isEyeOpen}>
			<div class="top" />
			<div class="bottom" />
		</div>
		{#if isTooBright}
			<div class="too-bright" in:fade out:fade>
				<p>
					It's currently too bright to dream, dim your surroundings.
				</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.dream {
		@apply h-screen
			w-screen;

		background: #000;

		& .wobbly-in {
			animation-name: wobbly-in;
			animation-duration: 5s;
			animation-timing-function: theme('ease.slowSlow');
			animation-fill-mode: both;
		}

		& .wobbly-out {
			animation-name: wobbly-out;
			animation-duration: 2s;
			animation-timing-function: theme('ease.slowFast');
			animation-fill-mode: both;
		}

		& > .filters {
			display: none;
		}

		& > .content {
			@apply h-full
				w-full;

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

			& > .eyelids {
				@apply absolute
				box-border
				top-0
				h-full
				w-full
				pointer-events-none;

				z-index: 1;

				& > * {
					@apply absolute
					h-full
					w-full;
					background: #000;
				}

				&.closed {
					@apply pointer-events-auto;

					& > .top {
						clip-path: inset(0 0 49.95% 0);
					}

					& > .bottom {
						clip-path: inset(49.95% 0 0 0);
					}
				}

				& > .top {
					@apply top-0
					left-0;

					clip-path: inset(0 0 100% 0);
					transition: clip-path 0.3s theme('ease.fastSlow');
				}

				& > .bottom {
					@apply bottom-0
					left-0
					h-full
					w-full;

					clip-path: inset(100% 0 0 0);
					transition: clip-path 0.3s theme('ease.fastSlow');
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

				z-index: 1;

				padding: theme('padding');

				& > p {
					@apply text-center;
				}
			}
		}
	}

	@keyframes wobbly-in {
		0% {
			filter: url(#wobbly-in-filter);
			transform: scale(10);
		}

		99.99% {
			filter: url(#wobbly-in-filter);
		}

		100% {
			filter: none;
			transform: scale(1);
		}
	}

	@keyframes wobbly-out {
		0% {
			filter: none;
			transform: scale(1);
			opacity: 1;
		}

		0.01% {
			filter: url(#wobbly-out-filter);
		}

		99.99% {
			filter: url(#wobbly-out-filter);
		}

		100% {
			filter: none;
			transform: scale(10);
			opacity: 0;
		}
	}
</style>
