import SideNav from '@/app/ui/dashboard/sidenav';
import AuthProvider from '@/app/context/authProvider';
import { auth } from '@/auth';

export const experimental_ppr = true;
export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	return (
		<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
			<AuthProvider session={session}>
				<div className="w-full flex-none md:w-64">
					<SideNav />
				</div>
				<div className="flex-grow p-6 md:overflow-y-auto md:p-12 relative">
					{children}
				</div>
			</AuthProvider>
		</div>
	);
}
