import employee_territories from '@/assets/db/EmployeeDB/employee_territories.json';
import employees from '@/assets/db/EmployeeDB/employees.json';
import regions from '@/assets/db/EmployeeDB/regions.json';
import territories from '@/assets/db/EmployeeDB/territories.json';

import categories from '@/assets/db/ShoppingDB/categories.json';
import customers from '@/assets/db/ShoppingDB/customers.json';
import order_details from '@/assets/db/ShoppingDB/order_details.json';
import orders from '@/assets/db/ShoppingDB/orders.json';
import products from '@/assets/db/ShoppingDB/products.json';
import shippers from '@/assets/db/ShoppingDB/shippers.json';
import suppliers from '@/assets/db/ShoppingDB/suppliers.json';

const QUERY1 = 'select * from regions;';
const QUERY2 = 'select firstname, lastname from employees;';
const QUERY3 = 'select count(*) as total from orders;';

const isAuthorizedReq = (params) => {
	return (
		!!params &&
		!!params.headers &&
		!!params.headers.Authorization &&
		params.headers.Authorization == 'Bearer accesstoken'
	);
};

const dbs = [
	{
		id: '1',
		name: 'EmployeeDB',
		data: {
			tables: [
				{
					id: '11',
					name: 'employee_territories',
					data: employee_territories
				},
				{
					id: '12',
					name: 'employees',
					data: employees
				},
				{
					id: '13',
					name: 'regions',
					data: regions
				},
				{
					id: '14',
					name: 'territories',
					data: territories
				}
			],
			queries: [
				{
					id: '11',
					name: 'Query 1',
					data: QUERY1
				},
				{
					id: '12',
					name: 'Query 2',
					data: QUERY2
				}
			]
		}
	},
	{
		id: '2',
		name: 'ShoppingDB',
		data: {
			tables: [
				{
					id: '21',
					name: 'categories',
					data: categories
				},
				{
					id: '22',
					name: 'customers',
					data: customers
				},
				{
					id: '23',
					name: 'order_details',
					data: order_details
				},
				{
					id: '24',
					name: 'orders',
					data: orders
				},
				{
					id: '25',
					name: 'products',
					data: products
				},
				{
					id: '26',
					name: 'shippers',
					data: shippers
				},
				{
					id: '27',
					name: 'suppliers',
					data: suppliers
				}
			],
			queries: [
				{
					id: '21',
					name: 'Query 1',
					data: QUERY3
				}
			]
		}
	}
];

const getData = (path) => {
	path = path.split('/');
	switch (path[1]) {
		case 'database':
			if (path.length === 2)
				return {
					status: 'success',
					data: dbs.map((db) => ({ id: db.id, name: db.name }))
				};
			else {
				let db = dbs.find((db) => db.id === path[2]);
				if (!!db) {
					if (path.length === 3)
						return {
							status: 'success',
							data: {
								tables: db.data.tables.map((table) => ({ id: table.id, name: table.name })),
								queries: db.data.queries.map((query) => ({ id: query.id, name: query.name }))
							}
						};
					else {
						db = db.data;
						switch (path[3]) {
							case 'query':
								const query = db.queries.find((query) => query.id === path[4]);
								if (!!query) {
									return {
										status: 'success',
										data: query
									};
								}
								break;
							case 'table':
								const table = db.tables.find((table) => table.id === path[4]);
								if (!!table) {
									return {
										status: 'success',
										data: table
									};
								}
						}
					}
				}
			}
		default:
			return {
				status: 'failed',
				msg: 'path does not exist'
			};
	}
};

const postData = (path, data) => {
	path = path.split('/');
	switch (path[1]) {
		case 'database':
			if (path.length === 2) {
				const db = {
					id: `${dbs.length + 1}`,
					name: data.name
				};
				dbs.push({
					...db,
					data: { queries: [], tables: [] }
				});
				return {
					status: 'success',
					data: db
				};
			} else if (path[3] === 'query') {
				const response = { status: 'success' };
				switch (data.code.toLowerCase()) {
					case QUERY1:
						response.data = {
							success: true,
							result: regions
						};
						break;
					case QUERY2:
						response.data = {
							success: true,
							result: employees.map(({ firstName, lastName }) => ({ firstName, lastName }))
						};
						break;
					case QUERY3:
						response.data = {
							success: true,
							result: [ { total: orders.length } ]
						};
						break;
					default:
						response.data = {
							success: false,
							msg: 'Syntax Error!'
						};
				}
				return response;
			}
		default:
			return {
				status: 'failed',
				msg: 'Invalid request!'
			};
	}
};

const fakexios = {
	get(path, params) {
		return new Promise((resolve, reject) => {
			if (isAuthorizedReq(params)) {
				const data = getData(path);
				if (data.status != 'failed') {
					resolve(data);
				} else {
					reject(data);
				}
			} else {
				reject({
					status: 'failed',
					msg: 'Unauthorized Request'
				});
			}
		});
	},
	post(path, params) {
		return new Promise((resolve, reject) => {
			if (isAuthorizedReq(params)) {
				const data = postData(path, params);
				if (data.status != 'failed') {
					resolve(data);
				} else {
					reject(data);
				}
			} else {
				reject({
					status: 'failed',
					msg: 'Unauthorized Request'
				});
			}
		});
	}
};
export default fakexios;
