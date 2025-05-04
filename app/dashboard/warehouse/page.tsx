import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import { Suspense } from 'react';
import ProductTable from '@/app/ui/dashboard/warehouse/productTable';
import { auth } from '@/auth';
export const metadata: Metadata = {
	title: 'Warehouse',
};
export default async function Page() {
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('未登录或 session 信息不完整');
	}
	// 根据用户邮箱查公司 ID
	const user = await prisma.users.findUnique({
		where: { email: session.user.email },
		select: { foundedCompany: true, companiesId: true },
	});
	const product_types = await prisma.product_types.findMany({
		where: {
			companyId: user?.foundedCompany[0].id || user?.companiesId!,
		},
		include: {
			products: true,
		},
	}); // 从数据库取商品列表
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">商品管理</h1>
			</div>
			{/* 将 products 传给前端组件 */}
			<Suspense>
				<ProductTable product_types={product_types} />
			</Suspense>
		</div>
	);
}
