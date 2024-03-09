import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./components/common/NavBar";
import NotFound from "./pages/NotFound";
import Footer from "./components/common/Footer";
import Register from "./pages/accounts/Register";
import Login from "./pages/accounts/Login";
import ChangePassword from "./pages/accounts/ChangePassword";
import Loading from "./pages/Loading";

function App() {
  return (
    <div className="App flex flex-col">
      <Router>
        <NavBar />
        <div className="flex-grow min-h-screen">
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="accounts">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                {/* <Route path="profile" element={<Profile />} /> */}
                <Route path="change-password" element={<ChangePassword />} />
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
