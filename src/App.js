import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AuthContext } from "./shared/context/auth-context";
import useAuth from "./shared/hooks/auth-hook";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
            {token && (
              <Route path="places">
                <Route path="new" element={<NewPlace />} />
                <Route path=":placeId" element={<UpdatePlace />} />
              </Route>
            )}
            {!token && <Route path="/auth" element={<Auth />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
