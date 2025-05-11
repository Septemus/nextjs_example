import ProductRegistry from './abi/ProductRegistry.json';
import USDT from './abi/USDT.json';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
export const abi = {
	ProductRegistry,
	USDT,
};
export const contractAddress = {
	ProductRegistry: '0x77aA9F8c123F45423B6eD740257C26e881d3ebE6',
	USDT: '0xfB3b19FA57D76379381662C3fffc1f61F63A5ab2',
};
export const platformWalletAddr = '0xf0f35c0D8176f2de351fAFDa5f2FB2900B1712ED';
export const platformWalletPrivateKey = process.env
	.PLATFORM_WALLET_PRIVATE_KEY as `0x${string}`;
export const platformSlogan = process.env.NEXT_PUBLIC_PLATFORM_SLOGAN!;
export const createPlatformWallet = () => {
	const account = privateKeyToAccount(platformWalletPrivateKey);
	const client = createWalletClient({
		account,
		chain: {
			id: 1337, // Ganache chain ID by default
			name: 'Ganache',
			nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
			rpcUrls: {
				default: {
					http: ['http://127.0.0.1:7545'], // Ganache default RPC
				},
			},
		},
		transport: http(),
	});
	return client;
};
