import { BentoCache, bentostore } from 'bentocache';
import { memoryDriver } from 'bentocache/drivers/memory';

export const cache = new BentoCache({
	default: 'local',
	stores: {
		local: bentostore().useL1Layer(memoryDriver({ maxSize: '10mb' }))
	}
});
