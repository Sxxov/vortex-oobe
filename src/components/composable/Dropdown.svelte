<script lang="ts">
	import { onMount } from 'svelte';
	import { dropIn, dropOut } from '../../core/transitioner';
	import Input from './Input.svelte';
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { UnexpectedValueError } from '../../resources/errors';
	import SvgButton from './buttons/SvgButton.svelte';
	import { DropdownItem } from './dropdown/DropdownItem';
	import {
		border_clear,
		clear,
		keyboard_arrow_up,
		keyboard_arrow_down,
	} from '!i/twotone::border_clear,clear,keyboard_arrow_up,keyboard_arrow_down';

	export let isActive = false;
	export let items: DropdownItem[] = [];
	export let height: Css = 56;
	export let width: Css = 'auto';
	export let itemsHeight: Css = 192;
	export let label = '...';
	export let selectedItem: DropdownItem | undefined = undefined;
	export let selectedId: string | undefined = undefined;
	export let value = '';
	export let isPending = false;

	const LOADING_ITEM = DropdownItem.from({
		label: true,
		svg: border_clear,
		text: 'Loading, give me a bit...',
		id: '...',
	});
	const NO_ITEMS_ITEM = DropdownItem.from({
		label: true,
		svg: clear,
		text: 'No items found',
		id: '404',
	});

	let currentItems = items;
	let filteredItems = items;
	let input: any;
	// eslint-disable-next-line prefer-const
	let isButtonFocused = false;

	$: if (selectedId != null && selectedItem == null) {
		const selectedItem = items.find((item) => item.id === selectedId);

		if (selectedItem == null) {
			throw new UnexpectedValueError(
				"Attempted to select an item that hasn't been registered",
			);
		}
	}

	$: if (selectedItem != null) {
		onSelect(selectedItem);
	}

	$: buttonProps = {
		svg: isActive ? keyboard_arrow_up : keyboard_arrow_down,
		isFocused: isButtonFocused,
	};

	// when a value is gotten in `items`, set `isPending` to false
	$: items != null && items.length > 0 && isPending && (isPending = false);

	onMount(() => {
		input.onFocus = () => {
			value = '';

			isActive = true;
		};

		input.onBlur = () => {
			scheduleBlur();

			// for when user clicks outside of dropdown
			window.addEventListener('click', function runScheduledBlurOnce() {
				runScheduledBlur();

				window.removeEventListener('click', runScheduledBlurOnce);
			});
		};
	});

	// filter items according to item text
	$: filteredItems = items.filter((item) =>
		item.text.toLowerCase().includes(value.toLowerCase()),
	);

	$: if (filteredItems.length === 0) {
		filteredItems = [isPending ? LOADING_ITEM : NO_ITEMS_ITEM];
	}

	// if `filteredItems` differ from `currentItems`
	$: if (
		filteredItems.length !== currentItems.length ||
		filteredItems.some(
			(filteredItem, i) => currentItems[i] !== filteredItem,
		)
	) {
		currentItems = filteredItems;
	}

	function onSelect(item: DropdownItem | undefined) {
		if (item == null) {
			return;
		}

		isActive = false;
		value = item.text;
		selectedItem = item;
		selectedId = item.id;
	}

	function onSubmit() {
		// if inactive, activate by taking focus
		if (!isActive) {
			input.focus();

			return;
		}

		// run blur if onBlur scheduled one/haven't timed out
		runScheduledBlur();
	}

	let isBlurScheduled = false;

	function scheduleBlur() {
		isBlurScheduled = true;
	}

	function runScheduledBlur() {
		if (!isBlurScheduled) {
			return;
		}

		isActive = false;
		isBlurScheduled = false;

		if (value === '' && selectedItem != null) {
			onSelect(selectedItem);
		}
	}
</script>

<div type="<Dropdown>" class="component">
	<Input
		bind:isActive
		bind:buttonProps
		{label}
		on:submit={onSubmit}
		bind:this={input}
		bind:value
		{width}
		{height}
		isMovingLabel={false}
		{...$$restProps}
	/>
	<div
		class="items"
		style="
			--height: {CssUtility.parse(itemsHeight)};
		"
	>
		{#if isActive}
			<div
				class="content"
				style="
					--pointer-events: {isActive ? 'unset' : 'none'};
				"
			>
				{#each currentItems as item, i}
					<div
						class="item"
						in:dropIn={{ delay: i * 50 }}
						out:dropOut={{
							delay: i * 50,
							// easing: easings.expoOut,
							duration: 100,
						}}
					>
						<SvgButton
							width="100%"
							textAlign="left"
							svg={item.svg}
							backgroundColour={item.backgroundColour}
							hoverBackgroundColour={item.hoverBackgroundColour}
							rippleColour={item.rippleColour}
							textColour={item.textColour}
							on:click={() => {
								onSelect(item);
							}}
							isDisabled={item.label}
						>
							{item.text}
						</SvgButton>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.items {
		height: 0;
		width: 100%;

		transform: matrix(1, 0, 0, 1, 0, 0);

		& .content {
			width: 100%;
			position: absolute;
			height: var(--height);
			overflow: auto;

			display: flex;
			flex-direction: column;

			pointer-events: var(--pointer-events);

			& > * {
				margin-top: 8px;
			}
		}
	}

	.item {
		width: 100%;
	}
</style>
