<script lang="ts" context="module">
	const enum Particulars {
		NAME = 'Welcome to Vortex XR Lab',
		DESCRIPTION = '',
		KEYWORDS = '',
		AUTHOR = '',
	}
</script>

<script lang="ts">
	import '../global.pcss';
	import { onMount } from 'svelte';
	import android192 from '../assets/favi/android-icon-192x192.png?png';
	import apple180 from '../assets/favi/apple-icon-180x180.png?png';
	import favicon16 from '../assets/favi/favicon-16x16.png?png';
	import favicon32 from '../assets/favi/favicon-32x32.png?png';
	import manifest from '../assets/favi/manifest.json';
	import Toast from '../components/composable/Toast.svelte';
	import { Ctx } from '../core/ctx';
	import { Tailwinder } from '../core/tailwinder/Tailwinder';

	const toastsW = Ctx.toasts;
	$: toasts = $toastsW;

	onMount(() => {
		window.addEventListener('sveltekit:start', () => {
			const theme = 'dark';

			document.documentElement.classList.add(theme);

			Tailwinder.injectThemeAsCssVariables();
		});
	});
</script>

<svelte:head>
	<title>{Particulars.NAME}</title>
	<meta charset="utf-8" />

	<!-- Icon Tags -->
	<link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
	<link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
	<link rel="apple-touch-icon" sizes="180x180" href={apple180} />
	<link rel="icon" type="image/png" sizes="192x192" href={android192} />
	<link
		rel="manifest"
		href="data:application/manifest+json,{JSON.stringify(manifest)}"
	/>

	<!-- Viewport Tag to prevent jank -->
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
	/>

	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<!-- possible content values: default, black or black-translucent -->
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	/>

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
		background: black;
	}
</style>
