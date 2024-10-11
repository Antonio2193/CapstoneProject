import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchUser.css';

const SearchUser = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token'); // Recupera il token dal localStorage
            const res = await fetch(`http://localhost:5000/api/v1/users/search?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Aggiungi il token all'header della richiesta
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Errore nella ricerca degli utenti');
            }
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewLibrary = (userId) => {
        // Naviga alla pagina della libreria di quell'utente
        navigate(`/user/${userId}/library`);
    };

    return (
        <div className="search-user-container">
            <h2 className="search-title">Cerca Utenti</h2>
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Cerca per nome o email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="search-button" disabled={loading}>
                    {loading ? 'Cercando...' : 'Cerca'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {users.length > 0 && (
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user._id} className="user-item">
                            <img src={user.avatar || 'default-avatar.png'} alt={`${user.name} avatar`} className="user-avatar" />
                            <span className="user-info">{user.name} ({user.email})</span>
                            <button onClick={() => handleViewLibrary(user._id)} className="view-library-button">Visualizza Libreria</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUser;
