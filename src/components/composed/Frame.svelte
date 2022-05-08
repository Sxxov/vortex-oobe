<script lang="ts">
	import { Ctx } from '../../core/ctx';
	import LottieToggleButton from '../composable/buttons/LottieToggleButton.svelte';
	import HamburgerMenu from '../composable/HamburgerMenu.svelte';
	import Logo from './Logo.svelte';

	let isHamburgerActive = false;
</script>

<div type="<Frame>" class="component">
	<div class="hamburger">
		<HamburgerMenu
			toppings={Ctx.toppings}
			bind:isActive={isHamburgerActive}
		/>
	</div>
	<div class="content">
		<div class="logo"><Logo /></div>
		<div class="hamburger">
			<LottieToggleButton
				animationData={import(
					'../../assets/lottie/hamburger/index.json'
				)}
				width={56}
				height={56}
				bind:isActive={isHamburgerActive}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	.content {
		@apply h-full
			w-full
			fixed
			top-0
			left-0
			grid
			z-10
			pointer-events-none;

		grid-template-areas:
			'logo _ hamburger'
			'__ __ __'
			'___ ___ ___';
		grid-template-columns: 56px 1fr auto;
		grid-template-rows: auto 1fr auto;

		padding: theme('padding');

		& * {
			@apply pointer-events-auto;
		}

		& .hamburger {
			grid-area: hamburger;
		}
	}

	.hamburger {
		@apply relative
			z-10;
	}
</style>
