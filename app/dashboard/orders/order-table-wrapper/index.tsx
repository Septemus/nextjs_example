import { auth } from '@/auth';
import { fetchOrdersByCompany, fetchUserByEmail } from '@/app/lib/data';
import { orders, product_types } from '@/generated/prisma';
import OrderTable from '@/app/ui/dashboard/orders/OrderTable';
export default async function OrderTableWrapper() {
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
	return <OrderTable orders={orders} />;
}
