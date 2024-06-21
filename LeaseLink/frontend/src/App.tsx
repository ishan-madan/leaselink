import Header from "./components/Header"
import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Chat from "./pages/Chat"
import NotFound from "./pages/NotFound"
import Incident from "./pages/Incident"
import { useAuth } from "./context/AuthContext"

function App() {
  

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:incidentId" element={<Chat />} />
        <Route path="/incidents" element={<Incident />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
