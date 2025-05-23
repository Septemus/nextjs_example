import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({
	children,
	className,
	type = 'submit',
	...rest
}: ButtonProps) {
	return (
		<button
			{...rest}
			className={clsx(
				'flex h-10 items-center rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:bg-orange-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
				className,
			)}
			type={type}
		>
			{children}
		</button>
	);
}
