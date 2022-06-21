<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TUi } from '../../core/game/components/ui/TUi';
	import { UiKinds } from '../../core/game/components/ui/UiKinds';
	import type { Game } from '../../core/game/Game';
	import SvgButton from '../composable/buttons/SvgButton.svelte';
	import Input from '../composable/Input.svelte';
	import SpriteRenderer from './SpriteRenderer.svelte';
	import { done, close } from '!i/twotone::done,close';
	import { dropIn, dropOut } from '../../core/transitioner';

	const dispatch = createEventDispatcher();
	export let game: Game;
	export let ui: TUi;

	let value = '';

	function onClick(option: TUi['options'][number]) {
		if (ui.kind === UiKinds.ALERT) {
			ui.result = undefined;
		} else if (ui.kind === UiKinds.CONFIRM) {
			ui.result = option === ui.options[0];
		} else if (ui.kind === UiKinds.PROMPT) {
			ui.result = value;
		}

		dispatch('result', ui.result);
	}
</script>

<div type="UiRenderer" class="component" in:dropIn out:dropOut>
	<div class="overlay" />
	<div class="sprite">
		<SpriteRenderer sprite={ui.sprite} {game} isResponsive />
	</div>
	<div class="dialog">
		<div class="heading">
			<h6>{ui.heading}</h6>
		</div>
		<div class="content">
			<div class="message">
				<p>{ui.message}</p>
			</div>
			<div class="buttons">
				{#if ui.kind === UiKinds.PROMPT}
					<Input isMovingLabel={false} label="..." bind:value>
						<SvgButton
							isDisabled={value.trim().length <= 0}
							slot="button"
							svg={done}
							on:click={onClick.bind(undefined, ui.options[0])}
							>{ui.options[0]}</SvgButton
						>
					</Input>
				{/if}
				{#if ui.kind === UiKinds.CONFIRM}
					<SvgButton
						width="100%"
						textColour="--colour-text-secondary"
						hoverTextColour="--colour-text-secondary"
						svgColour="--colour-text-secondary"
						hoverSvgColour="--colour-text-secondary"
						backgroundColour="--colour-background-secondary"
						hoverBackgroundColour="--colour-background-primary"
						slot="button"
						svg={close}
						on:click={onClick.bind(undefined, ui.options[1])}
						>{ui.options[1]}</SvgButton
					>
					<SvgButton
						width="100%"
						slot="button"
						svg={done}
						on:click={onClick.bind(undefined, ui.options[0])}
						>{ui.options[0]}</SvgButton
					>
				{/if}
				{#if ui.kind === UiKinds.ALERT}
					<SvgButton
						width="100%"
						slot="button"
						svg={done}
						on:click={onClick.bind(undefined, ui.options[0])}
						>{ui.options[0]}</SvgButton
					>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.component {
		@apply absolute
			grid
			top-0 
			left-0
			h-full
			w-full
			z-50;

		grid-template-rows: auto 33% min-content;
		grid-template-areas:
			'_'
			'sprite'
			'dialog';

		& > .overlay {
			@apply absolute
				top-0
				left-0
				h-full
				w-full;

			background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0) 0%,
				var(--colour-text-primary) 50%
			);
			opacity: 0.2;
		}

		& > .sprite {
			@apply relative
				h-full
				w-1/2
				justify-self-start
				self-center;

			grid-area: sprite;
		}

		& > .dialog {
			@apply relative
				bottom-0
				w-full;

			grid-area: dialog;

			& > .heading {
				@apply w-fit;

				padding: 1rem;

				& > h6 {
					margin-bottom: 0;
				}

				background: var(--colour-background-secondary);
			}

			& > .content {
				@apply shadow-2xl
					grid;

				background: var(--colour-background-primary);

				& > .message {
					padding: theme('padding');
				}

				& > .buttons {
					@apply flex;
				}
			}
		}
	}
</style>
