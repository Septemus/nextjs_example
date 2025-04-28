import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export function getConfig() {
	return createConfig({
		chains: [mainnet, sepolia],
		ssr: true,
		storage: createStorage({
			storage: cookieStorage,
		}),
		connectors: [metaMask()],
		transports: {
			[mainnet.id]: http(),
			[sepolia.id]: http(),
		},
	});
}
