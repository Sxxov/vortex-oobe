<script lang="ts">
	import type { Game } from '../../../core/game/Game';
	import type { Sprite } from '../../../core/game/sprite/Sprite';

	export let game: Game;
	export let sprite: Sprite;
	export let isResponsive = false;

	const { cellScreenSize: cellScreenSizeW } = game.screenSpace;

	export let height: number = $cellScreenSizeW[0];
	export let width: number = $cellScreenSizeW[1];
</script>

<img
	type="SpriteRenderer"
	class:responsive={isResponsive}
	{width}
	{height}
	src={sprite.src}
	alt=""
/>

<style lang="postcss">
	img {
		object-fit: contain;

		user-drag: none;
		-webkit-user-drag: none;

		&.responsive {
			width: 100%;
			height: auto;
		}
	}
</style>
