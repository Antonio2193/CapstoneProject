import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import "./myLibrary.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const MyLibrary = () => {
  const { myLibrary, togglePrivacy, removeFromLibrary } = useContext(UserContext);
  
  // Stati per il popup personalizzato
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" o "error"
  const [showPopup, setShowPopup] = useState(false);

  // Funzione per mostrare il popup
  const handleShowPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleTogglePrivacy = async (id, type, isPrivate) => {
    try {
      await togglePrivacy(id, type, isPrivate);
      handleShowPopup(
        `Elemento reso ${isPrivate ? "privato" : "pubblico"} con successo!`,
        "success"
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento della privacy:", error);
      handleShowPopup("Errore durante l'aggiornamento della privacy.", "error");
    }
  };

  const handleRemoveFromLibrary = async (id, type) => {
    try {
      await removeFromLibrary(id, type);
      handleShowPopup("Elemento rimosso dalla libreria con successo!", "success");
    } catch (error) {
      console.error("Errore durante la rimozione dell'elemento:", error);
      handleShowPopup("Errore durante la rimozione dell'elemento.", "error");
    }
  };

  return (
    <div className="my-library">
      <h2>La Mia Libreria</h2>

      <h3>Anime</h3>
      {myLibrary.anime && myLibrary.anime.length > 0 ? (
        <div className="library-grid">
          {myLibrary.anime.map((anime) => (
            <div key={anime._id} className="library-card">
              <img src={anime.cover} alt={anime.title} />
              <h4>{anime.title}</h4>
              <p><strong>Episodes:</strong> {anime.episodes}</p>
              <p><strong>Producer:</strong> {anime.producer}</p>
              <p><strong>Start Date:</strong> {new Date(anime.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {anime.endDate ? new Date(anime.endDate).toLocaleDateString() : "Continuing"}</p>
              
              {/* Bottone Privacy */}
              <button
                className="privacy-button"
                onClick={() => handleTogglePrivacy(anime.originalID, "anime", !anime.isPrivate)}
              >
                <i className={`fas ${anime.isPrivate ? 'fa-eye-slash' : 'fa-eye'} fa-icon`}></i>
                {anime.isPrivate ? "Privato" : "Pubblico"}
              </button>
              
              {/* Bottone Elimina */}
              <button
                className="delete-button"
                onClick={() => handleRemoveFromLibrary(anime.originalID, 'anime')}
              >
                <i className="fas fa-trash-alt fa-icon"></i> Elimina
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">Nessun anime nella tua libreria.</p>
      )}

      <section className="manga-section">
        <h3>Manga</h3>
        {myLibrary.manga && myLibrary.manga.length > 0 ? (
          <div className="library-grid">
            {myLibrary.manga.map((manga) => (
              <div key={manga._id} className="library-card">
                <img src={manga.cover} alt={manga.title} />
                <h4>{manga.title}</h4>
                <p><strong>Chapters:</strong> {manga.chapters}</p>
                <p><strong>Volumes:</strong> {manga.volumes}</p>
                <p><strong>Author:</strong> {manga.author}</p>
                <p><strong>Start Date:</strong> {new Date(manga.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {manga.endDate ? new Date(manga.endDate).toLocaleDateString() : "Continuing"}</p>

                {/* Bottone Privacy */}
                <button
                  className="privacy-button"
                  onClick={() => handleTogglePrivacy(manga.originalID, "manga", !manga.isPrivate)}
                >
                  <i className={`fas ${manga.isPrivate ? 'fa-eye-slash' : 'fa-eye'} fa-icon`}></i>
                  {manga.isPrivate ? "Privato" : "Pubblico"}
                </button>
                
                {/* Bottone Elimina */}
                <button
                  className="delete-button"
                  onClick={() => handleRemoveFromLibrary(manga.originalID, 'manga')}
                >
                  <i className="fas fa-trash-alt fa-icon"></i> Elimina
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">Nessun manga nella tua libreria.</p>
        )}
      </section>

      {/* Popup messaggio personalizzato */}
      {showPopup && (
        <div className={`popup-message ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
