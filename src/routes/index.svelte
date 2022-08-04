<script lang="ts">
	import SvgButton from '../components/composable/buttons/SvgButton.svelte';
	import Content from '../components/Content.svelte';
	import DreamRenderer from '../components/game/renderers/DreamRenderer.svelte';
	import logo from '../assets/img/logo.svg';
	import { swipe } from '!i/twotone::swipe';
	import { dropIn, dropOut, fadeOut } from '../core/transitioner';
	import { onDestroy, onMount } from 'svelte';

	let hasMounted = false;
	let isHintShown = false;
	let isHintShownHandle: ReturnType<typeof setTimeout>;

	onMount(() => {
		hasMounted = true;
		isHintShown = true;
		isHintShownHandle = setTimeout(() => {
			isHintShown = false;
		}, 3000);
	});

	onDestroy(() => {
		clearTimeout(isHintShownHandle);
	});
</script>

<div type="/index" class="component">
	<DreamRenderer enforceLuminance={false} let:ctx>
		<Content {ctx} />
	</DreamRenderer>
	{#if isHintShown}
		<div class="hint" out:fadeOut={{ duration: 1000 }}>
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
	{#if !hasMounted}
		<div class="spinner" out:dropOut>
			<div class="lds-ring">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{/if}
	<div class="watermark" in:dropIn>
		<div class="content">
			<SvgButton
				svgHeight="56px"
				svgWidth="168px"
				svgColour="#fff"
				svg={logo}
				padding={0}
				isClickable={false}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	.spinner {
		@apply grid
			absolute
			h-full
			w-full
			top-0
			left-0
			pointer-events-none
			place-items-center;

		background: black;

		& > .lds-ring {
			display: inline-block;
			position: relative;
			width: 80px;
			height: 80px;
		}
		& > .lds-ring div {
			box-sizing: border-box;
			display: block;
			position: absolute;
			width: 64px;
			height: 64px;
			margin: 8px;
			border: 1px solid var(--colour-accent-primary);
			border-radius: 50%;
			animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
			border-color: var(--colour-accent-primary) transparent transparent
				transparent;
		}
		& > .lds-ring div:nth-child(1) {
			animation-delay: -0.45s;
		}
		& > .lds-ring div:nth-child(2) {
			animation-delay: -0.3s;
		}
		& > .lds-ring div:nth-child(3) {
			animation-delay: -0.15s;
		}
		@keyframes lds-ring {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}

	.hint {
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

	.watermark {
		@apply absolute
			h-full
			w-full
			top-0
			left-0
			pointer-events-none;

		& > .content {
			@apply absolute
				bottom-0
				right-0
				box-border;

			padding: 12px;
		}
	}
</style>
