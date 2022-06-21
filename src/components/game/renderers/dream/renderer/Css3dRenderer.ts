import {
	Matrix4,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3,
	WebGLRenderer,
} from 'three';
import { Css3dObject } from './Css3dObject';
import { Css3dSprite } from './Css3dSprite';

/**
 * Based on
 * http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 */

export class Css3dRenderer {
	private static position = new Vector3();
	private static quaternion = new Quaternion();
	private static scale = new Vector3();

	private static matrix = new Matrix4();
	private static matrix2 = new Matrix4();

	private width = 0;
	private height = 0;
	private widthHalf = 0;
	private heightHalf = 0;

	private cache = {
		camera: { fov: 0, style: '' },
		objects: new WeakMap<Css3dObject, { style: string }>(),
	};

	public domElement: HTMLElement;
	public cameraElement: HTMLDivElement;

	constructor({ element }: { element?: HTMLElement } = {}) {
		this.domElement = element ?? document.createElement('div');
		this.domElement.style.overflow = 'hidden';

		this.cameraElement = document.createElement('div');
		this.cameraElement.style.transformStyle = 'preserve-3d';
		this.cameraElement.style.pointerEvents = 'none';

		this.domElement.appendChild(this.cameraElement);
	}

	public getSize() {
		return {
			width: this.width,
			height: this.height,
		};
	}

	render(
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
	) {
		const fov = camera.projectionMatrix.elements[5] * this.heightHalf;

		if (this.cache.camera.fov !== fov) {
			this.domElement.style.perspective =
				camera instanceof PerspectiveCamera ? `${fov}px` : '';
			this.cache.camera.fov = fov;
		}

		if (scene.autoUpdate) scene.updateMatrixWorld();
		if (camera.parent === null) camera.updateMatrixWorld();

		const cameraCssMatrix =
			camera instanceof OrthographicCamera
				? `scale(${fov}) translate(${this.epsilon(
						-(camera.right + camera.left) / 2,
				  )}px, ${this.epsilon(
						(camera.top + camera.bottom) / 2,
				  )}px) ${this.getCameraCssMatrix(camera.matrixWorldInverse)}`
				: `translateZ(${fov}px) ${this.getCameraCssMatrix(
						camera.matrixWorldInverse,
				  )}`;

		const style = `${cameraCssMatrix} translate(${this.widthHalf}px, ${this.heightHalf}px)`;

		if (this.cache.camera.style !== style) {
			this.cameraElement.style.transform = style;
			this.cache.camera.style = style;
		}

		this.renderObject(scene, scene, camera, cameraCssMatrix);
	}

	public setSize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.widthHalf = width / 2;
		this.heightHalf = height / 2;

		this.domElement.style.width = `${width}px`;
		this.domElement.style.height = `${height}px`;

		this.cameraElement.style.width = `${width}px`;
		this.cameraElement.style.height = `${height}px`;
	}

	public epsilon(value: number) {
		return Math.abs(value) < 1e-10 ? 0 : value;
	}

	private getCameraCssMatrix(matrix: THREE.Matrix4) {
		const { elements } = matrix;

		return `matrix3d(${this.epsilon(elements[0])}, ${this.epsilon(
			-elements[1],
		)}, ${this.epsilon(elements[2])}, ${this.epsilon(
			elements[3],
		)}, ${this.epsilon(elements[4])}, ${this.epsilon(
			-elements[5],
		)}, ${this.epsilon(elements[6])}, ${this.epsilon(
			elements[7],
		)}, ${this.epsilon(elements[8])}, ${this.epsilon(
			-elements[9],
		)}, ${this.epsilon(elements[10])}, ${this.epsilon(
			elements[11],
		)}, ${this.epsilon(elements[12])}, ${this.epsilon(
			-elements[13],
		)}, ${this.epsilon(elements[14])}, ${this.epsilon(elements[15])})`;
	}

	private getObjectCssMatrix(matrix: THREE.Matrix4) {
		const { elements } = matrix;

		return `translate(-50%,-50%) matrix3d(${this.epsilon(
			elements[0],
		)}, ${this.epsilon(elements[1])}, ${this.epsilon(
			elements[2],
		)}, ${this.epsilon(elements[3])}, ${this.epsilon(
			-elements[4],
		)}, ${this.epsilon(-elements[5])}, ${this.epsilon(
			-elements[6],
		)}, ${this.epsilon(-elements[7])}, ${this.epsilon(
			elements[8],
		)}, ${this.epsilon(elements[9])}, ${this.epsilon(
			elements[10],
		)}, ${this.epsilon(elements[11])}, ${this.epsilon(
			elements[12],
		)}, ${this.epsilon(elements[13])}, ${this.epsilon(
			elements[14],
		)}, ${this.epsilon(elements[15])})`;
	}

	public renderObject(
		object: THREE.Object3D,
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
		cameraCssMatrix: string,
	) {
		if (object instanceof Css3dObject) {
			const visible = object.visible && object.layers.test(camera.layers);
			object.element.style.display = visible ? '' : 'none';

			if (visible) {
				object.onBeforeRender(
					this as unknown as WebGLRenderer,
					scene,
					camera,
					undefined as any,
					undefined as any,
					undefined as any,
				);

				let style;

				if (object instanceof Css3dSprite) {
					// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

					Css3dRenderer.matrix.copy(camera.matrixWorldInverse);
					Css3dRenderer.matrix.transpose();

					if (object.rotation2d !== 0)
						Css3dRenderer.matrix.multiply(
							Css3dRenderer.matrix2.makeRotationZ(
								object.rotation2d,
							),
						);

					object.matrixWorld.decompose(
						Css3dRenderer.position,
						Css3dRenderer.quaternion,
						Css3dRenderer.scale,
					);
					Css3dRenderer.matrix.setPosition(Css3dRenderer.position);
					Css3dRenderer.matrix.scale(Css3dRenderer.scale);

					Css3dRenderer.matrix.elements[3] = 0;
					Css3dRenderer.matrix.elements[7] = 0;
					Css3dRenderer.matrix.elements[11] = 0;
					Css3dRenderer.matrix.elements[15] = 1;

					style = this.getObjectCssMatrix(Css3dRenderer.matrix);
				} else {
					style = this.getObjectCssMatrix(object.matrixWorld);
				}

				const { element } = object;
				const cachedObject = this.cache.objects.get(object);

				if (
					cachedObject === undefined ||
					cachedObject.style !== style
				) {
					element.style.transform = style;

					const objectData = { style };
					this.cache.objects.set(object, objectData);
				}

				if (element.parentNode !== this.cameraElement) {
					this.cameraElement.appendChild(element);
				}

				object.onAfterRender(
					this as unknown as WebGLRenderer,
					scene,
					camera,
					undefined as any,
					undefined as any,
					undefined as any,
				);
			}
		}

		for (let i = 0, l = object.children.length; i < l; i++) {
			this.renderObject(
				object.children[i],
				scene,
				camera,
				cameraCssMatrix,
			);
		}
	}
}
