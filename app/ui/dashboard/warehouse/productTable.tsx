'use client';
import FilterTable from '@/app/ui/components/FilterTable';
import React from 'react';
import { Button, message } from 'antd';
import Link from 'next/link';
// import { useWriteContract } from 'wagmi';
// import { abi, contractAddress } from '@/contracts/index';
import { product_types, products } from '@/generated/prisma';
// import { fetchCompanyById, fetchUserById } from '@/app/lib/data';

interface ProductTableProps {
	product_types: (product_types & { products: products[] })[];
}
// type ProductInput = {
// 	name: string;
// 	description: string;
// 	serialNumber: string;
// 	creatorEmail: string;
// 	manufactureDate: number;
// 	createdAt: number;
// 	companyId: number;
// 	companyName: string;
// };

const ProductTable: React.FC<ProductTableProps> = ({ product_types }) => {
	const [messageApi, contextHolder] = message.useMessage();
	// const { writeContractAsync, isPending } = useWriteContract();
	// const handleUploadToBlockchain = async (record: products) => {
	// 	async function computeProductInput(p: products): Promise<ProductInput> {
	// 		return {
	// 			name: p.name,
	// 			description: p.description || '',
	// 			serialNumber: p.serialNumber,
	// 			creatorEmail: (await fetchUserById(p.creatorId))?.email!,
	// 			manufactureDate: p.manufactureDate.getTime(),
	// 			createdAt: p.createdAt.getTime(),
	// 			companyId: p.companyId,
	// 			companyName: (await fetchCompanyById(p.companyId))?.name!,
	// 		};
	// 	}
	// 	try {
	// 		// 构造上链参数（注意字段顺序一定和Solidity里结构体一一对应）
	// 		messageApi.loading('商品上链中');
	// 		await new Promise((res) => {
	// 			setTimeout(res, 1500);
	// 		});
	// 		const productInput = await computeProductInput(record);
	// 		console.log('productInput:', Object.values(productInput));
	// 		// 发交易
	// 		const tx = await writeContractAsync({
	// 			address: contractAddress.ProductRegistry as `0x${string}`,
	// 			abi: abi.ProductRegistry.abi,
	// 			functionName: 'registerProduct',
	// 			args: Object.values(productInput),
	// 		});
	// 		messageApi.success('商品上链交易发送成功！');
	// 		console.log('交易哈希:', tx);
	// 	} catch (error: any) {
	// 		console.error(error);
	// 		messageApi.error(error.shortMessage || '上链失败');
	// 	}
	// };

	const columns = [
		{
			title: '商品名称',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '描述',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
		},
	];

	return (
		<>
			{contextHolder}
			<div className="flex justify-end mb-4">
				<Link href="/dashboard/product_type/create">
					<Button type="primary">新增商品</Button>
				</Link>
			</div>
			<FilterTable columns={columns} data={product_types} />
		</>
	);
};

export default ProductTable;
