import { ShapedArrayStore } from '../../blocks/store/stores/ShapedArrayStore';
import type { TXps } from './TXps';

export class XpStore extends ShapedArrayStore<TXps> {
	constructor(xps: TXps = [0, 0, 0]) {
		super(xps);
	}

	public get pedophilic() {
		return this[0];
	}

	public set pedophilic(v: number) {
		this[0] = v;
	}

	public get homicidal() {
		return this[1];
	}

	public set homicidal(v: number) {
		this[1] = v;
	}

	public get suicidal() {
		return this[2];
	}

	public set suicidal(v: number) {
		this[2] = v;
	}

	public increment(v: TXps) {
		this.update((oldXps) => oldXps.map((oldXp, i) => oldXp + v[i]) as TXps);
	}

	public decrement(v: TXps) {
		this.update((oldXps) => oldXps.map((oldXp, i) => oldXp - v[i]) as TXps);
	}
}
