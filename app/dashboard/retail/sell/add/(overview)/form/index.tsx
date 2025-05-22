'use client';
import { product_types, products } from '@/generated/prisma';
import { CryptoInput } from '@ant-design/web3';
import { USDT } from '@ant-design/web3-wagmi';
import { Select, Button, Image } from 'antd';
import { useState } from 'react';
import { parseUnits } from 'viem';

export default function AddSellForm({
	product_types,
}: {
	product_types: (product_types & { products: products[] })[];
}) {
	const [selectedProductType, setSelectedProductType] =
		useState<product_types | null>(null);
	return (
		<form className="max-w-xl space-y-4">
			{/* 👇 不可编辑但展示 */}

			<div>
				<label className="block mb-2 font-medium">选择商品种类</label>
				<Select
					className="w-full"
					options={product_types?.map((pt) => {
						return { value: pt.id, label: pt.name };
					})}
					onChange={(id: number) => {
						setSelectedProductType(
							product_types.find((pt) => pt.id === id)!,
						);
					}}
				/>
			</div>
			{selectedProductType && (
				<>
					<div>
						<label className="block mb-2 font-medium">
							商品图片
						</label>
						<Image
							src={`/api/pinita/file?cid=${selectedProductType.coverCid}`}
							className="max-h-64 rounded-2xl shadow-md"
						/>
					</div>
					<div>
						<label className="block mb-2 font-medium">
							设置零售价格
						</label>
						<CryptoInput
							disabled
							value={{
								token: USDT,
								amount: parseUnits(
									selectedProductType.price.toString(),
									6,
								),
								inputString:
									selectedProductType.price.toString(),
							}}
							footer={false}
							options={[USDT]}
						/>
					</div>
				</>
			)}

			<Button type="primary" htmlType="submit" className="mr-4">
				提交
			</Button>
			<Button htmlType="button" color="danger" variant="solid">
				返回
			</Button>
		</form>
	);
}
