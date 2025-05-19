import { fetchProductById } from '@/app/lib/data';
import { ProductStatusToString } from '@/app/lib/utils';
import ProductInfo from '@/app/ui/components/ProductInfo';
import { Descriptions } from 'antd';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = parseInt(params.id);
	const product = await fetchProductById(id);
	if (product === null) {
		notFound();
	}
	return (
		<div className="p-8 space-y-6">
			<ProductInfo
				imgUrl={`/api/pinita/file?cid=${product.type?.coverCid}`}
				name={product.type.name}
			>
				<Descriptions.Item label="商品序列号">
					{product.serialNumber}
				</Descriptions.Item>
				<Descriptions.Item label="生产日期">
					{product.manufactureDate.toLocaleString()}
				</Descriptions.Item>
				<Descriptions.Item label="登记日期">
					{product.createdAt.toLocaleString()}
				</Descriptions.Item>
				<Descriptions.Item label="当前拥有者">
					{product.currentOwner.email}
				</Descriptions.Item>

				<Descriptions.Item label="商品状态">
					{ProductStatusToString(product.status)}
				</Descriptions.Item>
			</ProductInfo>
		</div>
	);
}
