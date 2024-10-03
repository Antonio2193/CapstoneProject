import { useState, createContext, useEffect } from "react";
import { me, loadUserLibrary } from "../data/fetch";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState();
  const [myLibrary, setMyLibrary] = useState({ anime: [], manga: [] }); // Inizializza myLibrary con anime e manga

  const getME = async () => {
    try {
      const meInfo = await me();
      setUserInfo(meInfo);
      console.log(meInfo);
    } catch (error) {
      if (error.message === "401") {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };

  const getMyLibrary = async () => {
    if (token && userInfo) {
      try {
        const libraryData = await loadUserLibrary(userInfo._id); // Funzione per caricare la MyLibrary
        setMyLibrary(libraryData);
      } catch (error) {
        console.error("Errore nel caricamento della libreria dell'utente:", error);
      }
    }
  };

  // Nuova funzione per aggiornare myLibrary con un anime aggiunto
  const addAnimeToMyLibrary = (addedAnime) => {
    setMyLibrary(prevLibrary => ({
      ...prevLibrary,
      anime: [...prevLibrary.anime, addedAnime]
    }));
  };

  // Nuova funzione per aggiornare myLibrary con un manga aggiunto
  const addMangaToMyLibrary = (addedManga) => {
    setMyLibrary(prevLibrary => ({
      ...prevLibrary,
      manga: [...prevLibrary.manga, addedManga]
    }));
  };

  // Effetto per ottenere i dati dell'utente
  useEffect(() => {
    if (token) getME();
  }, [token]);
  
  // Effetto per caricare la MyLibrary quando userInfo è disponibile
  useEffect(() => {
    if (userInfo) getMyLibrary(); // Assicurati che userInfo sia disponibile prima di chiamare getMyLibrary
  }, [userInfo]);

  const value = { 
    token, 
    setToken, 
    userInfo, 
    setUserInfo, 
    myLibrary, 
    setMyLibrary,
    addAnimeToMyLibrary, // Aggiungiamo queste funzioni per aggiornarle globalmente
    addMangaToMyLibrary 
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
