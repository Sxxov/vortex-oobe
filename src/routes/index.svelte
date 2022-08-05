<script lang="ts">
	import SvgButton from '../components/composable/buttons/SvgButton.svelte';
	import Content from '../components/Content.svelte';
	import DreamRenderer from '../components/game/renderers/DreamRenderer.svelte';
	import logo from '../assets/img/logo.svg';
	import { dropIn, fadeOut } from '../core/transitioner';
	import { onDestroy, onMount } from 'svelte';

	let hasMounted = false;

	const isStandalone =
		typeof location !== 'undefined' &&
		new URLSearchParams(location.search).get('standalone') !== null;

	onMount(() => {
		hasMounted = true;
		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', onVisibilityChange);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener(
				'visibilitychange',
				onVisibilityChange,
			);
		}
	});

	function onVisibilityChange() {
		if (
			isStandalone &&
			typeof document !== 'undefined' &&
			document.visibilityState === 'visible'
		) {
			location.reload();
		}
	}
</script>

<div type="/index" class="component">
	<div class="overlay">
		<div class="spinner" out:fadeOut>
			<div class="lds-ring">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>

		<DreamRenderer let:ctx>
			<Content {ctx} />
		</DreamRenderer>

		{#if hasMounted}
			<div class="watermark">
				<div class="content" in:dropIn>
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
		{/if}
	</div>
</div>

<style lang="postcss">
	.overlay {
		@apply absolute
			h-full
			w-full
			top-0
			left-0

			pointer-events-none;

		& > .spinner {
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
				border-color: var(--colour-accent-primary) transparent
					transparent transparent;
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

		& > .watermark {
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
	}
</style>
