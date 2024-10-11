import Home from './pages/Home/Home';
import NavBar from './components/Navbar/NavBar';
import './App.css';
import UserContextProvider from './context/UserContextProvider';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewPost from './pages/NewPost/New';
import Post from './pages/PostDetails/postDetails';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Library from './pages/Library/library';
import MyLibrary from './pages/MyLibrary/myLibrary';
import SearchUser from './pages/SearchUser/SearchUser';  
import OtherUserLibrary from './pages/OtherUserLibrary/OtherUserLibrary';

function App() {
  return (
       <UserContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/library" element={<Library />} />
          <Route path="/mylibrary" element={<MyLibrary />} />
          <Route path="/search" element={<SearchUser />} /> {/* Rotta per cercare utenti */}
          <Route path="/user/:userId/library" element={<OtherUserLibrary />} /> {/* Rotta per vedere la libreria di un altro utente */}
        </Routes>
       {/*  <Footer /> */}
      </Router>
    </UserContextProvider>
    
  );
}

export default App;
