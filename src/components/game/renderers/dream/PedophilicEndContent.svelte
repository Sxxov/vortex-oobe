<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Euler, Object3D, MathUtils } from 'three';
	import { Animator } from '../../../../core/animator';
	import { EasingAdapter } from '../../../../core/animator/adapters/EasingAdapter';
	import { ValueAnimation } from '../../../../core/animator/animations/ValueAnimation';
	import { FrameController } from '../../../../core/animator/controllers/FrameController';
	import type { TUi } from '../../../../core/game/components/ui/TUi';
	import { UiKinds } from '../../../../core/game/components/ui/UiKinds';
	import type { Game } from '../../../../core/game/Game';
	import { NullSprite } from '../../../../core/game/sprite/NullSprite';
	import { fade } from '../../../../core/transitioner';
	import SpriteRenderer from '../SpriteRenderer.svelte';
	import UiRenderer from '../UiRenderer.svelte';
	import type { IDreamContext } from './IDreamContext';
	import { Css3dObject } from './renderer/Css3dObject';
	import charle from '../../../../assets/img/sprites/charle, idle.png';
	import { Sprite } from '../../../../core/game/sprite/Sprite';

	const { degToRad } = MathUtils;

	export let ctx: IDreamContext;
	export let game: Game;

	let uiQueue: TUi[] = [];

	let isGhostStartled = false;
	let isFadingOut = false;

	let ghostDiv: HTMLDivElement;

	let pivotObject: Object3D;
	let spriteObject: Css3dObject;

	let cameraRotation: Euler;
	let cameraRotationUpdateIntervalHandle: ReturnType<typeof setInterval>;

	onMount(() => {
		pivotObject = new Object3D();
		spriteObject = new Css3dObject(ghostDiv);

		spriteObject.position.set(0, 0, -1000);

		pivotObject.add(spriteObject);
		ctx.root.add(pivotObject);

		// put ghost behind camera
		requestAnimationFrame(function initialCameraRotationRaf() {
			if (ctx.camera.rotation.y === 0) {
				requestAnimationFrame(initialCameraRotationRaf);
			} else {
				pivotObject.rotation.y =
					(ctx.camera.rotation.y + Math.PI) % (2 * Math.PI);
				cameraRotationUpdateIntervalHandle = setInterval(() => {
					cameraRotation = ctx.camera.rotation;
				}, 100);
			}
		});
	});

	onDestroy(() => {
		clearInterval(cameraRotationUpdateIntervalHandle);
	});

	$: if (
		cameraRotation &&
		pivotObject &&
		distanceBetweenRads(cameraRotation.y, pivotObject.rotation.y) <
			degToRad(20)
	) {
		isGhostStartled = true;
		clearInterval(cameraRotationUpdateIntervalHandle);
	}

	$: if (isGhostStartled) {
		onGhostStartled();
	}

	$: if (isGhostStartled && uiQueue.length <= 0) {
		const animator = new Animator();

		animator.add(
			EasingAdapter.from(
				ValueAnimation.from({
					fps: 60,
					in: 0,
					out: 120,
					onCreate() {},
					onDestroy() {},
					onStart() {},
					onEnd() {},
					onFrame(v, length) {
						const from = -300;
						const to = 0;
						const diff = from - to;
						const percent = v / length;

						if (percent > 0.8) {
							isFadingOut = true;
						}

						spriteObject.position.z = to + (1 - percent) * diff;
					},
				}),
			).ease(0.64, 0, 0.78, 0),
		);

		const controller = new FrameController(animator);
		void controller.play();
	}

	function distanceBetweenRads(a: number, b: number) {
		return Math.abs(unsignedMod(a - b + Math.PI, Math.PI * 2) - Math.PI);
	}

	function unsignedMod(a: number, n: number) {
		return a - Math.floor(a / n) * n;
	}

	function onGhostStartled() {
		ctx.controls.disconnect();

		ctx.setWobbly(true);

		const animator = new Animator();

		animator.add(
			EasingAdapter.from(
				ValueAnimation.from({
					fps: 60,
					in: 0,
					out: 60,
					onCreate() {},
					onDestroy() {},
					onStart() {},
					onEnd() {},
					onFrame(v, length) {
						const from = -1000;
						const to = -300;
						const diff = from - to;
						const percent = v / length;

						spriteObject.position.z = to + (1 - percent) * diff;
					},
				}),
			).ease(0.64, 0, 0.78, 0),
		);

		const fromCameraRotation = new Euler(
			cameraRotation.x,
			cameraRotation.y,
			cameraRotation.z,
		);
		const toCameraRotation = new Euler(
			pivotObject.rotation.x,
			unsignedMod(pivotObject.rotation.y + Math.PI, Math.PI * 2) -
				Math.PI,
			pivotObject.rotation.z,
		);
		animator.add(
			EasingAdapter.from(
				ValueAnimation.from({
					fps: 60,
					in: 0,
					out: 60,
					onCreate() {},
					onDestroy() {},
					onStart() {},
					onEnd() {},
					onFrame(v, length) {
						const percent = v / length;

						ctx.camera.rotation.set(
							toCameraRotation.x +
								(1 - percent) *
									(fromCameraRotation.x - toCameraRotation.x),
							toCameraRotation.y +
								(1 - percent) *
									(fromCameraRotation.y - toCameraRotation.y),
							toCameraRotation.z +
								(1 - percent) *
									(fromCameraRotation.z - toCameraRotation.z),
						);
					},
				}),
			).ease(0.22, 1, 0.36, 1),
		);

		const controller = new FrameController(animator);
		void controller.play();

		uiQueue = [
			...uiQueue,
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'I’ve always wanted you',
				options: ['...what?'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'Your actions have made me realise that',
				options: ['...actions??'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'I can’t let you go now, after all you’ve done for me',
				options: ['...'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'How great you make me feel',
				options: ['Dr. Charles...'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'Every sentence, word, syllable, murmur',
				options: ['I don’t like th-'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'Action',
				options: ['is...'],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'I need more',
				options: [' '],
				sprite: new NullSprite(),
			},
			{
				kind: UiKinds.ALERT,
				heading: '',
				message: 'Have a taste of what I’ll do for you, now then',
				options: ['...No plea-!'],
				sprite: new NullSprite(),
			},
		];
	}
</script>

<div class="ghost" class:startled={isGhostStartled} bind:this={ghostDiv}>
	<SpriteRenderer
		{game}
		sprite={new Sprite(charle)}
		height="500px"
		width="500px"
	/>
</div>
{#if uiQueue[0]}
	<UiRenderer
		ui={uiQueue[0]}
		{game}
		on:result={() => {
			uiQueue.shift();
			uiQueue = uiQueue;
		}}
	/>
{/if}
{#if isFadingOut}
	<div class="overlay" in:fade />
{/if}

<style lang="postcss">
	.ghost {
		filter: invert(0);

		transition: filter 1s theme('ease.slowSlow');

		&.startled {
			filter: invert(1);
		}
	}

	.overlay {
		@apply absolute
			top-0
			left-0
			h-full
			w-full;

		background: #000;
	}
</style>
