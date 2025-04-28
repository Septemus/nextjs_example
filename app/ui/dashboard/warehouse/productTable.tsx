'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Link from 'next/link';
import { useSimulateContract, useWriteContract } from 'wagmi';
import { abi, contractAddress } from '@/contracts/index';
import { products } from '@/generated/prisma';
import { fetchCompanyById, fetchUserById } from '@/app/lib/data';

interface ProductTableProps {
	products: products[];
}
type ProductInput = {
	name: string;
	description: string;
	serialNumber: string;
	creatorEmail: string;
	manufactureDate: number;
	createdAt: number;
	companyId: number;
	companyName: string;
};
type DataIndex = keyof products;

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
	const [dataSource, setDataSource] = useState(products);
	const [selectedProduct, setSelectedProduct] = useState<products | null>(
		null,
	);
	const [productInput, setProductInput] = useState<ProductInput | null>(null);
	useEffect(() => {
		async function computeProductInput(p: products): Promise<ProductInput> {
			return {
				name: p.name,
				description: p.description || '',
				serialNumber: p.serialNumber,
				creatorEmail: (await fetchUserById(p.creatorId))?.email!,
				manufactureDate: p.manufactureDate.getTime(),
				createdAt: p.createdAt.getTime(),
				companyId: p.companyId,
				companyName: (await fetchCompanyById(p.companyId))?.name!,
			};
		}
		if (selectedProduct) {
			computeProductInput(selectedProduct).then((res) => {
				setProductInput(res);
			});
		}
	}, [selectedProduct]);
	const { writeContractAsync } = useWriteContract();
	// 先模拟（模拟不会上链）
	const { data } = useSimulateContract({
		address: contractAddress.ProductRegistry as `0x${string}`,
		abi: abi.ProductRegistry.abi,
		functionName: 'registerProduct',
		args: [productInput],
	});
	const handleUploadToBlockchain = async () => {
		try {
			// 构造上链参数（注意字段顺序一定和Solidity里结构体一一对应）

			if (!data) {
				message.error('无法上链');
				return;
			}

			// 真正发交易
			const tx = await writeContractAsync(data.request);
			message.success('商品上链交易发送成功！');
			console.log('交易哈希:', tx);
		} catch (error: any) {
			console.error(error);
			message.error(error.shortMessage || '上链失败');
		}
	};

	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const handleDelete = (id: number) => {
		setDataSource(dataSource.filter((item) => item.id !== id));
		message.success('删除成功');
		// ❗这里实际项目还应该调用API去删除数据库里的数据
	};

	const handleSearch = (
		selectedKeys: string[],
		confirm: FilterDropdownProps['confirm'],
		dataIndex: DataIndex,
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (
		dataIndex: DataIndex,
	): TableColumnType<products> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`搜索 ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(
							selectedKeys as string[],
							confirm,
							dataIndex,
						)
					}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(
								selectedKeys as string[],
								confirm,
								dataIndex,
							)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						搜索
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size="small"
						style={{ width: 90 }}
					>
						重置
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchText((selectedKeys as string[])[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						筛选
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						关闭
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined
				style={{ color: filtered ? '#1677ff' : undefined }}
			/>
		),
		onFilter: (value, record) => {
			return (
				record[dataIndex]
					?.toString()
					.toLowerCase()
					.includes((value as string).toLowerCase()) ?? false
			);
		},

		filterDropdownProps: {
			onOpenChange(open) {
				if (open) {
					setTimeout(() => searchInput.current?.select(), 100);
				}
			},
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<>
					<Highlighter
						highlightStyle={{
							backgroundColor: '#ffc069',
							padding: 0,
						}}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					></Highlighter>
				</>
			) : (
				text
			),
	});

	const columns = [
		{
			title: '商品名称',
			dataIndex: 'name',
			key: 'name',
			...getColumnSearchProps('name'),
		},
		{
			title: '描述',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
			...getColumnSearchProps('description'),
		},
		{
			title: '序列号',
			dataIndex: 'serialNumber',
			key: 'serialNumber',
			...getColumnSearchProps('serialNumber'),
		},
		{
			title: '操作',
			key: 'action',
			render: (_: any, record: products) => (
				<>
					<Popconfirm
						title="确定要删除吗？"
						onConfirm={() => handleDelete(record.id)}
						okText="是"
						cancelText="否"
					>
						<Button variant="solid" color="danger" className="mr-2">
							删除
						</Button>
					</Popconfirm>
					<Button
						variant="solid"
						color="blue"
						onClick={() => {
							setSelectedProduct(record);
							handleUploadToBlockchain();
						}}
					>
						商品上链
					</Button>
				</>
			),
		},
	];

	return (
		<>
			<div className="flex justify-end mb-4">
				<Link href="/dashboard/product/create">
					<Button type="primary">新增商品</Button>
				</Link>
			</div>
			<Table
				columns={columns}
				dataSource={dataSource}
				rowKey="id"
				bordered
			/>
		</>
	);
};

export default ProductTable;
