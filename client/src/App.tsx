import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatContainer from "./components/ChatContainer";
import RegistrationData from "./pages/RegistrationData";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ChatContainer />}
        />
         <Route
          path="/wifi-admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/registrations"
          element={
          <ProtectedRoute>
            <RegistrationData />
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;