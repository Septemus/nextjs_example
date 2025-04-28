'use client';

import { fetchCompanies, fetchCompanyOfUser } from '@/app/lib/data';
import { companies } from '@/generated/prisma';
import { Button, DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const CreateProductPage = () => {
	const session = useSession();
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
			manufactureDate: null as Date | null,
			createdAt: null as Date | null,
			serialNumber: '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required('商品名称不能为空'),
			serialNumber: Yup.string().required('序列号不能为空'),
			description: Yup.string(),
		}),
		onSubmit: async () => {
			// 提交交给 form 的 action，不在这里处理
		},
	});
	const [currentTime, setCurrentTime] = useState(dayjs());
	const [companies, setCompanies] = useState<null | companies[]>(null);
	const [mycompany, setMyCompany] = useState<companies | null>(null);
	useEffect(() => {
		setInterval(() => {
			setCurrentTime(dayjs());
		}, 1000);
		fetchCompanies().then((res) => {
			setCompanies(res);
		});
		const email = session.data?.user?.email;
		if (email) {
			fetchCompanyOfUser(email).then((res) => {
				setMyCompany(res);
			});
		}
	}, []);
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">新增商品</h1>

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
					/>
					{formik.touched.name && formik.errors.name ? (
						<div className="text-red-500 text-sm mt-1">
							{formik.errors.name}
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

				<div>
					<label className="block mb-2 font-medium">序列号</label>
					<Input
						name="serialNumber"
						value={formik.values.serialNumber}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="请输入序列号"
					/>
					{formik.touched.serialNumber &&
					formik.errors.serialNumber ? (
						<div className="text-red-500 text-sm mt-1">
							{formik.errors.serialNumber}
						</div>
					) : null}
				</div>
				<div>
					<label className="block mb-2 font-medium">制造日期</label>
					<DatePicker
						className="w-full"
						name="manufactureDate"
						placeholder="选择商品制造日期"
						showTime
						value={
							formik.values.manufactureDate
								? dayjs(formik.values.manufactureDate)
								: null
						}
						onChange={(date) => {
							formik.setFieldValue(
								'manufactureDate',
								date.toDate(),
							);
						}}
					/>
					{formik.touched.manufactureDate &&
						formik.errors.manufactureDate && (
							<div className="text-red-500 text-sm mt-1">
								{formik.errors.manufactureDate}
							</div>
						)}
				</div>
				{/* 👇 不可编辑但展示 */}

				<div>
					<label className="block mb-2 font-medium">
						商品登记日期
					</label>
					<DatePicker
						className="w-full"
						name="createdAt"
						placeholder="商品登记日期（当前）"
						showTime
						disabled
						value={currentTime}
						onChange={(date) => {
							formik.setFieldValue('createdAt', date.toDate());
						}}
					/>
				</div>
				<div>
					<label className="block mb-2 font-medium">制造公司</label>
					<Select
						className="w-full"
						disabled
						options={companies?.map((v) => {
							return { value: v.id, label: v.name };
						})}
						value={mycompany?.id}
					/>
				</div>

				<Button type="primary" htmlType="submit" className="mr-4">
					提交
				</Button>
				<Button
					htmlType="button"
					onClick={() => formik.resetForm()} // ✨ 直接清空表单
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

export default CreateProductPage;
