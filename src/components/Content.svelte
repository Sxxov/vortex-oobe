<script lang="ts">
	import { onMount } from 'svelte';
	import { MathUtils, Object3D } from 'three';
	import type { IDreamContext } from '../components/game/renderers/dream/IDreamContext';
	import { Css3dObject } from '../components/game/renderers/dream/renderer/Css3dObject';
	import vp9 from '../assets/video/vp9.webm';
	import vp8 from '../assets/video/vp8.webm';
	// non-standard file-extension, should be .mov
	// using mp4 to avoid issues with vite
	import hevc from '../assets/video/hevc.mp4';
	import SvgButton from './composable/buttons/SvgButton.svelte';
	import {
		play_arrow,
		pause,
		pending,
	} from '!i/twotone::play_arrow,pause,pending';
	import { fadeIn, fadeOut } from '../core/transitioner';

	const { degToRad } = MathUtils;

	export let ctx: IDreamContext;

	let pivotObject: Object3D;
	let spriteObject: Css3dObject;

	let [prevX, prevY] = [-1, -1];

	let updateKey = {};
	let isBuffering = false;

	let containerDiv: HTMLDivElement;
	let video: HTMLVideoElement;

	onMount(() => {
		// place object
		pivotObject = new Object3D();
		spriteObject = new Css3dObject(containerDiv);

		spriteObject.position.set(500, -100, 0);
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

		void video.play().catch(() => {});
	});

	$: isPlaying =
		// @ts-expect-error yeah, i know, i'm lazy
		(updateKey,
		Boolean(
			video &&
				video.currentTime > 0 &&
				!video.paused &&
				!video.ended &&
				video.readyState > video.HAVE_CURRENT_DATA,
		));

	$: isControlsVisible = !isPlaying;

	function getClientPosition(e: MouseEvent | TouchEvent) {
		let [x, y] = [Infinity, Infinity];

		if (window.MouseEvent && e instanceof MouseEvent && e.buttons > 0) {
			[x, y] = [e.clientX, e.clientY];
		} else if (
			window.TouchEvent &&
			e instanceof TouchEvent &&
			e.touches.length > 0
		) {
			[x, y] = [e.touches[0].clientX, e.touches[0].clientY];
		}

		return [x, y];
	}

	function onDown(e: MouseEvent | TouchEvent) {
		const [x, y] = getClientPosition(e);

		if (!Number.isFinite(x) || !Number.isFinite(y)) {
			return;
		}

		[prevX, prevY] = [x, y];
	}

	function onMove(e: MouseEvent | TouchEvent) {
		const [x, y] = getClientPosition(e);

		if (!Number.isFinite(x) || !Number.isFinite(y)) {
			return;
		}

		const [deltaX, deltaY] = [
			-degToRad((x - prevX) / 8),
			-degToRad((y - prevY) / 8),
		];

		pivotObject.rotation.y += deltaX;
		pivotObject.rotation.z += deltaY;

		[prevX, prevY] = [x, y];
	}

	function togglePlay() {
		if (isPlaying) {
			video.pause();
		} else {
			void video.play();
		}
	}

	function update() {
		updateKey = {};
	}
</script>

<svelte:window
	on:mousedown={onDown}
	on:mousemove={onMove}
	on:touchstart={onDown}
	on:touchmove={onMove}
/>

<div bind:this={containerDiv}>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		bind:this={video}
		width="1080"
		preload="auto"
		playsinline
		autoplay
		on:ended={update}
		on:play={update}
		on:pause={update}
		on:seeked={update}
		on:timeupdate={update}
		on:playing={() => {
			isBuffering = false;
		}}
		on:waiting={() => {
			isBuffering = true;
		}}
	>
		<source src={vp9} type={'video/webm; codecs="vp9"'} />
		<source src={vp8} type={'video/webm; codecs="vp8"'} />
		<source src={hevc} type={'video/quicktime'} />
	</video>
	<div class="controls" on:click={togglePlay}>
		{#if isControlsVisible}
			<div class="content" in:fadeIn out:fadeOut>
				<SvgButton
					svg={isBuffering ? pending : isPlaying ? pause : play_arrow}
					roundness={56}
					svgWidth="28px"
					svgHeight="28px"
					padding={0}
					width={112}
					height={112}
				/>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	video {
		max-width: unset;
	}

	.controls {
		@apply grid
			absolute
			top-0
			left-0
			h-full
			w-full
			place-items-center;
	}
</style>
