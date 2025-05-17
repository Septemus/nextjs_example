import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import { Suspense } from 'react';
import OrderTable from '@/app/ui/dashboard/orders/OrderTable';
import { Skeleton } from 'antd';
import { auth } from '@/auth';
import { fetchOrdersByCompany, fetchUserByEmail } from '@/app/lib/data';
import { orders, product_types } from '@/generated/prisma';
export const metadata: Metadata = {
	title: 'Warehouse',
};
export default async function Page() {
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('未登录或 session 信息不完整');
	}
	// 根据用户邮箱查公司 ID
	const user = await fetchUserByEmail(session.user.email);
	const company_id = user?.companiesId || user?.foundedCompany[0].id;
	let orders: (orders & { productType: product_types })[] = [];
	if (company_id) {
		orders = await fetchOrdersByCompany(company_id);
	}
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">订单管理</h1>
			</div>
			{/* 将 products 传给前端组件 */}
			<Suspense fallback={<Skeleton />}>
				<OrderTable orders={orders} />
			</Suspense>
		</div>
	);
}
