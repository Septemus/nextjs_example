'use client';

import { Button, Input } from 'antd';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const CreateProductPage = () => {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
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
