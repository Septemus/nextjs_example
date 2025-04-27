'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@/generated/prisma';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string({
		invalid_type_error: 'Please select a customer.',
	}),
	amount: z.coerce
		.number()
		.gt(0, { message: 'Please enter an amount greater than $0.' }),
	status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status.',
	}),
	date: z.string(),
});
export type State = {
	errors?: {
		customerId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});
	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		};
	}
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split('T')[0];
	try {
		await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	  `;
	} catch (err) {
		console.error(err);
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}
	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(
	id: string,
	prevState: State,
	formData: FormData,
) {
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});
	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		};
	}
	const { customerId, amount, status } = UpdateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	const amountInCents = amount * 100;
	try {
		await sql`
		UPDATE invoices
		SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
		WHERE id = ${id}
	  `;
	} catch (err) {
		console.error(err);
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}

	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
	await sql`DELETE FROM invoices WHERE id = ${id}`;
	revalidatePath('/dashboard/invoices');
}

export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		await signIn('credentials', formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch ((error as any).type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.';
				default:
					return 'Something went wrong.';
			}
		}
		throw error;
	}
}

export async function registerBussiness(regForm: {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
	bindCompany: null | string;
	companyName: string;
	physicalAddress: string;
	registrationNumber: string;
	taxId: string;
	addingCompany: boolean;
	role: Role;
}) {
	const hashedPassword = await bcrypt.hash(regForm.password, 10);
	if (!regForm.addingCompany) {
		await prisma.users.create({
			data: {
				email: regForm.email,
				name: regForm.name,
				password: hashedPassword,
				role: regForm.role,
				companiesId:
					regForm.bindCompany === null
						? null
						: parseInt(regForm.bindCompany),
			},
		});
	} else {
		await prisma.users.create({
			data: {
				email: regForm.email,
				name: regForm.name,
				role: regForm.role,
				password: hashedPassword,
				foundedCompany: {
					create: {
						name: regForm.companyName,
						physicalAddress: regForm.physicalAddress,
						registrationNumber: regForm.registrationNumber,
						taxId: regForm.taxId,
					},
				},
			},
		});
	}
	await signIn('credentials', {
		email: regForm.email,
		password: regForm.password,
	});
}
