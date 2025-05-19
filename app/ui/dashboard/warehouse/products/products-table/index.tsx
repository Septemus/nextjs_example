'use client';
import { products, ProductStatus } from '@/generated/prisma';
import { Button, Space, Table } from 'antd';
import { ReactNode } from 'react';

export default function ProductsTable({
	products,
	actionArea,
}: {
	products: products[];
	actionArea: (id: number) => ReactNode;
}) {
	return (
		<Table<products>
			dataSource={products}
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
					render(val: Date) {
						return val.toISOString();
					},
				},
				{
					title: '登记日期',
					dataIndex: 'createdAt',
					key: 'createdAt',
					render(val: Date) {
						return val.toISOString();
					},
				},
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					render(val: ProductStatus) {
						const tmp: Record<ProductStatus, string> = {
							[ProductStatus.MANUFACTURING]: '已生产',
							[ProductStatus.DISTRIBUTING]: '运输中',
							[ProductStatus.FOR_SALE]: '销售中',
							[ProductStatus.SOLD]: '已销售',
						};
						return tmp[val];
					},
				},
				{
					title: '操作',
					key: 'action',
					render: (_, record) => (
						<Space size="middle">{actionArea(record.id)}</Space>
					),
				},
			]}
		/>
	);
}
