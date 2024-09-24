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
    /* console.log(formData) */
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
    })
    const data = await res.json();
    return data
}

export const newPost = async (formValue, cover) => {
    const formData = new FormData()
    formData.append('cover', cover)
    formData.append('category', formValue.category)
    formData.append('title', formValue.title)
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
    console.log(paramsId)
    const res = await fetch('http://localhost:5000/api/v1/blogPosts/' + paramsId, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json()
    console.log(data)
    return data
}

export const newComment = async (id, formValue) => {

    const res = await fetch(`http://localhost:5000/api/v1/blogPosts/${id}/comments`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(formValue)
    })
    const data = await res.json()
    return data
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

  
