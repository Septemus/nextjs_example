'use client';

import { Button, message } from 'antd';
import ClientCryptoPrice from '../../components/ClientCryptoPrice';
import { UsdtCircleColorful } from '../../components/ClientIcons';
import { fetchOrderById } from '@/app/lib/data';
import { useAccount, useSignMessage } from 'wagmi';
import { applyForReceivingUSDT } from '@/app/lib/actions';
import { useState } from 'react';
import { Address } from '@ant-design/web3';
export default function ReceiveMoney({
	order,
}: {
	order: NonNullable<Awaited<ReturnType<typeof fetchOrderById>>>;
}) {
	const { address, isConnected } = useAccount();
	const { signMessageAsync } = useSignMessage();
	const [txHash, setTxHash] = useState('');
	const [messageApi, contextHolder] = message.useMessage();
	return (
		<section className="mb-6">
			{contextHolder}
			<h2 className="text-lg font-semibold">领取金额</h2>
			<p className="text-xl font-bold flex justify-between">
				<ClientCryptoPrice
					icon={<UsdtCircleColorful />}
					value={
						(BigInt(order.productType.price) - BigInt(1)) *
						BigInt(1e6)
					}
					decimals={6}
					symbol="USDT"
				/>
				<Button
					className="w-24"
					icon={<UsdtCircleColorful />}
					onClick={() => {
						if (!address || !isConnected) {
							messageApi.error('未连接钱包');
						} else {
							signMessageAsync({
								message:
									process.env.NEXT_PUBLIC_PLATFORM_SLOGAN!,
							})
								.then((res) => {
									return applyForReceivingUSDT(
										address,
										process.env
											.NEXT_PUBLIC_PLATFORM_SLOGAN!,
										res,
										(
											Number(order.productType.price) - 1
										).toString(),
									);
								})
								.then((res) => {
									setTxHash(res);
									messageApi.success(
										`领取 ${(
											Number(order.productType.price) - 1
										).toString()} USDT成功`,
									);
								})
								.catch((err) => {
									messageApi.error(`领取失败，${err}`);
									console.error(err);
								});
						}
					}}
				>
					领取
				</Button>
			</p>
			{txHash !== '' ? (
				<Address
					ellipsis={{
						headClip: 8,
						tailClip: 6,
					}}
					copyable
					address={txHash}
				/>
			) : null}
		</section>
	);
}
