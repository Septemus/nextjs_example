import { fetchOnChainNumber, fetchProductTypeById } from '@/app/lib/data';
import ClientCryptoPrice from '@/app/ui/components/ClientCryptoPrice';
import { UsdtCircleColorful } from '@/app/ui/components/ClientIcons';
import { Descriptions } from 'antd';
import { Image } from 'antd/lib';
import { notFound } from 'next/navigation';
import { parseUnits } from 'viem';
export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = parseInt(params.id);
	const product_type = await fetchProductTypeById(id);
	if (product_type === null) {
		notFound();
	}
	const onChainNumber = await fetchOnChainNumber([product_type]);
	return (
		<div className="p-8 space-y-6">
			<div className="flex flex-col md:flex-row gap-6">
				{/* 商品图片 */}
				<div className="flex-shrink-0 w-full md:w-1/3">
					<div className="h-72 w-full flex justify-center">
						<Image
							src={`/api/pinita/file?cid=${product_type?.coverCid}`}
							alt={product_type?.name}
							className="rounded-2xl shadow-md pt-1"
							height={'100%'}
							width={'auto'}
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
		</div>
	);
}
