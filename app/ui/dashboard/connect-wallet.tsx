'use client';
import { Button } from 'antd';
import { useAccount, useConnect } from 'wagmi';

export default function ConnectWallet() {
	const { isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	if (isConnected) {
		return <div></div>;
	} else {
		return (
			<>
				<Button
					variant="solid"
					color="orange"
					onClick={() => {
						console.log('connecting');
						connect({ connector: connectors[0] });
					}}
				>
					连接Metamask钱包
				</Button>
			</>
		);
	}
}
