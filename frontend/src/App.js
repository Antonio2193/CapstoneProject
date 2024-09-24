import Home from './pages/Home';
import NavBar from './components/NavBar';
import './App.css';
import UserContextProvider from './context/UserContextProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
       <UserContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
        </Routes>
       {/*  <Footer /> */}
      </Router>
    </UserContextProvider>
    
  );
}

export default App;
