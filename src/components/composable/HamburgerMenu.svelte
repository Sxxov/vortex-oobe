<script lang="ts">
	import { onMount } from 'svelte';

	import { CssUtility } from '../../resources/utilities';
	import EasingAdapter from '../composable/animator/adapters/EasingAdapter.svelte';
	import ValueAnimation from '../composable/animator/animations/ValueAnimation.svelte';
	import FrameAnimator from '../composable/animator/animators/FrameAnimator.svelte';
	import Button from '../composable/Button.svelte';
	import type { ToppingItem } from './hamburger/ToppingItem';

	export let prefix = '';
	export let suffix = '';
	export let toppings: ToppingItem[] = [];
	export let width = 200;
	export let isActive = false;
	export let currentPageIndex = -1;

	let chosenButton = -1;
	$: isActive && (chosenButton = -1);

	onMount(() => {
		document.addEventListener('keyup', onKeyUp);

		return () => {
			document.removeEventListener('keyup', onKeyUp);
		};
	});

	function onKeyUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isActive = false;
		}
	}
</script>

{#if (toppings?.length ?? 0) > 0}
	<div
		type="<HamburgerMenu>"
		class="component"
		class:active={isActive}
		style="
			--duration: 0.5s;
		"
	>
		<div class="overlay left" />
		<div class="overlay top" />
		<div class="overlay right" />
		<div class="overlay bottom" />
		<container
			class="toppings"
			style="
				--grid-template-rows: auto repeat({toppings.length}, min-content) auto;
			"
		>
			{#each toppings as { name, action }, i}
				<FrameAnimator let:animator let:play>
					<div
						class="topping"
						class:chosen={chosenButton === i}
						style="
							--grid-row: {i + 2} / {i + 3};
						"
					>
						<Button
							isSlotHooksEnabled={true}
							isText={false}
							backgroundColour={i === currentPageIndex
								? '--colour-text-primary'
								: '--colour-background-secondary'}
							hoverBackgroundColour={i === chosenButton
								? 'transparent'
								: '--colour-text-primary'}
							rippleColour="--colour-text-primary"
							roundness="--border-radius"
							padding={isActive
								? '16px var(--roundness)'
								: '16px 0'}
							transition={`
								all 0.2s var(--ease-slow-slow),
								${
									i === chosenButton
										? 'background-color 0.3s var(--ease-fast-slow)'
										: 'background-color 0s'
								},
								${
									isActive
										? `padding 0.5s 0.${i}s var(--ease-fast-slow),
									width 0.5s 0.${i}s var(--ease-fast-slow),
									border 0s 0.${i}s`
										: `padding 0.5s 0.${i}s var(--ease-slow-fast),
									width 0.5s 0.${i}s var(--ease-slow-fast),
									border 0s 0.${i + 5}s`
								}
							`}
							overflow="hidden"
							width={isActive
								? `min(${CssUtility.parse(width)}, 100vw)`
								: '0px'}
							height="100%"
							on:click={() => {
								isActive = false;
								chosenButton = i;
								action();
							}}
							on:mouseover={() => {
								play(1);
							}}
							on:focus={() => {
								play(1);
							}}
							on:mouseout={() => {
								play(-1);
							}}
							on:blur={() => {
								play(-1);
							}}
							let:isHovered
						>
							<b
								><p
									class="heading"
									style="
									--colour-text: {(i === currentPageIndex || isHovered) && i !== chosenButton
										? 'var(--colour-background-primary)'
										: 'var(--colour-text-primary)'}
								"
								>
									{#if prefix}
										<span class="prefix">
											{prefix}
										</span>
									{/if}
									{#each name
										.replace(/ /g, '\xa0')
										.split('') as char, ii}
										<EasingAdapter
											{animator}
											easing={[0.83, 0, 0.17, 1]}
											let:animator
										>
											<ValueAnimation
												{animator}
												inFrame={ii * 2}
												length={30}
												let:value
											>
												<span
													style="
													transform: translateY({ii % 2 ? '' : '-'}{value / 2}px);
												"
												>
													{char}
												</span>
											</ValueAnimation>
										</EasingAdapter>
									{/each}
									<!-- {value} -->
									{#if suffix}
										<span class="suffix">
											{suffix}
										</span>
									{/if}
								</p></b
							>
						</Button>
					</div>
				</FrameAnimator>
			{/each}
		</container>
	</div>
{/if}

<style lang="postcss">
	.overlay {
		@apply h-screen
			w-screen
			fixed;

		background: var(--colour-background-primary);

		clip-path: inset(100% 100% 100% 100%);

		&.left {
			top: 0;
			left: 0;

			clip-path: inset(0 100% 0 0);
			transition: clip-path 0.8s var(--ease-slow-slow);

			.active > & {
				clip-path: inset(0 50% 0 0);
			}
		}

		&.top {
			top: 0;
			left: 0;

			clip-path: inset(0 0 100% 0);
			transition: clip-path 0.3s var(--ease-fast-slow);

			.active > & {
				clip-path: inset(0 0 50.05% 0);
			}
		}

		&.right {
			top: 0;
			right: 0;

			clip-path: inset(0 0 0 100%);
			transition: clip-path 0.8s var(--ease-slow-slow);

			.active > & {
				clip-path: inset(0 0 0 50%);
			}
		}

		&.bottom {
			bottom: 0;
			left: 0;

			clip-path: inset(100% 0 0 0);
			transition: clip-path 0.3s var(--ease-fast-slow);

			.active > & {
				clip-path: inset(50.05% 0 0 0);
			}
		}
	}

	.toppings {
		height: 100%;
		width: 100%;

		position: fixed;
		top: 0;
		left: 0;

		display: grid;

		grid-template-rows: var(--grid-template-rows);
		align-items: center;
		justify-items: center;

		row-gap: 32px;

		z-index: 1;

		pointer-events: none;
	}

	.topping {
		width: fit-content;
		height: 56px;
		grid-row: var(--grid-row);

		transition: width 0.5s var(--ease-slow-slow),
			height 0.5s var(--ease-fast-slow);

		pointer-events: auto;

		&:hover,
		&:active,
		&.chosen {
			height: 112px;
		}

		& .heading {
			/* display: flex ignores the whitespace around <span>'s that svelte generates */
			display: flex;
			white-space: nowrap;
			color: var(--colour-text);

			font-size: 1rem;
		}

		& span {
			display: inline-block;
		}
	}
</style>
