'use server';

import prisma from './prisma';
import {
	detectIsOnChain,
	getProductBySerialNumber,
	getProductOrders,
	productExists,
} from './contract-actions';
import { companies, products, users } from '@/generated/prisma';
export async function fetchCompanies() {
	return await prisma.companies.findMany();
}
export async function fetchCompanyById(id: number) {
	return await prisma.companies.findUnique({
		where: {
			id,
		},
	});
}
export async function fetchCompanyOfUser(email: string) {
	// 根据用户邮箱查公司 ID
	const user = await prisma.users.findUnique({
		where: { email },
		select: { foundedCompany: true, companiesId: true },
	});
	return await prisma.companies.findUnique({
		where: {
			id: user?.companiesId ?? user?.foundedCompany[0].id,
		},
	});
}
export async function fetchUsers() {
	return await prisma.users.findMany();
}
export async function fetchUserByEmail(email: string) {
	return await prisma.users.findUnique({
		where: {
			email,
		},
		include: {
			foundedCompany: true,
		},
	});
}

export async function fetchUserById(id: string) {
	return await prisma.users.findUnique({
		where: {
			id,
		},
	});
}

export async function fetchProductTypeById(id: number) {
	return await prisma.product_types.findUnique({
		where: {
			id,
		},
		include: {
			manufacturerCompany: true,
			products: true,
		},
	});
}
export async function fetchProductTypes() {
	return await prisma.product_types.findMany({
		include: {
			products: true,
			manufacturerCompany: true,
		},
	});
}

export async function fetchUserProductTypes(
	u: users & { foundedCompany: companies[] },
) {
	return await prisma.product_types.findMany({
		where: {
			OR: [
				{
					OR: [
						{
							companyId: u.companiesId ?? -1,
						},
						{
							companyId: u.foundedCompany[0]?.id,
						},
					],
				},
				{
					products: {
						some: {
							currentOwnerId: u.id,
						},
					},
				},
			],
		},
		include: {
			products: {
				where: {
					OR: [
						{
							currentOwnerId: u.id,
						},
						{
							creatorId: u.id,
						},
						{
							type: {
								companyId: u.companiesId ?? undefined,
							},
						},
					],
				},
			},
			manufacturerCompany: true,
			commodoty: true,
		},
	});
}

export async function fetchProductById(id: number) {
	return await prisma.products.findUnique({
		where: {
			id,
		},
		include: {
			type: true,
			currentOwner: true,
		},
	});
}
export async function fetchOrderById(id: number) {
	return await prisma.orders.findUnique({
		where: {
			id,
		},
		include: {
			productType: {
				include: {
					manufacturerCompany: true,
				},
			},
			buyer: {
				include: {
					mycompany: true,
					foundedCompany: true,
				},
			},
			seller: true,
			order_items: {
				include: {
					product: {
						include: {
							creator: true,
						},
					},
				},
			},
		},
	});
}
export async function fetchProductIsOnChain(
	serialNumber: string,
): Promise<boolean> {
	return await productExists(serialNumber);
}
export async function fetchOrdersByCompany(company_id: number) {
	return await prisma.orders.findMany({
		where: {
			OR: [
				{
					seller: {
						OR: [
							{
								companiesId: company_id,
							},
							{
								foundedCompany: {
									some: {
										id: company_id,
									},
								},
							},
						],
					},
				},
				{
					buyer: {
						companiesId: company_id,
					},
				},
			],
		},
		include: {
			productType: true,
		},
	});
}
export async function fetchSellingOrdersByCompany(company_id: number) {
	return await prisma.orders.findMany({
		where: {
			seller: {
				OR: [
					{
						companiesId: company_id,
					},
					{
						foundedCompany: {
							some: {
								id: company_id,
							},
						},
					},
				],
			},
		},
	});
}
export async function fetchOnChainNumber(
	product_types: NonNullable<
		Awaited<ReturnType<typeof fetchUserProductTypes>>
	>,
) {
	const onChainNumber = new Map<number, number>();
	for (const pt of product_types) {
		onChainNumber.set(pt.id, 0);
		for (const p of pt.products) {
			const isOnChain = await fetchProductIsOnChain(p.serialNumber);
			if (isOnChain) {
				const oldNumber = await onChainNumber.get(pt.id);
				onChainNumber.set(pt.id, oldNumber! + 1);
			}
		}
	}
	return onChainNumber;
}
export async function fetchOnChainProducts(
	product_type: NonNullable<Awaited<ReturnType<typeof fetchProductTypeById>>>,
): Promise<products[]> {
	let ret = await Promise.all(
		product_type.products.map((p) => {
			return fetchProductIsOnChain(p.serialNumber).then((onChain) => {
				if (onChain) {
					return p;
				}
			});
		}),
	);
	ret = ret.filter((p) => p);
	return ret as products[];
}
export async function fetchProductOrdersOnChain(serialNumber: string) {
	return await getProductOrders(serialNumber);
}
export async function fetchProductOnChain(serialNumber: string) {
	return await getProductBySerialNumber(serialNumber);
}
export async function fetchCommodotiesByUser(user: users) {
	return await prisma.commodoty.findMany({
		where: {
			creatorId: user.id,
		},
		include: {
			productType: {
				include: {
					products: {
						where: {
							OR: [
								{
									currentOwnerId: user.id,
								},
								{ creatorId: user.id },
								{
									type: {
										companyId:
											user.companiesId ?? undefined,
									},
								},
							],
						},
					},
				},
			},
		},
	});
}
