import CardsGrid from '@/app/ui/components/cardsGrid';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import Link from 'next/link';

export default function Page() {
	return (
		<CardsGrid cardsContent={[]}>
			<Link href={`/dashboard/retail/sell/add`}>
				<Card
					hoverable
					style={{ width: 240 }}
					cover={
						<div className="h-44 pt-1 text-center">
							<PlusCircleOutlined
								className="text-9xl"
								style={{
									color: '#fb923c',
								}}
							/>
						</div>
					}
				>
					<Meta
						title={
							<p className="text-center truncate">
								添加商品到零售
							</p>
						}
					></Meta>
				</Card>
			</Link>
		</CardsGrid>
	);
}
