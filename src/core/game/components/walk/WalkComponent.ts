import { ValueAnimation } from '../../../animator/animations/ValueAnimation';
import { EntityPool } from '../../grid/EntityPool';
import type { TPosition } from '../../types/TPosition';
import { AbstractComponent } from '../AbstractComponent';
import Astar from 'javascript-astar';
import type { GridNode } from 'javascript-astar';
import { Animator } from '../../../animator';
import { FrameController } from '../../../animator/controllers/FrameController';
import type { AbstractAnimation } from '../../../animator/animations/AbstractAnimation';
import { EasingAdapter } from '../../../animator/adapters/EasingAdapter';
import { ArrayStore } from '../../../blocks/store/stores/ArrayStore';
import type { AbstractEntity } from '../../entities/AbstractEntity';
import { PathFinderEntity } from '../../entities/PathFinderEntity';
import { AbstractSpriteComponent } from '../sprites/AbstractSpriteComponent';
import { NullSprite } from '../../sprite/NullSprite';
import { GameConstants } from '../../GameConstants';

const { astar, Graph } = Astar;

export class WalkComponent extends AbstractComponent {
	public animator = new Animator();
	public controller = new FrameController(this.animator);
	public path = new ArrayStore<GridNode>();

	constructor(entity: AbstractEntity) {
		super(entity);

		// const { animations } = this.animator.composition;
		const prevEntities: AbstractEntity[] = [];
		let rafId: ReturnType<typeof requestAnimationFrame>;
		this.path.subscribeLazy((path) => {
			// no path was found
			if (path.length <= 2) return;

			cancelAnimationFrame(rafId);

			entity.round.entityPool.update((entity) =>
				entity.filter((e) => !prevEntities.includes(e)),
			);

			prevEntities.length = 0;

			rafId = requestAnimationFrame(() => {
				// change the arr to enable a longer path
				// however, with dom rendering & svelte, it's very slow
				for (const node of path.filter(
					(_, i, arr) => !((arr.length - i + 1) % 3),
				)) {
					const pathFinder = new PathFinderEntity(entity.round);

					pathFinder.position.value[0] = node.x;
					pathFinder.position.value[1] = node.y;

					entity.round.entityPool.value.push(pathFinder);
					prevEntities.push(pathFinder);
				}

				entity.round.entityPool.trigger();
			});
		});
		this.path.subscribeLazy(async (path) => {
			// no path was found
			if (path.length <= 2) return;

			const animations: AbstractAnimation[] = [];

			let totalDurationFrames = 0;

			for (let i = 0, l = path.length; i < l; ++i) {
				const currNode = path[i];
				const prevNode = path[i - 1];

				if (!prevNode) continue;

				const relativeX = currNode.x - prevNode.x;
				const relativeY = currNode.y - prevNode.y;
				const distance = Math.sqrt(relativeX ** 2 + relativeY ** 2);
				const currDurationFrames =
					(distance / GameConstants.WALK_CELL_PER_SECOND) *
					GameConstants.WALK_FPS;

				if (currDurationFrames <= 0) continue;

				let startX: number;
				let startY: number;
				let deltaX: number;
				let deltaY: number;

				const animation = EasingAdapter.from(
					ValueAnimation.from({
						fps: GameConstants.WALK_FPS,
						in: totalDurationFrames,
						out: totalDurationFrames + currDurationFrames,
						onCreate() {},
						onDestroy() {},
						onStart() {
							[startX, startY] = entity.position.value;
							deltaX = currNode.x - startX;
							deltaY = currNode.y - startY;
						},
						onEnd() {
							for (const prevEntity of prevEntities) {
								const distance = Math.sqrt(
									Math.abs(
										startX - prevEntity.position.value[0],
									) **
										2 +
										Math.abs(
											startY -
												prevEntity.position.value[1],
										) **
											2,
								);
								if (distance < 2) {
									prevEntity
										.component(AbstractSpriteComponent)
										?.sprite.set(new NullSprite());
								}
							}
						},
						onFrame(frame) {
							// const deltaX =
							// 	currNode.x - entity.position.value[0];
							// const deltaY =
							// 	currNode.y - entity.position.value[1];
							// const remainingFrames = currDurationFrames - frame;

							// if (remainingFrames <= 0) {
							// 	entity.position.value[0] += deltaX;
							// 	entity.position.value[1] += deltaY;
							// 	entity.position.trigger();

							// 	return;
							// }

							// const incrementX = deltaX / remainingFrames;
							// const incrementY = deltaY / remainingFrames;

							// entity.position.value[0] += incrementX;
							// entity.position.value[1] += incrementY;

							if (frame <= 0) {
								const incrementX = deltaX / currDurationFrames;
								const incrementY = deltaY / currDurationFrames;

								entity.position.value[0] += incrementX;
								entity.position.value[1] += incrementY;
							} else {
								entity.position.value[0] =
									startX +
									(frame / currDurationFrames) * deltaX;
								entity.position.value[1] =
									startY +
									(frame / currDurationFrames) * deltaY;
							}

							entity.position.trigger();
						},
					}),
				).ease(1, 1, 1, 1);

				totalDurationFrames += currDurationFrames;

				animations[i - 1] = animation;
			}

			this.animator.composition.animations = animations;

			void this.controller.seek(1, true);
			await this.controller.play();
		});
	}

	public async walk(to: TPosition) {
		const { entity } = this;
		const {
			position: from,
			round: { entityPool },
		} = entity;

		const fromCell = EntityPool.positionToCellIndex(from);
		const toCell = EntityPool.positionToCellIndex(to);
		const astarGrid = entityPool.toAstar();

		const graph = new Graph(astarGrid, { diagonal: true });
		const fromAstarGraphCell = graph.grid[fromCell[0]][fromCell[1]];
		const toAstarGraphCell = graph.grid[toCell[0]][toCell[1]];

		const gridNodes = astar.search(
			graph,
			fromAstarGraphCell,
			toAstarGraphCell,
		);

		this.path.set([
			{
				x: from.value[0],
				y: from.value[1],
			},
			...gridNodes,

			// gridNodes doesn't include the final node if it can't find a path
			// this is normally due to precision errors causing a mismatch between `from` & the target cell
			// adding it regardless here will sometimes produce double of the last node,
			// but the animation logic is smart enough to ignore when no movement is required (eg. two same nodes)
			toAstarGraphCell,
		]);
	}
}
