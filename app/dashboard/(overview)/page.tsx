import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import DashInfo from './dash-info';
import ProductTableWrapper from '../warehouse/product-table-wrapper';
import OrderTableWrapper from '../orders/order-table-wrapper';
import { Skeleton } from 'antd';

export const metadata: Metadata = {
	title: 'Overview',
	description: 'Overview page for Next.js dashboard',
};
export default async function Page() {
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
				综合数据
			</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<CardsSkeleton />}>
					{/* <CardWrapper /> */}
					<DashInfo />
				</Suspense>
			</div>
			<div className="mt-6">
				<h2
					className={`${lusitana.className} mb-4 text-xl md:text-2xl`}
				>
					最新订单
				</h2>
				<Suspense fallback={<Skeleton />}>
					<div>
						<OrderTableWrapper take={10} />
					</div>
				</Suspense>
			</div>
		</main>
	);
}
