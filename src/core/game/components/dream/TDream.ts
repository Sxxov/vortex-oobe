import type { IAlert } from '../ui/uis/IAlert';

export type TDream = Omit<IAlert, 'kind' | 'result'>;
