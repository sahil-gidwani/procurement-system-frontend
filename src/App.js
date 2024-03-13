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
import InventoryCreate from "./pages/inventory/InventoryCreate";
import InventoryView from "./pages/inventory/InventoryView";
import InventoryUpdate from "./pages/inventory/InventoryUpdate";
import HistoricalInventory from "./pages/inventory/HistoricalInventory";
import ForecastInventory from "./pages/inventory/ForecastInventory";
import OptimizeInventoryView from "./pages/inventory/OptimizeInventoryView";
import OptimizeInventoryCreate from "./pages/inventory/OptimizeInventoryCreate";
import OptimizeInventoryUpdate from "./pages/inventory/OptimizeInventoryUpdate";

function App() {
  return (
    <div className="App flex flex-col">
      <Router>
        <NavBar />
        <div className="min-h-screen flex-grow">
          <Routes>
            <Route path="/" element={<NotFound />} />
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
              <Route path="create" element={<InventoryCreate />}/>
              <Route path="view/:id" element={<InventoryView />} />
              <Route path="update/:id" element={<InventoryUpdate />} />
              <Route path="historical/:id" element={<HistoricalInventory />} />
              <Route path="forecast/:id" element={<ForecastInventory />} />
              <Route path="optimize/:id" element={<OptimizeInventoryView />} />
              <Route path="optimize/:id/create" element={<OptimizeInventoryCreate />} />
              <Route path="optimize/:id/update" element={<OptimizeInventoryUpdate />} />
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
