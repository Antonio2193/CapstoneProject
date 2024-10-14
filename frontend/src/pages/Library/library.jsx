import React, { useEffect, useState, useContext } from "react";
import {
  loadAnime,
  loadManga,
  addAnimeToLibrary,
  addMangaToLibrary,
  createAnime,
  createManga,
} from "../../data/fetch";
import { UserContext } from "../../context/UserContextProvider";
import { Form, Button } from "react-bootstrap";
import "./Library.css";

const Library = () => {
  const { token, userInfo, myLibrary, setMyLibrary, getMyLibrary } =
    useContext(UserContext);
  const [anime, setAnime] = useState([]);
  const [manga, setManga] = useState([]);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingManga, setLoadingManga] = useState(true);
  const [errorAnime, setErrorAnime] = useState(null);
  const [errorManga, setErrorManga] = useState(null);

  // Stato per il termine di ricerca
  const [searchTerm, setSearchTerm] = useState("");

  // Stato per forzare il re-render
  const [update, setUpdate] = useState(false);

  // Stato per gestire la visualizzazione del form
  const [showAddForm, setShowAddForm] = useState(false);

  // Stato per il nuovo item da aggiungere (anime o manga)
  const [newItem, setNewItem] = useState({
    title: "",
    cover: "",
    episodesOrChapters: "",
    producerOrAuthor: "",
    volumes: "",
    startDate: "",
    endDate: "",
    type: "anime", // Default 'anime'
  });

  // Stato per il messaggio popup
  const [popupMessage, setPopupMessage] = useState("");

  // Funzione per mostrare il messaggio
  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage(""); // Nascondi il messaggio dopo 3 secondi
    }, 3000);
  };

  useEffect(() => {
    const fetchAnime = async () => {
      setLoadingAnime(true);
      try {
        const response = await loadAnime();
        setAnime(response.dati);
      } catch (error) {
        setErrorAnime(error.message);
      } finally {
        setLoadingAnime(false);
      }
    };

    const fetchManga = async () => {
      setLoadingManga(true);
      try {
        const response = await loadManga();
        setManga(response.dati);
      } catch (error) {
        setErrorManga(error.message);
      } finally {
        setLoadingManga(false);
      }
    };

    if (token) {
      fetchAnime();
      fetchManga();
    }
  }, [token]);

  const handleAddAnime = async (animeId) => {
    if (!userInfo) {
      console.error("Utente non autenticato.");
      return;
    }

    try {
      const addedAnime = await addAnimeToLibrary(userInfo._id, animeId);
      showPopup("Anime aggiunto alla libreria!"); // Mostra il messaggio

      // Aggiorna la libreria locale
      setMyLibrary((prevLibrary) => ({
        ...prevLibrary,
        anime: [...(prevLibrary.anime || []), addedAnime],
      }));

      // Forza il re-render
      setUpdate((prev) => !prev);

      // Aggiorna la libreria dal backend
      await getMyLibrary();
    } catch (error) {
      console.error(
        "Errore nell'aggiungere l'anime alla libreria:",
        error.message
      );
    }
  };

  const handleAddManga = async (mangaId) => {
    if (!userInfo) {
      console.error("Utente non autenticato.");
      return;
    }

    try {
      const addedManga = await addMangaToLibrary(userInfo._id, mangaId);
      showPopup("Manga aggiunto alla libreria!"); // Mostra il messaggio

      // Aggiorna la libreria locale
      setMyLibrary((prevLibrary) => ({
        ...prevLibrary,
        manga: [...(prevLibrary.manga || []), addedManga],
      }));

      // Forza il re-render
      setUpdate((prev) => !prev);

      // Aggiorna la libreria dal backend
      await getMyLibrary();
    } catch (error) {
      console.error(
        "Errore nell'aggiungere il manga alla libreria:",
        error.message
      );
    }
  };

  // Verifica se un elemento è già in libreria
  const isInLibrary = (id, type) => {
    console.log(myLibrary[type]);
    console.log(id)
    return myLibrary[type] && myLibrary[type].some((item) => item._id === id);
  };

  // Funzione per filtrare anime e manga in base al termine di ricerca
  const filterItems = (items, searchTerm) => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Funzione per gestire l'invio del form
  const handleSubmitNewItem = async (e) => {
    e.preventDefault();
    try {
        let newLibraryItem;

        // Crea l'elemento in base al tipo selezionato
        if (newItem.type === "anime") {
            newLibraryItem = await createAnime({
                title: newItem.title,
                cover: newItem.cover,
                episodes: newItem.episodesOrChapters,
                producer: newItem.producerOrAuthor,
                startDate: newItem.startDate,
                endDate: newItem.endDate,
            });

            // Aggiorna solo la libreria generale (Library) con l'elemento appena creato
            setAnime((prevAnime) => [...prevAnime, newLibraryItem]);

        } else {
            newLibraryItem = await createManga({
                title: newItem.title,
                cover: newItem.cover,
                chapters: newItem.episodesOrChapters,
                volumes: newItem.volumes,
                author: newItem.producerOrAuthor,
                startDate: newItem.startDate,
                endDate: newItem.endDate,
            });

            // Aggiorna solo la libreria generale (Library) con l'elemento appena creato
            setManga((prevManga) => [...prevManga, newLibraryItem]);
        }

        // Mostra il messaggio di successo
        showPopup("Elemento aggiunto con successo!");

        // Chiudi il form di aggiunta
        setShowAddForm(false);

        // Pulisci i dati del nuovo elemento
        setNewItem({
            title: "",
            cover: "",
            episodesOrChapters: "",
            producerOrAuthor: "",
            volumes: "",
            startDate: "",
            endDate: "",
            type: "anime",
        });
    } catch (error) {
        console.error("Errore nell'aggiunta del nuovo elemento:", error.message);
    }
};


  // Filtra gli anime e manga in base al termine di ricerca
  const filteredAnime = filterItems(anime, searchTerm);
  const filteredManga = filterItems(manga, searchTerm);

  if (!token) {
    return <p>Devi essere autenticato per vedere la libreria.</p>;
  }

  return (
    <div className="library">
      <h1 className="h1-library">Libreria</h1>

      {/* Messaggio Popup */}
      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}

      {/* Search bar */}
      <Form.Group controlId="searchBar" className="mb-4 search-input">
        <Form.Control
          type="text"
          placeholder="Cerca anime o manga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </Form.Group>

      {/* Bottone per mostrare il form di aggiunta se non ci sono risultati */}
      {(filteredAnime.length === 0 || filteredManga.length === 0) && (
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          Aggiungi un nuovo anime o manga
        </Button>
      )}

      {/* Form per aggiungere un nuovo anime o manga */}
      {showAddForm && (
        <Form onSubmit={handleSubmitNewItem}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label className="add-M-A add-M-A-title">Title</Form.Label>
            <Form.Control
              type="text"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="formCover" className="mb-3">
            <Form.Label className="add-M-A">Cover URL</Form.Label>
            <Form.Control
              type="text"
              value={newItem.cover}
              onChange={(e) =>
                setNewItem({ ...newItem, cover: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formEpisodesOrChapters" className="mb-3">
            <Form.Label className="add-M-A">Episodes/Chapters</Form.Label>
            <Form.Control
              type="text"
              value={newItem.episodesOrChapters}
              onChange={(e) =>
                setNewItem({ ...newItem, episodesOrChapters: e.target.value })
              }
              required
            />
          </Form.Group>

          {newItem.type === "manga" && (
            <Form.Group controlId="formVolumes" className="mb-3">
              <Form.Label className="add-M-A">Volumes</Form.Label>
              <Form.Control
                type="text"
                value={newItem.volumes}
                onChange={(e) =>
                  setNewItem({ ...newItem, volumes: e.target.value })
                }
                required
              />
            </Form.Group>
          )}

          <Form.Group controlId="formProducerOrAuthor" className="mb-3">
            <Form.Label className="add-M-A">Producer/Author</Form.Label>
            <Form.Control
              type="text"
              value={newItem.producerOrAuthor}
              onChange={(e) =>
                setNewItem({ ...newItem, producerOrAuthor: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formStartDate" className="mb-3">
            <Form.Label className="add-M-A">Start Date</Form.Label>
            <Form.Control
              type="date"
              value={newItem.startDate}
              onChange={(e) =>
                setNewItem({ ...newItem, startDate: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formEndDate" className="mb-3">
            <Form.Label className="add-M-A">End Date</Form.Label>
            <Form.Control
              type="date"
              value={newItem.endDate}
              onChange={(e) =>
                setNewItem({ ...newItem, endDate: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formType" className="mb-3">
            <Form.Label className="add-M-A">Tipo</Form.Label>
            <Form.Control
              as="select"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            >
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Aggiungi
          </Button>
        </Form>
      )}

      <section>
        <h2>Anime</h2>
        {loadingAnime ? (
          <p>Caricamento anime...</p>
        ) : errorAnime ? (
          <p>Errore nel caricamento degli anime: {errorAnime}</p>
        ) : Array.isArray(filteredAnime) && filteredAnime.length > 0 ? (
          <div className="grid">
            {filteredAnime.map((item) => (
              <div className="library-card" key={item._id}>
                <img src={item.cover} alt={item.title} />
                <h3>{item.title}</h3>
                <p>
                  <strong>Episodes:</strong> {item.episodes}
                </p>
                <p>
                  <strong>Producer:</strong> {item.producer}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(item.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {item.endDate
                    ? new Date(item.endDate).toLocaleDateString()
                    : "Continuing"}
                </p>
                {!isInLibrary(item._id, "anime") && (
                  <button onClick={() => handleAddAnime(item._id)}>
                    Aggiungi a My Library
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nessun anime trovato.</p>
        )}
      </section>

      <section className="manga-section">
        <h2>Manga</h2>
        {loadingManga ? (
          <p>Caricamento manga...</p>
        ) : errorManga ? (
          <p>Errore nel caricamento dei manga: {errorManga}</p>
        ) : Array.isArray(filteredManga) && filteredManga.length > 0 ? (
          <div className="grid">
            {filteredManga.map((item) => (
              <div className="library-card" key={item._id}>
                <img src={item.cover} alt={item.title} />
                <h3>{item.title}</h3>
                <p>
                  <strong>Chapters:</strong> {item.chapters}
                </p>
                <p>
                  <strong>Volumes:</strong> {item.volumes}
                </p>
                <p>
                  <strong>Author:</strong> {item.author}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(item.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {item.endDate
                    ? new Date(item.endDate).toLocaleDateString()
                    : "Continuing"}
                </p>
                {!isInLibrary(item._id, "manga") && (
                  <button onClick={() => handleAddManga(item._id)}>
                    Aggiungi a My Library
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nessun manga trovato.</p>
        )}
      </section>
    </div>
  );
};

export default Library;
