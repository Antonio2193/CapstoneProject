import React, { useContext } from "react";
import { UserContext } from "../../context/UserContextProvider";
import "./myLibrary.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const MyLibrary = () => {
  const { myLibrary, togglePrivacy, removeFromLibrary } = useContext(UserContext);

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
              <button className="privacy-button" onClick={() => togglePrivacy(anime._id, "anime", !anime.isPrivate)}>
                <i className={`fas ${anime.isPrivate ? 'fa-eye-slash' : 'fa-eye'} fa-icon`}></i>
                {anime.isPrivate ? "Privato" : "Pubblico"}
              </button>
              
              {/* Bottone Elimina */}
              <button className="delete-button" onClick={() => removeFromLibrary(anime._id, 'anime')}>
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
              <button className="privacy-button" onClick={() => togglePrivacy(manga._id, "manga", !manga.isPrivate)}>
                <i className={`fas ${manga.isPrivate ? 'fa-eye-slash' : 'fa-eye'} fa-icon`}></i>
                {manga.isPrivate ? "Privato" : "Pubblico"}
              </button>
              
              {/* Bottone Elimina */}
              <button className="delete-button" onClick={() => removeFromLibrary(manga._id, 'manga')}>
                <i className="fas fa-trash-alt fa-icon"></i> Elimina
              </button>
            </div>
          ))}
        </div>
        
      ) : (
        <p className="empty-message">Nessun manga nella tua libreria.</p>
      )}
      </section>
    </div>
  );
};

export default MyLibrary;
