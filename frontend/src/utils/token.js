import Cookies from 'universal-cookie';


const cookies = new Cookies();


export const getAccessToken = () => {
  return cookies.get('accessTk');
};

export const setTokens = (tokens) => {
  cookies.set('accessTk', tokens.accessToken, { path: '/', maxAge: 31556952 /* 1 year */ });   
  cookies.set('refreshTk', tokens.refreshToken, { path: '/', maxAge: 31556952 /* 1 year */ });   
};

export const deleteTokens = () => {
  cookies.remove("accessTk");
  cookies.remove("refreshTk");
};


export const getAuthorizationHeader = () => {
  const token = cookies.get('accessTk'); 

  return {
    Authorization: `Bearer ${token}`,
  };
};