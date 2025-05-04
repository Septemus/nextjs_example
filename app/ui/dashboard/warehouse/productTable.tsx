'use client';
import FilterTable from '@/app/ui/components/FilterTable';
import React from 'react';
import { Button, message } from 'antd';
import Link from 'next/link';
import { useWriteContract } from 'wagmi';
import { abi, contractAddress } from '@/contracts/index';
import { product_types, products, ProductStatus } from '@/generated/prisma';
import {
	fetchCompanyById,
	fetchProductById,
	fetchUserById,
} from '@/app/lib/data';
type Row = product_types & { products: products[] };
interface ProductTableProps {
	product_types: Row[];
}
type ProductInput = {
	name: string;
	description: string;
	serialNumber: string;
	creatorEmail: string;
	manufactureDate: number;
	createdAt: number;
	companyId: number;
	companyName: string;
};

const ProductTable: React.FC<ProductTableProps> = ({ product_types }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const { writeContractAsync, isPending } = useWriteContract();
	const handleUploadToBlockchain = async (record_id: string | number) => {
		if (typeof record_id === 'string') {
			record_id = parseInt(record_id);
		}
		const record = await fetchProductById(record_id);
		async function computeProductInput(
			p: typeof record,
		): Promise<ProductInput | null> {
			if (p) {
				return {
					name: p.type.name,
					description: p.type.description || '',
					serialNumber: p.serialNumber || '',
					creatorEmail: (await fetchUserById(p.creatorId))?.email!,
					manufactureDate: p.manufactureDate.getTime(),
					createdAt: p.createdAt.getTime(),
					companyId: p.type.companyId,
					companyName: (await fetchCompanyById(p.type.companyId))
						?.name!,
				};
			} else {
				return null;
			}
		}
		try {
			// 构造上链参数（注意字段顺序一定和Solidity里结构体一一对应）
			messageApi.loading('商品上链中');
			await new Promise((res) => {
				setTimeout(res, 500);
			});
			const productInput = await computeProductInput(record);
			if (productInput === null) {
				throw new Error('product input is empty');
			}
			console.log('productInput:', Object.values(productInput));
			// 发交易
			const tx = await writeContractAsync({
				address: contractAddress.ProductRegistry as `0x${string}`,
				abi: abi.ProductRegistry.abi,
				functionName: 'registerProduct',
				args: Object.values(productInput),
			});
			messageApi.success('商品上链交易发送成功！');
			console.log('交易哈希:', tx);
		} catch (error: any) {
			console.error(error);
			messageApi.error(error.shortMessage || '上链失败');
		}
	};

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
			<FilterTable
				columns={columns}
				data={product_types}
				expandedRowRender={(record: Row) => {
					return (
						<FilterTable
							data={record.products.map((p) => {
								const tmp: Record<ProductStatus, string> = {
									[ProductStatus.MANUFACTURING]: '已生产',
									[ProductStatus.DISTRIBUTING]: '运输中',
									[ProductStatus.FOR_SALE]: '销售中',
									[ProductStatus.SOLD]: '已销售',
								};
								return {
									...p,
									status: tmp[p.status],
									manufactureDate:
										p.manufactureDate.toISOString(),
									createdAt: p.createdAt.toISOString(),
								};
							})}
							columns={[
								{
									title: '商品序列号',
									dataIndex: 'serialNumber',
									key: 'serialNumber',
								},
								{
									title: '生产日期',
									dataIndex: 'manufactureDate',
									key: 'manufactureDate',
								},
								{
									title: '登记日期',
									dataIndex: 'createdAt',
									key: 'createdAt',
								},
								{
									title: '状态',
									dataIndex: 'status',
									key: 'status',
								},
							]}
						>
							{(id) => {
								return (
									<Button
										variant="solid"
										color="blue"
										loading={isPending}
										onClick={() =>
											handleUploadToBlockchain(id)
										}
									>
										数据上链
									</Button>
								);
							}}
						</FilterTable>
					);
				}}
			>
				{(id: number | string) => {
					return (
						<Link href={`/dashboard/product/create/${id}`}>
							<Button type="primary">添加记录</Button>
						</Link>
					);
				}}
			</FilterTable>
		</>
	);
};

export default ProductTable;
