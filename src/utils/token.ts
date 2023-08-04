const TOKEN_KEY = 'token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const setlocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getlocalStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {};
};
