import { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from 'antd';
import ProductTableWrapper from './product-table-wrapper';
export const metadata: Metadata = {
	title: 'Warehouse',
};
export default async function Page() {
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">商品管理</h1>
			</div>
			{/* 将 products 传给前端组件 */}
			<Suspense fallback={<Skeleton />}>
				<ProductTableWrapper />
			</Suspense>
		</div>
	);
}
