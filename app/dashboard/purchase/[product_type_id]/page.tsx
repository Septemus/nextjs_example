import { fetchProductTypeById } from '@/app/lib/data';
import ClientCryptoPrice from '@/app/ui/components/ClientCryptoPrice';
import { UsdtCircleColorful } from '@/app/ui/components/ClientIcons/index';
import ProductPurchaseForm from './PurchaseForm';
import { Image } from 'antd';
export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ product_type_id: string }>;
}) {
	const product_type = (await fetchProductTypeById(
		parseInt((await params).product_type_id),
	))!;

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">{product_type.name}</h1>
			<p className="text-gray-600">{product_type.description}</p>
			<Image
				src={`/api/pinita/file?cid=${product_type.coverCid}`}
				className="rounded-2xl shadow-md max-h-72"
			/>
			<div className="grid grid-cols-2 gap-4 mt-4">
				<div>
					<strong>制造商：</strong>{' '}
					{product_type.manufacturerCompany.name}
				</div>
				<div>
					<strong>库存数量：</strong> {product_type.products.length}
				</div>
			</div>
			<div>
				<strong>价格：</strong>{' '}
				<ClientCryptoPrice
					icon={<UsdtCircleColorful />}
					value={product_type.price * 100_0000n}
					decimals={6}
					symbol="USDT"
				/>
			</div>
			<ProductPurchaseForm product_type={product_type} />
		</div>
	);
}
