import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "moonparty_auth";

export const setAuthCookie = (user) => {
  Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(user), { expires: 7 });
};

export const getAuthCookie = () => {
  const cookie = Cookies.get(AUTH_COOKIE_NAME);
  return cookie ? JSON.parse(cookie) : null;
};

export const removeAuthCookie = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
};
