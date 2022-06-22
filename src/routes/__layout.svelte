<script lang="ts" context="module">
	const enum Particulars {
		NAME = 'anti game-studies game-studies game™',
		DESCRIPTION = '',
		KEYWORDS = '',
		AUTHOR = '',
	}
</script>

<script lang="ts">
	import '../global.pcss';
	import { onMount } from 'svelte';
	import Toast from '../components/composable/Toast.svelte';
	import { Ctx } from '../core/ctx';
	import 'kursor/dist/kursor.css';
	import { Tailwinder } from '../core/tailwinder/Tailwinder';
	import favicon32 from '!p::../assets/favi/favicon-32x32.png?png';
	import favicon16 from '!p::../assets/favi/favicon-16x16.png?png';

	const toastsW = Ctx.toasts;
	$: toasts = $toastsW;

	onMount(() => {
		window.addEventListener('sveltekit:start', async () => {
			const theme =
				localStorage.getItem('theme') ??
				(window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light');

			document.documentElement.classList.add(theme);

			Tailwinder.injectThemeAsCssVariables();

			const { default: SmoothScroll } = await import(
				'smoothscroll-for-websites'
			);
			const { default: Kursor } = await import('kursor');

			// eslint-disable-next-line new-cap
			SmoothScroll({
				animationTime: 500,
				touchpadSupport: false,
				pulseScale: 6,
			});

			// eslint-disable-next-line no-new
			new Kursor({
				removeDefaultCursor: false,
				color: '#fff',
			});
		});
	});
</script>

<svelte:head>
	<title>{Particulars.NAME}</title>
	<meta charset="utf-8" />

	<!-- Icon Tags -->
	<link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
	<link rel="icon" type="image/png" sizes="16x16" href={favicon16} />

	<!-- Viewport Tag to prevent jank -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Primary Meta Tags -->
	<meta name="title" content={Particulars.NAME} />
	<meta name="description" content={Particulars.DESCRIPTION} />
	<meta name="keywords" content={Particulars.KEYWORDS} />
	<meta name="author" content="@{Particulars.AUTHOR}" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://metatags.io/" />
	<meta property="og:title" content={Particulars.NAME} />
	<meta property="og:description" content={Particulars.DESCRIPTION} />
	<meta property="og:image" content="/screenshot.png" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://metatags.io/" />
	<meta property="twitter:title" content={Particulars.NAME} />
	<meta property="twitter:description" content={Particulars.DESCRIPTION} />
	<meta property="twitter:image" content="/screenshot.png" />
</svelte:head>

<main>
	<slot />
	<Toast {toasts} />
	<!-- <Frame /> -->
</main>

<style lang="postcss">
	:global(body) {
		overscroll-behavior-y: contain;
	}

	main {
		background: #451973;
	}
</style>
