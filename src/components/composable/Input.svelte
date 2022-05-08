<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import type { SvelteComponent } from 'svelte';
	import { RandomUtility, CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import Hint from './Hint.svelte';
	import type { Level } from './common/enums/Level';
	import SvgButton from './buttons/SvgButton.svelte';

	// @export
	export let value = '';
	export let isActive = false;
	export function focus(): void {
		inputDomContent.focus();
	}

	function submit(): void {
		dispatch('submit', value);
	}

	export function blur(): void {
		inputDomContent.blur();
	}

	const onFocus = (): void => {
		isActive = true;
	};

	const onBlur = (): void => {
		isActive = false;
	};

	export let label = 'Input';
	export let name = label;
	export let buttonComponent: typeof SvelteComponent | null = SvgButton;
	export let buttonProps: Record<string, any> = { isActive: false };
	export let hintLevel: Level = 0;
	export let hint = '';
	export let height: Css = 56;
	export let width: Css = '100%';
	export let buttonWidth: Css = height;
	export let fontSize: Css = '1rem';
	export let labelFontSize: Css = '1rem';
	export let labelTop: Css = 28;
	export let minIndent: Css = 16;
	export let indent: Css = 'max(var(--min-indent), var(--roundness))';
	export let backgroundColour: Css = '--colour-background-secondary';
	export let activeBackgroundColour: Css = '--colour-background-primary';
	export let textColour: Css = '--colour-text-primary';
	export let labelColour: Css = '#fff8';
	export let floatingLabelIndent: Css = '0';
	export let placeholder: string | undefined = undefined;
	export let fontFamily: Css = '--font-family-sans-0';
	export let isMovingLabel = true;
	export let button:
		| Svelte2TsxComponent<any, any, any>
		| typeof buttonComponent
		| HTMLButtonElement
		| undefined = undefined;
	export let formId: string | undefined = undefined;
	export let isMultiLine = false;

	const dispatch = createEventDispatcher();

	const randomFormId = RandomUtility.string();
	const randomInputId = RandomUtility.string();
	let inputDomContent: HTMLInputElement | HTMLTextAreaElement;
	let mutationObserver: MutationObserver;
	let clientHeight: number;

	onMount(() => {
		clientHeight = CssUtility.unparse(
			CssUtility.parse(height),
			inputDomContent,
		);

		if (isMultiLine) {
			mutationObserver = new MutationObserver((entries) => {
				const [{ attributeName }] = entries;

				if (attributeName === 'style') {
					clientHeight = inputDomContent.clientHeight;
				}
			});

			mutationObserver.observe(inputDomContent, {
				attributes: true,
			});
		}
	});

	onDestroy(() => {
		mutationObserver?.disconnect();
	});
</script>

<div
	type="<Input>"
	class="component"
	style="
		--width: {CssUtility.parse(width)};
		--height: {CssUtility.parse(clientHeight ?? height)};
		--font-size: {CssUtility.parse(fontSize)};
		--label-top: {CssUtility.parse(labelTop)};
		--min-indent: {CssUtility.parse(minIndent)};
		--indent: {CssUtility.parse(indent)};
		--button-width: {CssUtility.parse(buttonWidth)};
		--font-family: {CssUtility.parse(fontFamily)};
	"
>
	<form
		class:inactive={!isActive}
		class:valued={value.length > 0}
		on:submit|preventDefault={() => false}
		id={formId ? '' : randomFormId}
		style="
			--colour-background-active: {CssUtility.parse(activeBackgroundColour)};
			--colour-background: {CssUtility.parse(backgroundColour)};
			--form-valued-margin-top: {isMovingLabel ? 'var(--label-top)' : '0'};
		"
	>
		{#if isMultiLine}
			<div class="grabber" />
			<textarea
				type="text"
				form={formId ?? randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				bind:value
				bind:clientHeight
				bind:this={inputDomContent}
				on:input
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {CssUtility.parse(textColour)};
				"
				{...$$restProps}
			/>
		{:else}
			<input
				type="text"
				form={formId ?? randomFormId}
				id={randomInputId}
				class="text"
				{name}
				placeholder={placeholder ?? label}
				bind:value
				bind:this={inputDomContent}
				on:input
				on:focus={onFocus}
				on:blur={onBlur}
				style="
					--colour-text: {CssUtility.parse(textColour)};
				"
				{...$$restProps}
			/>
		{/if}
		<label
			for={randomInputId}
			style="
				--colour-label: {CssUtility.parse(labelColour)};
				--floating-label-indent: {CssUtility.parse(floatingLabelIndent)};
				--label-font-size: {CssUtility.parse(labelFontSize)};
				--label-focused-top: {isMovingLabel
				? 'calc(0px - var(--label-top))'
				: 'calc((var(--height) - var(--font-size)) / 2)'};
				--label-focused-opacity: {isMovingLabel ? 1 : 0.2};
				--label-focused-opacity-no-placeholder: {isMovingLabel ? 1 : 0};
				--label-focused-indent: {isMovingLabel
				? 'var(--floating-label-indent)'
				: 'var(--indent)'};
				--label-transition-duration: {isMovingLabel ? '0.2s' : '0.1s'};
			"
		>
			<p>
				{label}
			</p>
		</label>
		<slot name="button" {submit}>
			{#if buttonComponent}
				<div class="button">
					<svelte:component
						this={buttonComponent}
						height={clientHeight}
						width={clientHeight}
						padding="16px"
						on:click={submit}
						bind:this={button}
						bind:isActive={buttonProps.isActive}
						{...buttonProps}
					/>
				</div>
			{:else}
				<button
					style="display: none"
					on:click={submit}
					bind:this={button}
				/>
			{/if}
		</slot>
	</form>
	{#if hint}
		<Hint level={hintLevel}>{hint}</Hint>
	{/if}
</div>

<style lang="postcss">
	.component {
		@apply relative;

		/*
		 * don't collapse margins
		 * https://stackoverflow.com/a/1939980/
		 */
		padding-top: 1px;
		margin-top: -1px;

		width: var(--width);
	}

	form {
		@apply flex
			m-0;

		transform: matrix(1, 0, 0, 1, 0, 0);

		transition: 0.2s var(--ease-slow-slow);

		border-radius: theme('roundness');

		& input.text {
			@apply shadow-none;

			background: var(--colour-background);
			box-shadow: var(--shadow-inactive);

			/* Chrome, Safari, Edge, Opera */
			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}

			/* Firefox */
			&[type='number'] {
				-moz-appearance: textfield;
			}
		}

		& .button {
			width: var(--button-width);
		}

		&:not(.inactive) {
			margin-top: var(--form-valued-margin-top);

			& input.text {
				@apply shadow-xl;

				background: var(--colour-background-active);
			}
		}

		&.valued {
			margin-top: var(--form-valued-margin-top);
		}

		& input.text,
		& textarea.text {
			@apply w-full;

			height: var(--height);

			padding: 0;
			border: 0;
			outline: 0;

			background: var(--colour-background);

			font-family: var(--font-family);

			padding: 0 var(--indent);

			font-size: var(--font-size);
			line-height: 0.9em;
			color: var(--colour-text);

			user-select: text;

			transition: 0.2s var(--ease-slow-slow);

			&::placeholder {
				color: transparent;
			}

			/* reset input */
			&:required,
			&:invalid {
				box-shadow: none;
			}
		}

		& textarea.text {
			padding-top: var(--min-indent);
			padding-bottom: var(--min-indent);
			padding-top: var(--indent);
			padding-bottom: var(--indent);

			resize: vertical;

			box-sizing: border-box;
		}

		& label {
			position: absolute;
			display: block;

			font-size: var(--font-size);
			line-height: var(--font-size);

			/* for browsers that doesn't support the default value with 'max()' */
			text-indent: var(--min-indent);
			text-indent: var(--indent);

			cursor: text;
			top: calc((var(--height) - var(--font-size)) / 2);

			transition: top var(--label-transition-duration)
					var(--ease-slow-slow),
				opacity var(--label-transition-duration) var(--ease-slow-slow),
				text-indent var(--label-transition-duration)
					var(--ease-slow-slow);

			& > p {
				font-family: var(--font-family);
				font-size: var(--label-font-size);
				color: var(--colour-label);
				display: inline;
			}
		}

		& input.text:focus ~ label,
		& input.text:not(:placeholder-shown) ~ label,
		& textarea.text:focus ~ label,
		& textarea.text:not(:placeholder-shown) ~ label {
			top: var(--label-focused-top);
			opacity: var(--label-focused-opacity-no-placeholder);
			text-indent: var(--label-focused-indent);

			& > p {
				font-size: var(--label-font-size);
				color: var(--colour-accent-primary);
			}
		}

		& input.text:focus:placeholder-shown ~ label,
		& textarea.text:focus:placeholder-shown ~ label {
			opacity: var(--label-focused-opacity);
		}
	}
</style>
