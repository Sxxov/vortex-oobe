<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import Hint from './Hint.svelte';
	import { dropIn, dropOut } from '../../core/transitioner';
	import SvgButton from './buttons/SvgButton.svelte';
	import Spacer from './Spacer.svelte';
	import { LevelColour } from './common/enums/Level';
	import type { ToastItem } from './toast/ToastItem';
	import { clear } from '!i/twotone::clear';

	export let toasts: ToastItem[] = [];

	const scheduledUids: string[] = [];

	if (toasts == null) {
		toasts = [];
	}

	$: toasts.forEach((toast) => {
		scheduleDismiss(toast.uid!, toast.duration!);
	});

	function dismiss(uid: string) {
		toasts.splice(
			toasts.findIndex((toast) => toast.uid === uid),
			1,
		);
		toasts = toasts;
	}

	function scheduleDismiss(uid: string, duration: number) {
		if (scheduledUids.includes(uid)) {
			return;
		}

		if (duration < 0) {
			return;
		}

		setTimeout(() => {
			dismiss(uid);
		}, duration);

		scheduledUids.push(uid);
	}
</script>

{#if toasts.length > 0}
	<div type="<Toast>" class="component">
		{#each toasts as toast}
			<Spacer height={8} />
			<div
				class="content"
				style="
					--colour-toast: {CssUtility.parse(
					LevelColour[
						// @ts-expect-error !!!!
						toast.level
					],
				)}
				"
				in:dropIn
				out:dropOut
			>
				<Hint
					level={toast.level}
					overrideColour="--colour-background-primary"
				>
					{toast.text}
				</Hint>
				<SvgButton
					svg={clear}
					backgroundColour="transparent"
					svgColour="--colour-background-primary"
					hoverBackgroundColour="#fff2"
					padding="4px 8px"
					height={32}
					on:click={() => {
						dismiss(String(toast.uid));
					}}
				/>
			</div>
		{/each}
	</div>
{/if}

<style>
	.component {
		position: fixed;

		right: 0;
		bottom: 0;

		margin: var(--padding);

		z-index: 1000;
	}

	.content {
		background: var(--colour-toast);

		padding: 4px 8px 4px 16px;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		border-radius: var(--roundness);

		width: max-content;
		max-width: 25vw;
		max-width: min(400px, calc(61vw));

		/* margin-top: var(--padding); */
	}
</style>
