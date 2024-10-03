import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../MyLibrary/myLibrary.css';

const OtherUserLibrary = () => {
    const { userId } = useParams(); // Prendi l'userId dai parametri dell'URL
    const [library, setLibrary] = useState({ anime: [], manga: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const token = localStorage.getItem('token'); // Recupera il token dal localStorage
                const res = await fetch(`http://localhost:5000/api/v1/library/user/${userId}/myLibrary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Aggiungi il token di autorizzazione
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    throw new Error('Errore nel caricamento della libreria');
                }
                const data = await res.json();
                setLibrary(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [userId]);

    if (loading) {
        return <p>Caricamento libreria...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="my-library">
            <h2>Libreria di un altro utente</h2>

            <h3>Anime</h3>
            {library.anime && library.anime.length > 0 ? (
                <div className="library-grid">
                    {library.anime.map(anime => (
                        <div key={anime._id} className="library-card">
                            <img src={anime.cover} alt={anime.title} />
                            <h4>{anime.title}</h4>
                            <p><strong>Episodes:</strong> {anime.episodes}</p>
                            <p><strong>Producer:</strong> {anime.producer}</p>
                            <p><strong>Start Date:</strong> {new Date(anime.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {anime.endDate ? new Date(anime.endDate).toLocaleDateString() : 'Continuing'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Non ci sono anime nella libreria di questo utente.</p>
            )}

            <h3>Manga</h3>
            {library.manga && library.manga.length > 0 ? (
                <div className="library-grid">
                    {library.manga.map(manga => (
                        <div key={manga._id} className="library-card">
                            <img src={manga.cover} alt={manga.title} />
                            <h4>{manga.title}</h4>
                            <p><strong>Chapters:</strong> {manga.chapters}</p>
                            <p><strong>Volumes:</strong> {manga.volumes}</p>
                            <p><strong>Author:</strong> {manga.author}</p>
                            <p><strong>Start Date:</strong> {new Date(manga.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {manga.endDate ? new Date(manga.endDate).toLocaleDateString() : 'Continuing'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Non ci sono manga nella libreria di questo utente.</p>
            )}
        </div>
    );
};

export default OtherUserLibrary;
