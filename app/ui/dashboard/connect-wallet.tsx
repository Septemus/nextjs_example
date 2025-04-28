'use client';
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from '@ant-design/web3';
import { WalletColorful, MetaMaskColorful } from '@ant-design/web3-icons';
export default function ConnectWallet() {
	const { isConnected, address, connector } = useAccount();
	const { connectors, connect } = useConnect();
	return (
		<div>
			<ConnectButton
				icon={isConnected ? <WalletColorful /> : <MetaMaskColorful />}
				account={isConnected ? { address: address! } : undefined}
				onConnectClick={() => {
					connect({ connector: connectors[0] });
				}}
				onDisconnectClick={() => {
					connector?.disconnect();
				}}
			/>
		</div>
	);
}
