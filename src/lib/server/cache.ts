import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';

export const cache = new BentoCache({
	default: 'memory',
	stores: {
		memory: bentostore().useL1Layer(memoryDriver({ maxSize: '10mb' }))
	}
});
