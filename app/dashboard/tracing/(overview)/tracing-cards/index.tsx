import {
	fetchProductIsOnChain,
	fetchProductTypes,
	fetchUserByEmail,
	fetchUserProductTypes,
} from '@/app/lib/data';
import { auth } from '@/auth';
import { Card, Empty, Spin } from 'antd';
import Meta from 'antd/es/card/Meta';
export default async function TracingCards() {
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('未登录或 session 信息不完整');
	}
	// 根据用户邮箱查公司 ID
	const user = await fetchUserByEmail(session.user.email);
	const product_types = await fetchUserProductTypes(user!);
	const onChainNumber = new Map<number, number>();
	for (const pt of product_types) {
		for (const p of pt.products) {
			const isOnChain = await fetchProductIsOnChain(p.serialNumber);
			if (isOnChain) {
				const oldNumber = await onChainNumber.get(pt.id);
				onChainNumber.set(pt.id, oldNumber ? oldNumber + 1 : 1);
			}
		}
	}
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{product_types.map((pt) => {
				return (
					<Card
						hoverable
						key={pt.id}
						style={{ width: 240 }}
						cover={
							<div className="h-44 pt-1">
								<img
									className="max-h-44 block mx-auto"
									alt={pt.name}
									src={`/api/pinita/file?cid=${pt.coverCid}`}
								/>
							</div>
						}
					>
						<Meta
							title={
								<p className="text-center truncate">
									{pt.name}
								</p>
							}
							description={
								<div className="text-center">
									<span>
										上链数量:{onChainNumber.get(pt.id) ?? 0}
									</span>
								</div>
							}
						></Meta>
					</Card>
				);
			})}
		</div>
	);
}
