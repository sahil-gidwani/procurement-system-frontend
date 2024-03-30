import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./components/common/NavBar";
import NotFound from "./pages/NotFound";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
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
import HistoricalInventory from "./pages/inventory/historical/HistoricalInventory";
import ForecastInventory from "./pages/inventory/forecast/ForecastInventory";
import OptimizeInventoryView from "./pages/inventory/optimize/OptimizeInventoryView";
import OptimizeInventoryCreate from "./pages/inventory/optimize/OptimizeInventoryCreate";
import OptimizeInventoryUpdate from "./pages/inventory/optimize/OptimizeInventoryUpdate";
import PurchaseRequisitionListProcurementOfficer from "./pages/purchase/requisition/PurchaseRequisitionListProcurementOfficer";
import PurchaseRequisitionView from "./pages/purchase/requisition/PurchaseRequisitionView";
import PurchaseRequisitionCreate from "./pages/purchase/requisition/PurchaseRequisitionCreate";
import PurchaseRequisitionUpdate from "./pages/purchase/requisition/PurchaseRequisitionUpdate";
import PurchaseRequisitionListVendor from "./pages/purchase/requisition/PurchaseRequisitionListVendor";
import SupplierBidListProcurementOfficer from "./pages/purchase/bid/SupplierBidListProcurementOfficer";
import SupplierBidViewProcurementOfficer from "./pages/purchase/bid/SupplierBidViewProcurementOfficer";
import SupplierBidRank from "./pages/purchase/bid/SupplierBidRank";
import SupplierBidListVendor from "./pages/purchase/bid/SupplierBidListVendor";
import SupplierBidCreate from "./pages/purchase/bid/SupplierBidCreate";
import SupplierBidViewVendor from "./pages/purchase/bid/SupplierBidViewVendor";
import SupplierBidUpdate from "./pages/purchase/bid/SupplierBidUpdate";

function App() {
  return (
    <div className="App flex flex-col">
      <Router>
        <NavBar />
        <div className="min-h-screen flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
                <Route path="create" element={<InventoryCreate />} />
                <Route path="view/:id" element={<InventoryView />} />
                <Route path="update/:id" element={<InventoryUpdate />} />
                <Route
                  path="historical/:id"
                  element={<HistoricalInventory />}
                />
                <Route path="forecast/:id" element={<ForecastInventory />} />
                <Route path="optimize/:id">
                  <Route path="" element={<OptimizeInventoryView />} />
                  <Route path="create" element={<OptimizeInventoryCreate />} />
                  <Route path="update" element={<OptimizeInventoryUpdate />} />
                </Route>
              </Route>
            </Route>
            <Route path="purchase">
              <Route path="requisition">
                <Route element={<ProtectedRoute role="procurement_officer" />}>
                  <Route
                    path="list"
                    element={<PurchaseRequisitionListProcurementOfficer />}
                  />
                  <Route
                    path="create/:inventory_id"
                    element={<PurchaseRequisitionCreate />}
                  />
                  <Route
                    path="view/:id"
                    element={<PurchaseRequisitionView />}
                  />
                  <Route
                    path="update/:id"
                    element={<PurchaseRequisitionUpdate />}
                  />
                </Route>
                <Route element={<ProtectedRoute role="vendor" />}>
                  <Route
                    path="vendor-list"
                    element={<PurchaseRequisitionListVendor />}
                  />
                </Route>
              </Route>
              <Route path="bid">
                <Route element={<ProtectedRoute role="procurement_officer" />}>
                  <Route
                    path="procurement-officer-list/:requisition_id"
                    element={<SupplierBidListProcurementOfficer />}
                  />
                  <Route
                    path="rank/:requisition_id"
                    element={<SupplierBidRank />}
                  />
                  <Route
                    path="procurement-officer-view/:id"
                    element={<SupplierBidViewProcurementOfficer />}
                  />
                </Route>
                <Route element={<ProtectedRoute role="vendor" />}>
                  <Route path="list" element={<SupplierBidListVendor />} />
                  <Route
                    path="create/:requisition_id"
                    element={<SupplierBidCreate />}
                  />
                  <Route path="view/:id" element={<SupplierBidViewVendor />} />
                  <Route path="update/:id" element={<SupplierBidUpdate />} />
                </Route>
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
