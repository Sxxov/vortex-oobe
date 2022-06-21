import type { IAlert } from '../ui/uis/IAlert';

export interface IDream extends Omit<IAlert, 'kind' | 'result'> {}
