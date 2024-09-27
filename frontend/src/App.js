import Home from './pages/Home/Home';
import NavBar from './components/Navbar/NavBar';
import './App.css';
import UserContextProvider from './context/UserContextProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewPost from './pages/NewPost/New';

function App() {
  return (
       <UserContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/new" element={<NewPost />} />
        </Routes>
       {/*  <Footer /> */}
      </Router>
    </UserContextProvider>
    
  );
}

export default App;
