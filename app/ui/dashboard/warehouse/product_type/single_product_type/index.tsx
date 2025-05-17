'use client';

import { createProductType } from '@/app/lib/actions';
import {
	fetchCompanies,
	fetchCompanyOfUser,
	fetchUserByEmail,
} from '@/app/lib/data';
import { companies, product_types } from '@/generated/prisma';
import {
	Button,
	Input,
	Select,
	Upload,
	message,
	Image,
	GetProp,
	UploadProps,
	UploadFile,
} from 'antd';
import { Field, useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CryptoInput } from '@ant-design/web3';
import { USDT } from '@ant-design/web3-assets/tokens';
import { PlusOutlined } from '@ant-design/icons';

import * as Yup from 'yup';
import { parseUnits } from 'viem';
import { randomUUID } from 'crypto';

const SingleProductTypeForm: React.FC<{
	product_type?: product_types;
	handleSubmit: (
		form: Parameters<typeof createProductType>[0],
	) => void | Promise<void>;
}> = ({ product_type, handleSubmit }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [displayPreview, setDisplayPreview] = useState(false);
	const session = useSession();
	const pathname = usePathname();
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			id: product_type?.id,
			name: product_type?.name ?? '',
			price: product_type?.price ?? (null as null | bigint | number),
			description: product_type?.description ?? '',
			companyId: product_type?.companyId ?? (null as number | null),
			coverUrl: product_type?.coverCid ?? (null as string | null),
		},
		validationSchema: Yup.object({
			name: Yup.string().required('商品名称不能为空'),
			price: Yup.number().required('商品价格不能为空'),
			description: Yup.string(),
			coverUrl: Yup.string().required('商品图片不能为空'),
		}),
		onSubmit: async () => {
			// 提交交给 form 的 action，不在这里处理
			try {
				await handleSubmit(formik.values as any);
				await messageApi.open({
					type: 'success',
					content: '添加商品成功',
				});
				router.replace('/dashboard/warehouse');
			} catch (err) {
				console.error(err);
				messageApi.open({
					type: 'error',
					content: '添加商品失败',
				});
			}
		},
	});
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [companies, setCompanies] = useState<null | companies[]>(null);
	useEffect(() => {
		fetchCompanies().then((res) => {
			setCompanies(res);
		});
		if (!product_type?.companyId) {
			const email = session.data?.user?.email;
			if (email) {
				fetchCompanyOfUser(email).then((res) => {
					console.log(session.data?.user);
					formik.setFieldValue('companyId', res?.id);
				});
			}
		}
		if (product_type?.coverCid) {
			setFileList([
				{
					url: `/api/pinita/file?cid=${product_type?.coverCid}`,
					uid: '0',
					name: 'cover',
				},
			]);
		}
	}, []);
	return (
		<div>
			{contextHolder}
			<form
				onSubmit={formik.handleSubmit} // 表单提交目标
				className="max-w-xl space-y-4"
			>
				<div>
					<label className="block mb-2 font-medium">商品名称</label>
					<Input
						name="name"
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="请输入商品名称"
						disabled={pathname.includes('update')}
					/>
					{formik.touched.name && formik.errors.name ? (
						<div className="text-red-500 text-sm mt-1">
							{formik.errors.name}
						</div>
					) : null}
				</div>

				<div>
					<label className="block mb-2 font-medium">商品图片</label>
					<Upload
						listType="picture-card"
						accept="image/*"
						maxCount={1}
						fileList={fileList}
						beforeUpload={(file) => {
							return new Promise((res, rej) => {
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = () => {
									const base64Url = reader.result;
									formik.setFieldValue('coverUrl', base64Url);
									res(base64Url as string);
								};
								reader.onerror = rej;
							});
						}}
						onChange={({ fileList }) => {
							fileList.forEach((f) => {
								f.status = 'done';
								f.url = formik.values.coverUrl!;
							});
							setFileList(fileList);
						}}
						showUploadList={true}
						onPreview={() => {
							setDisplayPreview(true);
						}}
						onRemove={() => {
							setFileList([]);
							formik.setFieldValue('coverUrl', null);
						}}
					>
						{fileList.length < 1 && (
							<button className="border-none bg-transparent block">
								<PlusOutlined />
								<div className="mt-2">上传图片</div>
							</button>
						)}
					</Upload>
					{displayPreview && (
						<Image
							wrapperStyle={{ display: 'none' }}
							preview={{
								visible: displayPreview,
								onVisibleChange: (visible) =>
									setDisplayPreview(visible),
								afterOpenChange: (visible) => !visible,
							}}
							src={formik.values.coverUrl!}
						/>
					)}
					{formik.errors.coverUrl ? (
						<div className="text-red-500 text-sm mt-1">
							{formik.errors.coverUrl}
						</div>
					) : null}
				</div>

				<div>
					<label className="block mb-2 font-medium">商品描述</label>
					<Input.TextArea
						name="description"
						value={formik.values.description}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						rows={4}
						placeholder="请输入商品描述"
					/>
				</div>

				{/* 👇 不可编辑但展示 */}

				<div>
					<label className="block mb-2 font-medium">制造公司</label>
					<Select
						className="w-full"
						disabled
						options={companies?.map((v) => {
							return { value: v.id, label: v.name };
						})}
						value={formik.values.companyId}
					/>
				</div>
				<div>
					<label className="block mb-2 font-medium">设置价格</label>
					<CryptoInput
						disabled
						value={{
							token: USDT,
							amount: parseUnits(
								formik.values.price?.toString() ?? '0',
								6,
							),
							inputString: formik.values.price?.toString(),
						}}
						onChange={(value) => {
							console.log(value);
							if (value && value.inputString && value.token) {
								formik.setFieldValue(
									'price',
									parseInt(value?.inputString),
								);
							} else {
								formik.setFieldValue('price', null);
							}
						}}
						footer={false}
						options={[USDT]}
					/>
					{formik.errors.price ? (
						<div className="text-red-500 text-sm mt-1">
							{formik.errors.price}
						</div>
					) : null}
				</div>
				{pathname.includes('update') ? (
					<Button
						variant="solid"
						color="green"
						htmlType="submit"
						className="mr-4"
					>
						修改
					</Button>
				) : (
					<Button type="primary" htmlType="submit" className="mr-4">
						提交
					</Button>
				)}

				<Button
					htmlType="button"
					onClick={() => {
						formik.resetForm();
						if (product_type?.coverCid) {
							setFileList([
								{
									url: `/api/pinita/file?cid=${product_type?.coverCid}`,
									uid: '0',
									name: 'cover',
								},
							]);
						}
					}} // ✨ 直接清空表单
					className="mr-4"
				>
					重置
				</Button>
				<Button
					htmlType="button"
					color="danger"
					variant="solid"
					onClick={() => {
						router.back();
					}}
				>
					返回
				</Button>
			</form>
		</div>
	);
};

export default SingleProductTypeForm;
