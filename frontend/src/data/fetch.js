export const me = async () => {
    const res = await fetch('http://localhost:5000/api/v1/auth/me',
        {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    );
    if (!res.ok) {
        throw new Error(res.status);
    }
    const data = await res.json();
    return data;
}

export const register = async (regFormValue, avatar) => {
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('name', regFormValue.name)
    formData.append('surname', regFormValue.surname)
    formData.append('email', regFormValue.email)
    formData.append('password', regFormValue.password)
    
    try {
        const res = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            body: formData
        })
        const data = await res.json();
        return data
    } catch (error) {
        console.log(error)
    }

}

export const login = async (formValue) => {
    try {
        const res = await fetch('http://localhost:5000/api/v1/auth/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formValue)
        })
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            const errorData = await res.json();
            return { error: errorData.message };
        }
    } catch (error) {
        return { error: error.message };
    }
}


export const loadPosts = async (search, page = 1, perPage = 9) => {
    const urlBase = 'http://localhost:5000/api/v1/blogPosts';
    const searchParam = search ? `&title=${search}` : '';
    const url = `${urlBase}?page=${page}&perPage=${perPage}${searchParam}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    const data = await res.json();
    
    return data;
  };
  

  export const loadComments = async (id) => {
    const res = await fetch(`http://localhost:5000/api/v1/blogPosts/${id}/comments`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    });
    const data = await res.json();
    return data;
}

export const newPost = async (formValue, cover) => {
    const formData = new FormData()
    formData.append('cover', cover)
    formData.append('category', formValue.category)
    formData.append('readTime', JSON.stringify(formValue.readTime))
    formData.append('author', formValue.author)
    formData.append('content', formValue.content)
    const res = await fetch('http://localhost:5000/api/v1/blogPosts', {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        method: "POST",
        body: formData
    })
    const data = await res.json()
    return data
}

export const loadPost = async (paramsId) => {
    // carica un post specifico presente nel blog 
    const res = await fetch('http://localhost:5000/api/v1/blogPosts/' + paramsId, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json()
    return data
}

export const newComment = async (id, formValue) => {
    const res = await fetch(`http://localhost:5000/api/v1/blogPosts/${id}/comments`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(formValue) // Assicurati che formValue abbia i campi corretti
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la creazione del commento");
    }

    const data = await res.json();
    return data;
}

export const updateComment = async (blogpostId, commentId, updatedCommentData) => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/blogPosts/${blogpostId}/comment/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`, // Invia il token JWT per autenticazione
            },
            body: JSON.stringify(updatedCommentData), // Il nuovo contenuto del commento
        });

        if (!response.ok) {
            throw new Error("Errore durante l'aggiornamento del commento");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore nell'update del commento:", error);
        throw error;
    }
};

export const deleteComment = async (blogpostId, commentId) => {
    const response = await fetch(`http://localhost:5000/api/v1/blogPosts/${blogpostId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
            // Assicurati di avere il token corretto
        },
    });
}

export const deletePost = async (postId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/v1/blogPosts/${postId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            method: "DELETE",
        })
        if (res.ok) {
            console.log(`Post con ID ${postId} eliminato con successo.`);
        } else {
            const errorData = await res.json()
            console.error(`Errore: ${errorData.message}`);
        }
    } catch (error) {
        console.error(`Errore durante l'eliminazione del post: ${error.message}`);
    }
}

export const loadAuthorDetails = async (authorId) => {
    const token = localStorage.getItem('token'); // Recupera il token dal local storage
    try {
        const response = await fetch(`http://localhost:5000/api/v1/users/${authorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Aggiungi il token nell'header
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const authorDetails = await response.json();
        return authorDetails;
    } catch (error) {
        console.error("Errore nel caricamento dei dettagli dell'autore:", error);
        throw error; 
    }
};

export const likePost = async (postId) => {
    const response = await fetch(`http://localhost:5000/api/v1/blogPosts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Errore nel mettere il like al post");
    }
  
    return await response.json();
};

export const loadAnime = async () => {
    const res = await fetch('http://localhost:5000/api/v1/library/anime', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    if (!res.ok) {
        throw new Error('La risposta della rete non è stata ok: ' + res.statusText);
    }

    const data = await res.json();
    return data;
};

export const loadManga = async () => {
    const res = await fetch('http://localhost:5000/api/v1/library/manga', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    if (!res.ok) {
        throw new Error('La risposta della rete non è stata ok: ' + res.statusText);
    }

    const data = await res.json();
    return data;
};
  
 export const loadUserLibrary = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/v1/library/user/${userId}/myLibrary`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    
    if (!res.ok) {
        throw new Error('Errore nel caricamento della MyLibrary: ' + res.statusText);
    }

    return await res.json();
};

// Funzione per aggiungere un anime alla libreria
export const addAnimeToLibrary = async (userId, animeId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/v1/library/user/${userId}/anime`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ animeId })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server response:', errorText);
            throw new Error(`Errore nell'aggiunta dell'anime alla libreria: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Errore nell\'aggiungere l\'anime alla libreria:', error);
        throw error; // Rilancia l'errore per la gestione successiva
    }
};


export const addMangaToLibrary = async (userId, mangaId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/library/user/${userId}/manga`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Aggiungi l'header di autorizzazione
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mangaId }), // Assicurati di inviare il mangaId
        });

        if (!response.ok) {
            const errorText = await response.text(); // Ottieni il testo di errore dal server
            console.error('Server response:', errorText);
            throw new Error(`Errore nell'aggiunta del manga alla libreria: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data; // Ritorna i dati per la gestione successiva
    } catch (error) {
        console.error('Errore nell\'aggiungere il manga alla libreria:', error);
        throw error; // Rilancia l'errore per la gestione successiva
    }
};

// Funzione per creare un nuovo anime
export const createAnime = async (animeData) => {
    try {
        const res = await fetch('http://localhost:5000/api/v1/library/anime', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(animeData)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server response:', errorText);
            throw new Error(`Errore nell'aggiunta dell'anime: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Errore nell\'aggiungere l\'anime:', error);
        throw error;
    }
};

// Funzione per creare un nuovo manga
export const createManga = async (mangaData) => {
    try {
        const res = await fetch('http://localhost:5000/api/v1/library/manga', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mangaData)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server response:', errorText);
            throw new Error(`Errore nell'aggiunta del manga: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Errore nell\'aggiungere il manga:', error);
        throw error;
    }
};

export const updatePrivacy = async (userId, itemId, { isPrivate }) => { // Destruttura l'oggetto
    console.log("Valori inviati:", { userId, itemId, isPrivate }); // Log per debug
    const res = await fetch(`http://localhost:5000/api/v1/library/user/${userId}/myLibrary/${itemId}/privacy`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPrivate }) // Invia solo isPrivate
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Errore dal server:', errorText);
        throw new Error('Errore nell\'aggiornamento della privacy');
    }

    return await res.json();
};




