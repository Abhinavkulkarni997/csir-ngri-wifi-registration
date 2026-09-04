import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatContainer from "./components/ChatContainer";
import RegistrationData from "./pages/RegistrationData";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter basename="/registrationform">
      <Routes>
        <Route
          path="/"
          element={<ChatContainer />}
        />
         <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/registrations"
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