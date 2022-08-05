import type { DeviceOrientationControls } from './controls/DeviceOrientationControls';
import type { Css3dRenderer } from './renderer/Css3dRenderer';

export interface IDreamContext {
	controls: DeviceOrientationControls;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: Css3dRenderer;
	root: THREE.Object3D;
}
