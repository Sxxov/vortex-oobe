<script lang="ts">
	import { CssUtility } from '../../resources/utilities';
	import type { Css } from '../../resources/utilities';
	import { Axis } from './common/enums/Axis';

	export let height: Css = 24;
	export let width: Css = 24;
	export let direction: Axis = Axis.VERTICAL;
</script>

<div
	type="<Spacer>"
	class="component"
	style="
		--height: calc({CssUtility.parse(direction === Axis.VERTICAL ? height : 0)});
		--width: calc({CssUtility.parse(direction === Axis.HORIZONTAL ? width : 0)});
"
/>

<style>
	.component {
		height: var(--height);
		width: var(--width);

		user-select: none;
		pointer-events: none;
	}
</style>
