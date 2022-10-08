import { useEffect, useState, useCallback } from "react";

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpDate, setTokenExpDate] = useState();

  const login = useCallback((uid, token, expData) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate =
      expData || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        exp: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.exp) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.exp));
    }
  }, [login]);

  return { token, login, logout, userId };
};

export default useAuth;
