<script lang="ts">
	import type { Game } from '../../../core/game/Game';
	import type { Sprite } from '../../../core/game/sprite/Sprite';
	import { CssUtility, type Css } from '../../../resources/utilities';

	export let game: Game;
	export let sprite: Sprite;
	export let isResponsive = false;

	const { cellScreenSize: cellScreenSizeW } = game.screenSpace;

	export let height: Css = $cellScreenSizeW[0];
	export let width: Css = $cellScreenSizeW[1];
</script>

<img
	type="SpriteRenderer"
	class:responsive={isResponsive}
	width={CssUtility.parse(width)}
	height={CssUtility.parse(height)}
	style="
		--height: {CssUtility.parse(height)};
		--width: {CssUtility.parse(width)};
	"
	src={sprite.src}
	alt=""
/>

<style lang="postcss">
	img {
		object-fit: contain;

		height: var(--height);
		width: var(--width);

		user-drag: none;
		-webkit-user-drag: none;

		&.responsive {
			width: 100%;
			height: auto;
		}
	}
</style>
