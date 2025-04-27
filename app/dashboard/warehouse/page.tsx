import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import { Suspense } from 'react';
import ProductTable from '@/app/ui/dashboard/warehouse/productTable';
export const metadata: Metadata = {
	title: 'Warehouse',
};
export default async function Page() {
	const products = await prisma.products.findMany(); // 从数据库取商品列表
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">商品管理</h1>
			</div>
			{/* 将 products 传给前端组件 */}
			<Suspense>
				<ProductTable products={products} />
			</Suspense>
		</div>
	);
}
