import axios from 'axios';
import dbs from '@/assets/dbs.json';

const QUERY1 = 'select * from regions;';
const QUERY2 = 'select firstname, lastname from employees;';
const QUERY3 = 'select count(*) as total from orders;';

const getURL = (db, table) => {
	return `https://raw.githubusercontent.com/bhed01/sql-editor/main/db/${db}/${table}.json`;
};

const isAuthorizedReq = (params) => {
	return (
		!!params &&
		!!params.headers &&
		!!params.headers.Authorization &&
		params.headers.Authorization == 'Bearer accesstoken'
	);
};

async function getData(path) {
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
						switch (path[3]) {
							case 'query':
								const query = db.data.queries.find((query) => query.id === path[4]);
								if (!!query) {
									return {
										status: 'success',
										data: query
									};
								}
								break;
							case 'table':
								const table = db.data.tables.find((table) => table.id === path[4]);
								if (!!table) {
									const res = await axios.get(getURL(db.name, table.name));
									return {
										status: 'success',
										data: {
											...table,
											data: res.data
										}
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
}

async function postData(path, data) {
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
				let res = null;
				switch (data.code.toLowerCase()) {
					case QUERY1:
						res = await axios.get(getURL('EmployeeDB', 'regions'));
						response.data = {
							success: true,
							result: res.data
						};
						break;
					case QUERY2:
						res = await axios.get(getURL('EmployeeDB', 'employees'));
						response.data = {
							success: true,
							result: res.data.map(({ firstName, lastName }) => ({
								firstName,
								lastName
							}))
						};
						break;
					case QUERY3:
						response.data = {
							success: true,
							result: [ { total: 860 } ]
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
}

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
