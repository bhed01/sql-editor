const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const setAccessToken = (accessToken) => {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const setIdToken = (idToken) => {
	localStorage.setItem(ID_TOKEN_KEY, idToken);
};

const clearToken = () => {
	localStorage.removeItem(ID_TOKEN_KEY);
	localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const login = (username, password) => {
	if (username == 'test' && password == 'test123') {
		setAccessToken('accesstoken');
		setIdToken('idtoken');
		return true;
	} else {
		clearToken();
		return false;
	}
};

export const logout = () => {
	clearToken();
};

export const getAccessToken = () => {
	return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getIdToken = () => {
	return localStorage.getItem(ID_TOKEN_KEY);
};

const isTokenExpired = () => {
	return false;
};

export const isLoggedIn = () => {
	const idToken = getIdToken();
	return !!idToken && !isTokenExpired();
};
