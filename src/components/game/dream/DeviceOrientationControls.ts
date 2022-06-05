import { Euler, EventDispatcher, MathUtils, Quaternion, Vector3 } from 'three';

export class DeviceOrientationControls extends EventDispatcher {
	public static readonly zee = new Vector3(0, 0, 1);
	public static readonly euler = new Euler();
	public static readonly q0 = new Quaternion();
	public static readonly q1 = new Quaternion(
		-Math.sqrt(0.5),
		0,
		0,
		Math.sqrt(0.5),
	); // - PI/2 around the x-axis

	public static readonly changeEvent = { type: 'change' };

	public static readonly EPS = 0.000001;

	public lastQuaternion = new Quaternion();

	public enabled = true;
	public deviceOrientation?: DeviceOrientationEvent;
	public screenOrientation = 0;
	public alphaOffset = 0; // radians

	constructor(public object: THREE.Camera) {
		super();

		if (!window.isSecureContext) {
			console.error(
				'THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)',
			);
		}

		this.object.rotation.reorder('YXZ');
	}

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
	private setObjectQuaternion(
		quaternion: THREE.Quaternion,
		alpha: number,
		beta: number,
		gamma: number,
		orient: number,
	) {
		DeviceOrientationControls.euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

		quaternion.setFromEuler(DeviceOrientationControls.euler); // orient the device

		quaternion.multiply(DeviceOrientationControls.q1); // camera looks out the back of the device, not the top

		quaternion.multiply(
			DeviceOrientationControls.q0.setFromAxisAngle(
				DeviceOrientationControls.zee,
				-orient,
			),
		); // adjust for screen orientation
	}

	private onDeviceOrientationChangeEvent = (
		event: DeviceOrientationEvent,
	) => {
		this.deviceOrientation = event;
	};

	private onScreenOrientationChangeEvent = () => {
		this.screenOrientation = window.orientation || 0;
	};

	public connect() {
		this.onScreenOrientationChangeEvent(); // run once on load

		// iOS 13+
		if (
			window.DeviceOrientationEvent !== undefined &&
			'requestPermission' in window.DeviceOrientationEvent
		) {
			(
				window.DeviceOrientationEvent as unknown as DeviceOrientationEvent & {
					requestPermission(): Promise<'granted' | 'denied'>;
				}
			)
				.requestPermission()
				.then((response: 'granted' | 'denied') => {
					if (response === 'granted') {
						window.addEventListener(
							'orientationchange',
							this.onScreenOrientationChangeEvent,
						);
						window.addEventListener(
							'deviceorientation',
							this.onDeviceOrientationChangeEvent,
						);
					}
				})
				.catch((error: Error) => {
					console.error(
						'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:',
						error,
					);
				});
		} else {
			window.addEventListener(
				'orientationchange',
				this.onScreenOrientationChangeEvent,
			);
			window.addEventListener(
				'deviceorientation',
				this.onDeviceOrientationChangeEvent,
			);
		}

		this.enabled = true;
	}

	public disconnect() {
		window.removeEventListener(
			'orientationchange',
			this.onScreenOrientationChangeEvent,
		);
		window.removeEventListener(
			'deviceorientation',
			this.onDeviceOrientationChangeEvent,
		);

		this.enabled = false;
	}

	public dispose() {
		this.disconnect();
	}

	public update() {
		if (!this.enabled) return;

		const device = this.deviceOrientation;

		if (device) {
			const alpha = device.alpha
				? MathUtils.degToRad(device.alpha) + this.alphaOffset
				: 0; // Z

			const beta = device.beta ? MathUtils.degToRad(device.beta) : 0; // X'

			const gamma = device.gamma ? MathUtils.degToRad(device.gamma) : 0; // Y''

			const orient = this.screenOrientation
				? MathUtils.degToRad(this.screenOrientation)
				: 0; // O

			this.setObjectQuaternion(
				this.object.quaternion,
				alpha,
				beta,
				gamma,
				orient,
			);

			if (
				8 * (1 - this.lastQuaternion.dot(this.object.quaternion)) >
				DeviceOrientationControls.EPS
			) {
				this.lastQuaternion.copy(this.object.quaternion);
				this.dispatchEvent(DeviceOrientationControls.changeEvent);
			}
		}
	}
}
