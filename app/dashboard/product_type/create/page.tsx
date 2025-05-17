import { createProductType } from '@/app/lib/actions';
import SingleProductTypeForm from '@/app/ui/dashboard/warehouse/product_type/single_product_type';
const Page = () => {
	return (
		<SingleProductTypeForm
			handleSubmit={async (form) => {
				'use server';
				return await createProductType(form);
			}}
		/>
	);
};

export default Page;
