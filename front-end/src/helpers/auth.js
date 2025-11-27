
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
//  tại sao lại dùng const TOKEN_KEY = 'auth_token'; const USER_KEY = 'user_data';


export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);//có tác dụng gì 
};
// localStorage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};
    
export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => { 
    const token = getToken();
    const user = getUser();
    return !!(token && user);
};

export const logout = () => {
    removeToken();
    removeUser();
};


export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Date.now() / 1000;
        
        return expiry < now;
    } catch (error) {
        return true;
    }
};

export const getUserDisplayName = () => {
    const user = getUser();
    return user ? (user.fullName || user.username) : 'Guest';
};

export const saveAuthData = (token, user) => {
    saveToken(token);
    saveUser(user);
};

export const clearAuthData = () => {
    logout();
};
