import Cookies from 'universal-cookie';


const cookies = new Cookies();



export const getAccessToken = () => {
  return cookies.get('accessTk');
};

export const getRefreshToken = () => {
  return cookies.get('refreshTk');
};

export const getRole = () => {
  return cookies.get('role');
};

export const setTokensAndRole = (accessToken, refreshToken, role) => {
  cookies.set('accessTk', accessToken, { path: '/', maxAge: 31556952 /* 1 year */ });
  cookies.set('refreshTk', refreshToken, { path: '/', maxAge: 31556952 /* 1 year */ });
  
  cookies.set('role', role, { path: '/', maxAge: 31556952 /* 1 year */ });
};

export const deleteTokensAndRole = () => {
  cookies.remove("accessTk");
  cookies.remove("refreshTk");
  
  cookies.remove("role");
};


export const getAuthorizationHeader = () => {
  const token = cookies.get('accessTk');

  return {
    Authorization: `Bearer ${token}`,
  };
};