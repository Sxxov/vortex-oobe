import { AbstractAnimation } from './AbstractAnimation';

export class ValueAnimation extends AbstractAnimation {
	public declare fps;
	public declare in;
	public declare out;
	public declare onStart;
	public declare onEnd;
	public declare onFrame;
	public declare onCreate;
	public declare onDestroy;
}
