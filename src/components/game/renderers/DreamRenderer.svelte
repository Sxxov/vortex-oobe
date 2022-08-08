<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Object3D, PerspectiveCamera, Scene, MathUtils } from 'three';
	import { dropIn, fade } from '../../../core/transitioner/Transitioner';
	import { DeviceOrientationControls } from './dream/controls/DeviceOrientationControls';
	import type { IDreamContext } from './dream/IDreamContext';
	import { Css3dRenderer } from './dream/renderer/Css3dRenderer';
	import {
		done,
		info,
		error,
		arrow_forward,
		camera_alt,
		settings_backup_restore,
		swipe,
		refresh,
	} from '!i/twotone::done,info,error,arrow_forward,camera_alt,settings_backup_restore,swipe,refresh';
	import { writable } from 'svelte/store';
	import SvgButton from '../../composable/buttons/SvgButton.svelte';
	import Spacer from '../../composable/Spacer.svelte';
	import { DeviceOrientationControlsConnectResults } from './dream/controls/DeviceOrientationControlsConnectResults';
	import exifr from 'exifr';

	const { radToDeg } = MathUtils;

	let rendererDiv: HTMLDivElement;
	let containerDivHeight = 0;
	let containerDivWidth = 0;
	let windowHeight: number;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: Css3dRenderer;
	let root: THREE.Object3D;

	let video: HTMLVideoElement;
	let mediaStream: MediaStream | undefined;

	let isEyeOpen = true;

	const isAlertShown = writable(false);
	let alertHeading = '';
	let alertText = '';
	let alertSvg = '';
	let alertButtonText = '';
	let alertButtonSvg = '';

	let isHintShown = false;
	let isHintShownHandle: ReturnType<typeof setTimeout>;

	let wobblyInFilter: SVGFilterElement;
	let wobblyOutFilter: SVGFilterElement;

	let hasDestroyed = false;
	let hasMounted = false;
	let hasInitialised = false;

	let dreamContext: IDreamContext;

	onMount(async () => {
		hasMounted = true;

		const hasCameraPermission =
			((await navigator.mediaDevices.enumerateDevices()).find(
				({ kind }) => kind === 'videoinput',
			)?.label ?? '') !== '';

		if (!hasCameraPermission) {
			await alert(
				'Camera',
				'Allow access to your camera to start the experience.',
				camera_alt,
				'Continue',
				arrow_forward,
			);
		}

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});

			for (const track of mediaStream.getVideoTracks()) {
				track.stop();
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				switch (err.name) {
					case 'NotAllowedError':
						await alert(
							'Camera',
							'Access to your camera is required for this experience. Please allow it from the prompt, or in the settings on your browser.',
							error,
							'Try again',
							refresh,
						);
						break;
					case 'NotFoundError':
						await alert(
							'Camera',
							"No cameras found. Please ensure you're using a camera-enabled device.",
							error,
							'',
						);
						break;
					case 'NotReadableError':
						await alert(
							'Camera',
							'Failed to start using camera. Please ensure no other apps might using it.',
							error,
							'Try again',
							refresh,
						);
						break;
					default:
						await alert(
							'Camera',
							`Unknown error (${err.name}). You may need to update your browser.`,
							error,
							'Try again',
							refresh,
						);
						break;
				}
			}

			location.reload();
			return;
		}

		// may have a length of 0 if no back facing cameras are installed
		// perhaps webcams or "left"/"right" cameras
		const backCameraInfos = (
			await navigator.mediaDevices.enumerateDevices()
		).filter(
			(info) =>
				info.kind === 'videoinput' &&
				(!('getCapabilities' in info) ||
					(info as any)
						.getCapabilities()
						.facingMode.includes('environment')),
		);

		// find main back camera id
		// as if fov can't be detected, it'll be closest to the default fov
		const mainCameraId = backCameraInfos.find((v) =>
			v.label.includes('0,'),
		)?.deviceId;

		// set camera video feed
		mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				facingMode: 'environment',
				...(mainCameraId ? { deviceId: { exact: mainCameraId } } : {}),
			},
		});
		video.srcObject = mediaStream;

		// attempt to detect fov
		// works on chrome & ff (fuck you safari)
		let fov = 40;
		if ('ImageCapture' in window) {
			const blob = (await new (window as any).ImageCapture(
				mediaStream.getVideoTracks()[0],
			).takePhoto()) as Blob;
			const file = new File([blob], '_.jpg', { type: 'image/jpeg' });
			const {
				FocalLength: focalLength = 0,
				FocalLengthIn35mmFormat: focalLengthIn35mmFormat = 0,
			} =
				(await exifr.parse(file, [
					'FocalLength',
					'FocalLengthIn35mmFormat',
				])) ?? {};

			if (focalLengthIn35mmFormat > 0) {
				fov = radToDeg(
					2 * Math.atan(35 / (2 * focalLengthIn35mmFormat)),
				);
			} else if (focalLength > 0) {
				fov = radToDeg(2 * Math.atan(1.8 / (2 * focalLength)));
			}
		}

		// setup scene
		scene = new Scene();
		camera = new PerspectiveCamera(fov, 1, 0.1, 2000);
		renderer = new Css3dRenderer({ element: rendererDiv });
		root = new Object3D();
		scene.add(root);

		// setup camera to use gyro
		const controls = new DeviceOrientationControls(camera);
		const controlsConnectResult = await controls.connect();

		switch (controlsConnectResult) {
			case DeviceOrientationControlsConnectResults.OK:
				break;
			case DeviceOrientationControlsConnectResults.UNPERMITTED:
				await alert(
					'Gyroscope',
					'Allow access to your gyroscope to start the experience.',
					settings_backup_restore,
					'Continue',
					arrow_forward,
				);

				if (
					await (async () => {
						try {
							return (
								(await (
									window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
										requestPermission(): Promise<
											'granted' | 'denied'
										>;
									}
								).requestPermission()) === 'granted'
							);
						} catch {
							return false;
						}
					})()
				) {
					await controls.connect();
				} else {
					await alert(
						'Gyroscope',
						'Access to your gyroscope is required for this experience. Please allow it from the prompt, or in the settings on your browser.',
						error,
						'Try again',
						refresh,
					);

					location.reload();
					return;
				}

				break;
			case DeviceOrientationControlsConnectResults.UNSUPPORTED:
				await alert(
					'Gyroscope',
					"No gyroscope was found. Please make sure you're using a device that supports orientation changes (eg. a phone or a tablet).",
					error,
					'',
				);
				location.reload();
				return;
			default:
		}

		requestAnimationFrame(function raf() {
			if (hasDestroyed) {
				return;
			}

			controls.update();
			renderer.render(scene, camera);

			requestAnimationFrame(raf);
		});

		dreamContext = {
			controls,
			scene,
			camera,
			renderer,
			root,
		};

		hasInitialised = true;
		isHintShown = true;
		isHintShownHandle = setTimeout(() => {
			isHintShown = false;
		}, 5000);
	});

	onDestroy(() => {
		hasDestroyed = true;

		clearTimeout(isHintShownHandle);

		if (mediaStream) {
			for (const track of mediaStream.getVideoTracks()) {
				track.stop();
			}
		}

		dreamContext?.controls.dispose();
	});

	// responsive THREE canvas
	$: if (hasInitialised) {
		renderer.setSize(containerDivWidth, containerDivHeight);

		camera.aspect = containerDivWidth / containerDivHeight;
		camera.updateProjectionMatrix();

		renderer.render(scene, camera);
	}

	async function alert(
		heading: string,
		text: string,
		svg = info,
		buttonText = 'OK',
		buttonSvg = done,
	) {
		return new Promise<void>((resolve) => {
			alertHeading = heading;
			alertText = text;
			alertSvg = svg;
			alertButtonText = buttonText;
			alertButtonSvg = buttonSvg;
			isEyeOpen = false;
			isAlertShown.set(true);

			const unsubscribe = isAlertShown.subscribe((v) => {
				if (!v) {
					unsubscribe();
					isEyeOpen = true;
					resolve();
				}
			});
		});
	}
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div
	type="DreamRenderer"
	class="component"
	bind:clientHeight={containerDivHeight}
	bind:clientWidth={containerDivWidth}
	style="
		--height-window: {windowHeight}px;
	"
