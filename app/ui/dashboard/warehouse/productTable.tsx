'use client';

import React, { useState, useRef } from 'react';
import { Table, Button, Popconfirm, message, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Link from 'next/link';

// 接收 props 类型
interface Product {
	id: number;
	name: string;
	description: string | null;
	serialNumber: string;
}

interface ProductTableProps {
	products: Product[];
}

type DataIndex = keyof Product;

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
	const [dataSource, setDataSource] = useState(products);

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
	): TableColumnType<Product> => ({
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
			render: (_: any, record: Product) => (
				<Popconfirm
					title="确定要删除吗？"
					onConfirm={() => handleDelete(record.id)}
					okText="是"
					cancelText="否"
				>
					<Button type="link" danger>
						删除
					</Button>
				</Popconfirm>
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
