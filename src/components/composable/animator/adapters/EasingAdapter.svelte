<script lang="ts">
	import type { Animator } from '../../../../core/animator';
	import { EasingAdapter } from '../../../../core/animator/adapters/EasingAdapter';
	import { AdaptedAnimator } from '../../../../core/animator/animators/AdaptedAnimation';

	export let animator: Animator;
	export let easing: Parameters<EasingAdapter['ease']>;

	const adaptedAnimator = new AdaptedAnimator(animator, (animation) =>
		EasingAdapter.from(animation).ease(...easing),
	);
</script>

<slot animator={adaptedAnimator} />
