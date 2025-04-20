import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login page for Next.js dashboard',
};

export default function LoginPage() {
	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
				<div className="flex h-20 w-full items-end rounded-lg bg-orange-500 p-3 md:h-36">
					<div className="w-full text-white">
						<AcmeLogo abbreviation={true} />
					</div>
				</div>
				<Suspense>
					<LoginForm />
				</Suspense>
			</div>
		</main>
	);
}
