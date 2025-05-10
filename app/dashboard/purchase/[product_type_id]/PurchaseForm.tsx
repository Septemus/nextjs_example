'use client';

import ClientCryptoPrice from '@/app/ui/components/ClientCryptoPrice';
import { product_types, products } from '@/generated/prisma';
import { UsdtCircleColorful } from '@ant-design/web3-icons';
import { Button, Input, InputNumber } from 'antd';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

export default function ProductPurchaseForm({
	product_type,
}: {
	product_type: product_types & { products: products[] };
}) {
	const formik = useFormik({
		initialValues: {
			quantity: 1,
			address: '',
			recipientName: '',
			phoneNumber: '',
		},
		validationSchema: Yup.object({
			quantity: Yup.number()
				.min(1, '数量不能小于1')
				.required('请填写购买数量'),
			address: Yup.string().required('请填写收货地址'),
			recipientName: Yup.string().required('请填写收货人姓名'),
			phoneNumber: Yup.string()
				.matches(/^1[3-9]\d{9}$/, '手机号格式不正确')
				.required('请填写联系电话'),
		}),
		onSubmit: (values) => {},
	});

	const [totalCost, setTotalCost] = useState(BigInt(0));
	useEffect(() => {
		setTotalCost(
			BigInt(product_type.price) *
				BigInt(1e6) *
				BigInt(formik.values.quantity),
		);
	}, [formik.values.quantity, product_type.price]);

	return (
		<form
			onSubmit={formik.handleSubmit}
			className="space-y-4 p-4 border rounded-xl shadow"
		>
			<div>
				<label className="block font-semibold mb-1">购买数量</label>
				<InputNumber
					name="quantity"
					min={1}
					max={product_type.products.length}
					defaultValue={1}
					changeOnWheel
					onChange={(v) => {
						formik.setFieldValue('quantity', v);
					}}
					onBlur={(v) => {
						formik.handleBlur(v);
					}}
					value={formik.values.quantity}
				/>
				{formik.touched.quantity && formik.errors.quantity && (
					<div className="text-red-500 text-sm">
						{formik.errors.quantity}
					</div>
				)}
			</div>

			<div>
				<label className="block font-semibold mb-1">收货地址</label>
				<Input
					type="text"
					name="address"
					className="w-full border px-3 py-2 rounded"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.address}
				/>
				{formik.touched.address && formik.errors.address && (
					<div className="text-red-500 text-sm">
						{formik.errors.address}
					</div>
				)}
			</div>

			<div>
				<label className="block font-semibold mb-1">收货人姓名</label>
				<Input
					type="text"
					name="recipientName"
					className="w-full border px-3 py-2 rounded"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.recipientName}
				/>
				{formik.touched.recipientName &&
					formik.errors.recipientName && (
						<div className="text-red-500 text-sm">
							{formik.errors.recipientName}
						</div>
					)}
			</div>

			<div>
				<label className="block font-semibold mb-1">联系电话</label>
				<Input
					type="tel"
					name="phoneNumber"
					className="w-full border px-3 py-2 rounded"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.phoneNumber}
				/>
				{formik.touched.phoneNumber && formik.errors.phoneNumber && (
					<div className="text-red-500 text-sm">
						{formik.errors.phoneNumber}
					</div>
				)}
			</div>

			<div>
				<label className="block font-semibold mb-1">花费：</label>
				<ClientCryptoPrice
					icon={<UsdtCircleColorful />}
					value={totalCost}
					decimals={6}
					symbol="USDT"
				/>
			</div>
			<Button htmlType="submit" type="primary">
				提交订单
			</Button>
		</form>
	);
}
