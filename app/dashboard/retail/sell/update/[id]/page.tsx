import { fetchCommodotyById, fetchUserByEmail } from '@/app/lib/data';
import UpdateSellForm from './form';
import { auth } from '@/auth';

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;
	const session = await auth();
	const user = await fetchUserByEmail(session?.user?.email!);
	const commodoty = await fetchCommodotyById(parseInt(id), user!);
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">修改零售商品信息</h1>
			<UpdateSellForm commodoty={commodoty!} />
		</div>
	);
}
