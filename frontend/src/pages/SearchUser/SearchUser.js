import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Cerca Utenti</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Cerca per nome o email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Cercando...' : 'Cerca'}
                </button>
            </form>

            {error && <p>{error}</p>}

            {users.length > 0 && (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar || 'default-avatar.png'} alt={`${user.name} avatar`} width="40" />
                            <span>{user.name} ({user.email})</span>
                            <button onClick={() => handleViewLibrary(user._id)}>Visualizza Libreria</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUser;
