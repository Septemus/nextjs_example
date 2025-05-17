import prisma from '@/app/lib/prisma';
import ProductTable from '@/app/ui/dashboard/warehouse/productTable';
import { auth } from '@/auth';
import { fetchProductIsOnChain } from '@/app/lib/data';
export default async function ProductTableWrapper() {
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
			companyId: user?.companiesId || user?.foundedCompany[0].id!,
		},
		include: {
			products: true,
		},
	}); // 从数据库取商品列表
	const productId_isOnChain = new Map<number, boolean>();
	for (const pt of product_types) {
		for (const p of pt.products) {
			const isOnchain = await fetchProductIsOnChain(p.serialNumber);
			productId_isOnChain.set(p.id, isOnchain);
		}
	}
	return (
		<ProductTable
			product_types={product_types}
			productId_isOnChain={productId_isOnChain}
		/>
	);
}
