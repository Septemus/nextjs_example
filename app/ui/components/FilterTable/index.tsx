'use client';

import React, { useState, useRef, ReactNode } from 'react';
import { Table, Button, Popconfirm, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

function FilterTable<
	DataIndex extends string,
	DataType extends {
		id: string | number;
		[key: string]: any;
	},
>({
	data,
	columns,
	expandedRowRender,
	propHandleDelete,
	children,
}: {
	data: DataType[];
	columns: {
		title: string;
		dataIndex: DataIndex;
		render?: (val: any) => ReactNode;
		unsearchable?: boolean;
		key: string;
		ellipsis?: boolean;
	}[];
	expandedRowRender?: (record: DataType) => React.ReactNode;
	propHandleDelete?: (id: string | number) => void;
	children?: (id: number | string) => ReactNode;
}) {
	const [dataSource, setDataSource] = useState(data);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);
	const handleDelete = (id: string | number) => {
		setDataSource(dataSource.filter((item) => item.id !== id));
		// ❗这里实际项目还应该调用API去删除数据库里的数据
		if (propHandleDelete) {
			propHandleDelete(id);
		}
	};
	const getColumnSearchProps = (
		dataIndex: DataIndex,
	): TableColumnType<DataType> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => {
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
			return (
				<div
					style={{ padding: 8 }}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<Input
						ref={searchInput}
						placeholder={`搜索 ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={(e) =>
							setSelectedKeys(
								e.target.value ? [e.target.value] : [],
							)
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
								close();
							}}
						>
							关闭
						</Button>
					</Space>
				</div>
			);
		},
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

	const tabColumns = [
		...columns.map((c) => {
			if (c.unsearchable) {
				return c;
			} else {
				return {
					...c,
					...getColumnSearchProps(c.dataIndex),
				};
			}
		}),
		{
			title: '操作',
			key: 'action',
			render: (_: any, record: DataType) => (
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
					<Button variant="solid" color="green" className="mr-2">
						修改
					</Button>
					{children!(record.id)}
				</>
			),
		},
	];

	return (
		<>
			<Table
				columns={tabColumns}
				dataSource={dataSource}
				rowKey="id"
				expandable={{
					expandedRowRender,
					rowExpandable: () => {
						return expandedRowRender ? true : false;
					},
				}}
				bordered
			/>
		</>
	);
}

export default FilterTable;