>
	{#if hasInitialised}
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
	{/if}
	<div class="content" class:wobbly-in={hasInitialised}>
		<video
			class:visible={hasInitialised}
			playsinline
			autoplay
			muted
			src=""
			bind:this={video}
		/>
		<div class="renderer" bind:this={rendererDiv}>
			{#if hasInitialised}
				<slot ctx={dreamContext} />
			{/if}
		</div>
		<div class="eyelids" class:closed={!isEyeOpen}>
			<div class="top" />
			<div class="bottom" />
		</div>
		{#if $isAlertShown}
			<div class="alert" in:fade out:fade>
				<SvgButton
					svgHeight="28px"
					svgWidth="28px"
					svg={alertSvg}
					isClickable={false}
				/>
				<h1>{alertHeading}</h1>
				<p>
					{alertText}
				</p>
				{#if alertButtonText.length > 0}
					<Spacer height={56} />
					<SvgButton
						svg={alertButtonSvg}
						on:click={() => {
							isAlertShown.set(false);
						}}>{alertButtonText}</SvgButton
					>
				{/if}
			</div>
		{/if}
	</div>
	{#if isHintShown}
		<div class="hint" in:dropIn out:fade={{ duration: 1000 }}>
			<div class="content">
				<SvgButton
					svgHeight="28px"
					svgWidth="28px"
					svg={swipe}
					padding={0}
					isClickable={false}
				/>
				<h1>Pan by rotating your device.</h1>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.component {
		@apply w-screen
			overflow-hidden;

		height: var(--height-window);

		/* background: #000; */

		touch-action: none;

		& > .filters {
			display: none;
		}

		& > .hint {
			@apply grid
					absolute
					h-full
					w-full
					top-0
					left-0
					pointer-events-none
					place-items-center;

			& > .content {
				@apply flex
						flex-col
						items-center
						text-center
						box-border;

				padding: theme('padding');
			}
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

			/* &.wobbly-out {
				animation-name: wobbly-out;
				animation-duration: 2s;
				animation-timing-function: theme('ease.slowFast');
				animation-fill-mode: both;
			}

			&.wobbly {
				filter: url(#wobbly-filter);
			} */

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

				opacity: 0;
				transition: opacity 0.5s theme('ease.slowFast');

				&.visible {
					opacity: 1;
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

			& > .alert {
				@apply absolute
					box-border
					top-0
					flex
					flex-col
					items-center
					justify-center
					h-full
					w-full;

				z-index: 1;

				padding: theme('padding');

				& p,
				& h1 {
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
