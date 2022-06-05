<script lang="ts">
	import { CursorComponent } from '../../core/game/components/cursor/CursorComponent';
	import { HighlightComponent } from '../../core/game/components/highlight/HighlightComponent';
	import { HighlightLevels } from '../../core/game/components/highlight/HighlightLevels';
	import { AbstractSpriteComponent } from '../../core/game/components/sprites/AbstractSpriteComponent';
	import { ZindexComponent } from '../../core/game/components/zindex/ZindexComponent';
	import type { AbstractEntity } from '../../core/game/entities/AbstractEntity';
	import type { Game } from '../../core/game/Game';
	import type { TScreenPosition } from '../../core/game/types/TScreenPosition';
	import SpriteRenderer from './SpriteRenderer.svelte';

	export let game: Game;
	export let entity: AbstractEntity;

	const { screenSpace } = game;
	const { boundingBox: screenSpaceBoundingBoxW } = screenSpace;
	const { position: positionW } = entity;
	const spriteComponent = entity.component(AbstractSpriteComponent);
	const zindexComponent = entity.component(ZindexComponent);
	const cursorComponent = entity.component(CursorComponent);
	const highlightComponent = entity.component(HighlightComponent);

	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	const boundingBoxW = spriteComponent?.boundingBox!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	const spriteW = spriteComponent?.sprite!;
	const cursorW = cursorComponent?.cursor;
	const highlightW = highlightComponent?.highlight;

	let gamePosition: TScreenPosition;

	$: {
		$screenSpaceBoundingBoxW;
		gamePosition = screenSpace.positionToGamePosition($positionW);
	}
</script>

{#if spriteComponent}
	<div
		class="entity {entity.constructor.name}"
		class:highlight-none={$highlightW === HighlightLevels.NONE}
		class:highlight-low={$highlightW === HighlightLevels.LOW}
		class:highlight-high={$highlightW === HighlightLevels.HIGH}
		style="
		transform: translate({gamePosition
			.map((v) => `${v}px`)
			.join(', ')});{zindexComponent
			? ` z-index: ${zindexComponent.zindex};`
			: ''}{cursorComponent ? `cursor: ${$cursorW}` : ''}"
	>
		<SpriteRenderer
			{game}
			sprite={$spriteW}
			height={$boundingBoxW.height}
			width={$boundingBoxW.width}
		/>
	</div>
{/if}

<style lang="postcss">
	.entity {
		position: absolute;
	}
</style>
