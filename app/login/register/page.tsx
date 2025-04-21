import { fetchCompanies } from '@/app/lib/data';
import RegisterForm from '@/app/ui/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Register',
	description: 'Register page for Next.js dashboard',
};

export default async function RegisterPage() {
	const companies = await fetchCompanies();
	return <RegisterForm {...{ companies }} />;
}
