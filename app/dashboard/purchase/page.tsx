// pages/purchase.tsx

import { fetchProductTypes } from '@/app/lib/data';
import { Button } from 'antd';
import { UsdtCircleColorful } from '@/app/ui/components/ClientIcons/index';
import ClientCryptoPrice from '@/app/ui/components/ClientCryptoPrice/index';
import Link from 'next/link';
export default async function PurchasePage() {
	const productTypes = await fetchProductTypes();

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">采购商品</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{productTypes.map((product) => (
					<div
						key={product.id}
						className="border p-4 rounded shadow hover:shadow-md transition relative	"
					>
						{product.coverUrl && (
							<img
								src={product.coverUrl}
								alt={product.name}
								className="w-full h-40 object-cover mb-3 rounded"
							/>
						)}
						<h2 className="text-xl font-semibold">
							{product.name}
						</h2>
						<p className="text-gray-600 text-sm mb-1">
							生产商：{product.manufacturerCompany.name}
						</p>
						<p className="text-sm">
							库存数量：{product.products.length}
						</p>
						{/* {product.description && (
							<p className="text-sm mb-2">
								{product.description}
							</p>
						)} */}
						<div className="pb-14"></div>
						<div className="absolute bottom-4 left-0 w-full px-4 flex flex-col-reverse lg:justify-between lg:flex-row">
							<Link href={`/dashboard/purchase/${product.id}`}>
								<Button type="primary" className="max-w-24">
									详情
								</Button>
							</Link>
							<ClientCryptoPrice
								icon={<UsdtCircleColorful />}
								value={BigInt(product.price) * BigInt(1e6)}
								decimals={6}
								symbol="USDT"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
