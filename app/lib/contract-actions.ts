import { abi, contractAddress, createPlatformWallet } from '@/contracts';
import { getContract, parseUnits } from 'viem';

const platformWallet = createPlatformWallet();
const productRegistryContract = getContract({
	address: contractAddress.ProductRegistry as `0x${string}`,
	abi: abi.ProductRegistry.abi,
	client: platformWallet,
});
const USDTContract = getContract({
	address: contractAddress.USDT as `0x${string}`,
	abi: abi.USDT.abi,
	client: platformWallet,
});

export enum ProductStatusSolidity {
	MANUFACTURING,
	DISTRIBUTING,
	FOR_SALE,
	SOLD,
}

export const getProductBySerialNumber = async (searialNumber: string) => {
	return await productRegistryContract.read.getProductBySerialNumber([
		searialNumber,
	]);
};
export const PublishProductOnChain = async (
	args: Parameters<typeof productRegistryContract.write.registerProduct>[0],
) => {
	console.warn('商品未上链，正在上链中...');
	const txHash = await productRegistryContract.write.registerProduct(args);
	console.warn('商品上联成功', txHash);
	return txHash;
};
export const transferOwnership = async (
	productId: bigint,
	newOwnerEmail: string,
) => {
	console.log('添加流转记录中...');
	const txHash = await productRegistryContract.write.transferOwnership([
		productId,
		newOwnerEmail,
	]);
	console.log('流转记录添加成功', txHash);
};
export const updateProductStatus = async (
	product_id: bigint,
	product_status: ProductStatusSolidity,
) => {
	console.log('商品状态更新中...');
	const txHash = await productRegistryContract.write.updateProductStatus([
		product_id,
		product_status,
	]);
	console.log('商品状态更新成功', txHash);
	return txHash;
};
export async function transferUSDT(addr: `0x${string}`, amount: string) {
	console.warn(`转移${amount}USDT中...`);
	const txHash = await USDTContract.write.transfer([
		addr,
		parseUnits(amount.toString(), 18),
	]);
	console.warn(`转移USDT成功`, txHash);
	return txHash;
}
