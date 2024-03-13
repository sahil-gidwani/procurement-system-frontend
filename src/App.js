import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./components/common/NavBar";
import NotFound from "./pages/NotFound";
import Footer from "./components/common/Footer";
import Register from "./pages/accounts/Register";
import Login from "./pages/accounts/Login";
import PasswordReset from "./pages/accounts/PasswordReset";
import PasswordResetConfirm from "./pages/accounts/PasswordResetConfirm";
import ChangePassword from "./pages/accounts/ChangePassword";
import ProfileView from "./pages/accounts/ProfileView";
import ProfileUpdate from "./pages/accounts/ProfileUpdate";
import InventoryList from "./pages/inventory/InventoryList";
import DemoTable from "./pages/DemoTable";

function App() {
  return (
    <div className="App flex flex-col">
      <Router>
        <NavBar />
        <div className="min-h-screen flex-grow">
          <Routes>
            <Route path="/" element={<DemoTable />} />
            <Route path="accounts">
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="password-reset" element={<PasswordReset />} />
              <Route
                path="password-reset-confirm/:id/:token"
                element={<PasswordResetConfirm />}
              />
              <Route element={<ProtectedRoute />}>
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="profile" element={<ProfileView />} />
                <Route path="profile/update" element={<ProfileUpdate />} />
              </Route>
            </Route>
            <Route path="inventory">
              <Route element={<ProtectedRoute role="procurement_officer" />}>
              <Route path="list" element={<InventoryList />} />
              <Route path="create" element={<InventoryList />}/>
              <Route path="view/:id" element={<InventoryList />} />
              <Route path="update/:id" element={<InventoryList />} />
              <Route path="historical/:id" element={<InventoryList />} />
              <Route path="forecast/:id" element={<InventoryList />} />
              <Route path="optimize/:id" element={<InventoryList />} />
              <Route path="optimize/:id/create" element={<InventoryList />} />
              <Route path="optimize/:id/update" element={<InventoryList />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
