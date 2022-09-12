import React, { useState, useCallback } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
            {isLoggedIn && (
              <Route path="places">
                <Route path="new" element={<NewPlace />} />
                <Route path=":placeId" element={<UpdatePlace />} />
              </Route>
            )}
            {!isLoggedIn && <Route path="/auth" element={<Auth />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
