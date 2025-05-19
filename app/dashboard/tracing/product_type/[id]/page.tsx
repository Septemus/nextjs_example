import {
	fetchOnChainNumber,
	fetchOnChainProducts,
	fetchProductTypeById,
} from '@/app/lib/data';
import ClientCryptoPrice from '@/app/ui/components/ClientCryptoPrice';
import { UsdtCircleColorful } from '@/app/ui/components/ClientIcons';
import ProductsTable from '@/app/ui/dashboard/warehouse/products/products-table';
import { products, ProductStatus } from '@/generated/prisma';
import { Button, Descriptions, Table } from 'antd';
import { Image } from 'antd/lib';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parseUnits } from 'viem';
import ProductsTableWrapper from './products-table-wrapper';
export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = parseInt(params.id);
	const product_type = await fetchProductTypeById(id);
	if (product_type === null) {
		notFound();
	}
	const onChainNumber = await fetchOnChainNumber([product_type]);
	const onChainProducts = await fetchOnChainProducts(product_type);
	return (
		<div className="p-8 space-y-6">
			<div className="flex flex-col xl:flex-row gap-6">
				{/* 商品图片 */}
				<div className="flex-shrink-0 w-full xl:w-1/4">
					<div className="flex justify-center xl:justify-start w-full">
						<Image
							src={`/api/pinita/file?cid=${product_type?.coverCid}`}
							alt={product_type?.name}
							className="rounded-2xl shadow-md max-h-72"
						/>
					</div>
				</div>

				{/* 商品信息 */}
				<div className="flex-1">
					<Descriptions
						column={1}
						labelStyle={{ fontWeight: 600, fontSize: 18 }}
						contentStyle={{ fontSize: 18 }}
						title={
							<h1 className="text-4xl">{product_type.name}</h1>
						}
					>
						<Descriptions.Item label="描述">
							{product_type.description}
						</Descriptions.Item>
						<Descriptions.Item label="制造商">
							{product_type.manufacturerCompany.name}
						</Descriptions.Item>
						<Descriptions.Item label="价格">
							<ClientCryptoPrice
								icon={<UsdtCircleColorful />}
								value={parseUnits(`${product_type.price}`, 6)}
								decimals={6}
								symbol="USDT"
							/>
						</Descriptions.Item>
						<Descriptions.Item label="库存数量">
							{product_type.products.length}
						</Descriptions.Item>
						<Descriptions.Item label="上链数量">
							{onChainNumber.get(product_type.id)}
						</Descriptions.Item>
					</Descriptions>
				</div>
			</div>

			{/* 商品实例表格 */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold">上链商品实例</h1>
			</div>
			<ProductsTableWrapper products={onChainProducts} />
		</div>
	);
}
