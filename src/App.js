import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import NavBar from "./component/NavBar";
import NotFound from "./container/NotFound";
import Footer from "./component/Footer";
import Login from "./container/Login";
import Profile from "./container/Profile";
import ChangePassword from "./container/ChangePassword";
import Loading from "./container/Loading";

function App() {
  return (
    <div className="App flex flex-col">
      <Router>
        <NavBar />
        <div className="flex-grow min-h-screen">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/loading" element={<Loading />} />
            {/* <Route path="/signup" element={<SignUp />} /> */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
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
