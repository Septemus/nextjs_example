'use client';
import { lusitana } from '@/app/ui/fonts';
import {
	AtSymbolIcon,
	KeyIcon,
	ExclamationCircleIcon,
	BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useState } from 'react';
import { authenticate, register } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { CompanyField } from '../lib/definitions';

export default function RegisterForm({
	companies,
}: {
	companies: CompanyField[];
}) {
	const [addingCompany, setAddingCompany] = useState(false);
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
	// const [errorMessage, formAction, isPending] = useActionState(
	// 	register,
	// 	undefined,
	// );
	let companySection = (
		<div className="company-section">
			<hr className="mt-4" />
			<div className="mt-4">
				<label
					className="mb-3 mt-5 block text-xs font-medium text-gray-900"
					htmlFor="bindCompany"
				>
					绑定企业
				</label>

				<div className="relative">
					<select
						className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
						id="bindCompany"
						name="bindCompany"
						required
					>
						{companies.map((c) => {
							return (
								<option value={c.id} key={c.id}>
									{c.name}
								</option>
							);
						})}
					</select>
					<BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				</div>
			</div>
			<Button
				type="button"
				className="mt-4 w-full"
				onClick={() => {
					setAddingCompany(true);
				}}
			>
				未找到企业？注册企业
			</Button>
		</div>
	);
	if (addingCompany) {
		companySection = (
			<div className="add-company">
				<hr className="mt-4" />
				<div className="mt-4">
					<label
						className="mb-3 mt-5 block text-xs font-medium text-gray-900"
						htmlFor="companyName"
					>
						企业名称
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="companyName"
							type="text"
							name="companyName"
							placeholder="输入企业名称"
							required
							minLength={1}
						/>
						<BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
				<div className="mt-4">
					<label
						className="mb-3 mt-5 block text-xs font-medium text-gray-900"
						htmlFor="physicalAddress"
					>
						企业地址
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="physicalAddress"
							type="text"
							name="physicalAddress"
							placeholder="输入企业地址"
							required
							minLength={3}
						/>
						<BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
				<div className="mt-4">
					<label
						className="mb-3 mt-5 block text-xs font-medium text-gray-900"
						htmlFor="registrationNumber"
					>
						（选填）企业统一社会信用代码
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="registrationNumber"
							type="text"
							name="registrationNumber"
							placeholder="输入企业统一社会信用代码"
							required
							minLength={8}
						/>
						<BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
				<div className="mt-4">
					<label
						className="mb-3 mt-5 block text-xs font-medium text-gray-900"
						htmlFor="taxId"
					>
						（选填）企业纳税号
					</label>
					<div className="relative">
						<input
							className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
							id="taxId"
							type="text"
							name="taxId"
							placeholder="输入企业纳税号"
							required
							minLength={8}
						/>
						<BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
					</div>
				</div>
				<Button
					type="button"
					className="mt-4 w-full"
					onClick={() => {
						setAddingCompany(false);
					}}
				>
					返回绑定企业
				</Button>
			</div>
		);
	}
	return (
		<form className="space-y-3">
			<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
				<h1 className={`${lusitana.className} mb-3 text-2xl`}>
					注册以继续.
				</h1>
				<div className="w-full">
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="email"
						>
							邮箱地址
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="email"
								type="email"
								name="email"
								placeholder="输入账号绑定的邮箱地址"
								required
							/>
							<AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="name"
						>
							真实姓名
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="name"
								type="email"
								name="name"
								placeholder="输入真实姓名"
								required
							/>
							<AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="password"
						>
							密码
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="password"
								type="password"
								name="password"
								placeholder="输入密码"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="confirmPassword"
						>
							确认密码
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								placeholder="重新输入密码"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					{companySection}
				</div>
				<input type="hidden" name="redirectTo" value={callbackUrl} />
				<hr className="mt-4" />
				<Button className="mt-4 w-full">
					注册{' '}
					<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
				</Button>
				<Button className="mt-4 w-full" type="button">
					返回登陆{' '}
					<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
				</Button>
				<div className="flex h-8 items-end space-x-1">
					{/* Add form errors here */}
				</div>
			</div>
		</form>
	);
}
