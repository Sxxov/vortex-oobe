<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { Level, LevelColour } from './common/enums/Level';
	import {
		error_outline,
		warning,
		error,
		done,
	} from '!i/twotone::error_outline,warning,error,done';

	export let level: Level = Level.INFO;
	export let overrideColour: Css | undefined = undefined;

	const LevelIconSvg = [error_outline, warning, error, done, ''] as const;
</script>

<div type="<Hint>" class="component">
	<span
		class:info={level === Level.INFO}
		class:warn={level === Level.WARN}
		class:error={level === Level.ERROR}
		class:ok={level === Level.OK}
		class:none={level === Level.NONE}
		class="content"
		style="
			--colour-hint: {CssUtility.parse(overrideColour ?? LevelColour[level] ?? '')}
		"
	>
		{#if LevelIconSvg[level] != null}
			{@html LevelIconSvg[level]}
		{/if}
		<p class="text">
			<slot>Hint</slot>
		</p>
	</span>
</div>

<style>
	.content.none {
		opacity: 0;
		height: 0;
	}

	.content {
		display: flex;
		align-items: center;

		gap: 12px;

		overflow: hidden;

		/* height for '.none' */
		opacity: 1;
		height: calc(1rem + 2em);
	}

	.content * {
		color: var(--colour-hint);
	}

	.content,
	.content * {
		transition: 0.2s var(--ease-slow-slow);
	}

	p {
		font-size: 1rem;
		line-height: 1;
	}
</style>
