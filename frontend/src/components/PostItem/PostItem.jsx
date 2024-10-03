import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PostUser from "../PostUser/PostUser";
import "./PostItem.css";
import { UserContext } from "../../context/UserContextProvider";
import { jwtDecode } from "jwt-decode";
import {
  deletePost,
  newComment,
  loadComments,
  likePost,
} from "../../data/fetch"; // Aggiungi likePost
import "@fortawesome/fontawesome-free/css/all.min.css";

const PostItem = (props) => {
  const {
    title,
    cover,
    author,
    _id,
    category,
    content,
    setAggiornaPostList,
    aggiornaPostList,
    likes,
    onLike,
    liked, // Nuovo props per sapere se il post è stato messo like
  } = props;

  const { token, userInfo } = useContext(UserContext);
  const decodedToken = jwtDecode(token);
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);
  const initialFormValue = {
    author: decodedToken.userId,
    content: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);
  const [newCommentText, setNewCommentText] = useState("");
  const [authorDetails, setAuthorDetails] = useState({}); // Stato per i dettagli dell'autore
  const [showAllComments, setShowAllComments] = useState(false); // Stato per mostrare tutti i commenti

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await loadComments(_id);
        setComments(commentsData.dati);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };
    fetchComments();
  }, [_id, aggiornaPostList]);

  // Effetto per caricare i dettagli dell'autore
  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/${author}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Aggiungi l'intestazione di autorizzazione
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAuthorDetails(data);
        } else {
          console.error(
            "Errore nel caricamento dei dettagli dell'autore:",
            response.status
          );
        }
      } catch (error) {
        console.error("Errore:", error);
      }
    };

    fetchAuthorDetails();
  }, [author, token]); // Aggiungi token alle dipendenze

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewComment = async (event) => {
    event.preventDefault();
    try {
      const newCommentResponse = await newComment(_id, {
        content: newCommentText,
      });
      setNewCommentText("");
      setAggiornaPostList((prev) => !prev);
      alert("Commento aggiunto con successo!"); // Notifica di successo
    } catch (error) {
      console.error("Errore durante l'aggiunta del commento:", error);
      alert("Errore durante l'aggiunta del commento."); // Notifica di errore
    }
  };

  const handleEditPost = () => {
    setFormValue({
      title: title,
      category: category,
      content: content,
    });
    handleShow();
  };

  const handleChangeFormValue = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/blogPosts/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formValue),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        console.log("Post aggiornato con successo:", updatedPost);
        handleClose();
        setAggiornaPostList(!aggiornaPostList);
      } else {
        console.error(
          "Errore durante l'aggiornamento del post:",
          response.status
        );
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo post?")) {
      try {
        await deletePost(_id);
        alert("Post eliminato!");
        setAggiornaPostList(!aggiornaPostList);
      } catch (error) {
        console.error("Errore durante l'eliminazione del post:", error);
        alert("Impossibile eliminare il post");
      }
    }
  };

  const handleLikePost = async () => {
    try {
      // Invia richiesta di "like" al backend
      await likePost(_id);
      setAggiornaPostList((prev) => !prev); // Ricarica i post per aggiornare i like
    } catch (error) {
      console.error("Errore durante l'aggiunta del like:", error);
    }
  };

  return (
    <Card className="blog-card">
      <Link to={`/post/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{content}</Card.Text>
        </Card.Body>
      </Link>
      <Card.Footer>
    <PostUser name={authorDetails.name} avatar={authorDetails.avatar} />
    {userInfo._id === author && (
        <>
            <Button variant="primary" className="ms-2" onClick={handleEditPost}>
                <i className="fas fa-edit"></i> {/* Icona di modifica */}
            </Button>
            <Button variant="warning" onClick={handleDelete}>
                <i className="fas fa-trash"></i> {/* Icona di eliminazione */}
            </Button>
        </>
    )}
    <div className="d-flex align-items-center mt-2">
        <button
            onClick={handleLikePost}
            className={`btn btn-outline-primary me-2 ${
                liked ? "text-primary" : ""
            }`}
            disabled={liked}
        >
            <i className={`fas fa-thumbs-up`}></i> Like
        </button>
        <span>{likes.count || 0} likes</span>
    </div>
</Card.Footer>

      {/* Mostra i commenti */}
      <Card.Body>
        <h5>Commenti:</h5>
        {comments.length > 0 ? (
          <>
            {comments
              .slice(0, showAllComments ? comments.length : 3)
              .map((comment) => (
                <div key={comment._id}>
                  <p>
                    {comment.content} -{" "}
                    {comment.author ? comment.author.name : "Anonimo"}
                  </p>
                </div>
              ))}
           {comments.length > 3 && (
    <button
        onClick={() => setShowAllComments(!showAllComments)}
        className="btn btn-link"
    >
        <i className={`fas fa-chevron-${showAllComments ? "up" : "down"}`}></i>
        {showAllComments ? " Nascondi commenti" : " Mostra tutti i commenti"}
    </button>
)}
          </>
        ) : (
          <p>Non ci sono commenti ancora.</p>
        )}
      </Card.Body>

      {/* Form per il nuovo commento */}
      <Card.Body>
        <Form onSubmit={handleNewComment}>
          <Form.Group controlId="formNewComment">
            <Form.Control
              type="text"
              placeholder="Scrivi un nuovo commento..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Invia
          </Button>
        </Form>
      </Card.Body>

      {/* Modale per l'edit del post */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategory" className="mt-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formValue.category}
                onChange={handleChangeFormValue}
              >
                <option value="Anime">Anime</option>
                <option value="Manga">Manga</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Contenuto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={formValue.content}
                onChange={handleChangeFormValue}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Salva Cambiamenti
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default PostItem;
