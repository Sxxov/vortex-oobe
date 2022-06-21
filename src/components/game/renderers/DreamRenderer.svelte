<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { Object3D, PerspectiveCamera, Scene } from 'three';
	import { fade } from '../../../core/transitioner/Transitioner';
	import { DeviceOrientationControls } from './dream/controls/DeviceOrientationControls';
	import type { IDreamContext } from './dream/IDreamContext';
	import { Css3dRenderer } from './dream/renderer/Css3dRenderer';

	const dispatch = createEventDispatcher();

	const VIDEO_LUMINANCE_CHECK_BLOCK_SIZE = 16;

	export let enforceLuminance =
		new URLSearchParams(window.location.search).get(
			'dream-enforce-luminance',
		) !== 'false';

	let rendererDiv: HTMLDivElement;
	let containerDivHeight = 0;
	let containerDivWidth = 0;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: Css3dRenderer;
	let root: THREE.Object3D;

	let video: HTMLVideoElement;
	let videoLuminanceCanvas: HTMLCanvasElement;
	let videoLuminanceUpdateIntervalHandle: ReturnType<typeof setInterval>;
	let videoLuminanceHistory = new Array<number>(10).fill(0);
	let videoLuminance = 0;
	let isTooBright = false;

	let isEyeOpen = true;
	let isWaking = false;
	let isWobbly = false;

	let wobblyInFilter: SVGFilterElement;
	let wobblyOutFilter: SVGFilterElement;

	let hasMounted = false;

	let dreamContext: IDreamContext;

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

		// setup camera to use gyro
		const controls = new DeviceOrientationControls(camera);
		controls.connect();

		requestAnimationFrame(function raf() {
			controls.update();
			renderer.render(scene, camera);

			requestAnimationFrame(raf);
		});

		dreamContext = {
			awaken,
			setWobbly,
			controls,
			scene,
			camera,
			renderer,
			root,
		};

		hasMounted = true;
	});

	onDestroy(() => {
		clearInterval(videoLuminanceUpdateIntervalHandle);
	});

	$: if (isWaking) {
		setTimeout(() => {
			dispatch('wake');
		}, 2000);
	}

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

	function awaken() {
		isWaking = true;
	}

	function setWobbly(v: boolean) {
		isWobbly = v;
	}
</script>

<div
	type="DreamRenderer"
	class="component"
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
			<filter id="wobbly-filter" bind:this={wobblyInFilter}>
				<feTurbulence
					type="turbulence"
					baseFrequency=".03"
					numOctaves="1"
					result="turbulence"
					seed="10"
					stitchTiles="noStitch"
				/>
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
						repeatCount="indefinite"
						fill="freeze"
					/>
				</feColorMatrix>
				<feDisplacementMap
					in2="displacementMap"
					in="SourceGraphic"
					scale="10"
					xChannelSelector="R"
					yChannelSelector="G"
				/>
			</filter>
		</defs>
	</svg>
	<div
		class="content"
		class:wobbly={isWobbly}
		class:wobbly-in={!isWaking && !isWobbly}
		class:wobbly-out={isWaking}
	>
		<video playsinline autoplay muted src="" bind:this={video} />
		<div class="renderer" bind:this={rendererDiv}>
			{#if hasMounted}
				<slot ctx={dreamContext} />
			{/if}
		</div>
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
	.component {
		@apply w-screen
			overflow-hidden;

		height: var(--height-window);

		background: #000;

		& > .filters {
			display: none;
		}

		& > .content {
			@apply h-full
				w-full;

			&.wobbly-in {
				animation-name: wobbly-in;
				animation-duration: 5s;
				animation-timing-function: theme('ease.slowSlow');
				animation-fill-mode: both;
			}

			&.wobbly-out {
				animation-name: wobbly-out;
				animation-duration: 2s;
				animation-timing-function: theme('ease.slowFast');
				animation-fill-mode: both;
			}

			&.wobbly {
				filter: url(#wobbly-filter);
			}

			& > .renderer {
				@apply h-full
					w-full;
			}

			& > video {
				@apply absolute
					h-full
					w-full
					object-cover
					top-0;
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
			opacity: 0;
		}

		50% {
			opacity: 1;
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
