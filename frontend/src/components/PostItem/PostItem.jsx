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
} from "../../data/fetch";
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
    liked,
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
  const [authorDetails, setAuthorDetails] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);

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

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/${author}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [author, token]);

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
      handleShowPopup("Commento aggiunto con successo!", "success");
    } catch (error) {
      console.error("Errore durante l'aggiunta del commento:", error);
      handleShowPopup("Errore durante l'aggiunta del commento.", "error");
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
        handleClose();
        setAggiornaPostList(!aggiornaPostList);
        handleShowPopup("Post aggiornato con successo!", "success");
      } else {
        console.error(
          "Errore durante l'aggiornamento del post:",
          response.status
        );
        handleShowPopup("Errore durante l'aggiornamento del post.", "error");
      }
    } catch (error) {
      console.error("Errore:", error);
      handleShowPopup("Errore durante l'aggiornamento del post.", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo post?")) {
      try {
        await deletePost(_id);
        handleShowPopup("Post eliminato!", "success");
        setAggiornaPostList(!aggiornaPostList);
      } catch (error) {
        console.error("Errore durante l'eliminazione del post:", error);
        handleShowPopup("Impossibile eliminare il post.", "error");
      }
    }
  };

  const handleLikePost = async () => {
    try {
      await likePost(_id);
      setAggiornaPostList((prev) => !prev);
      handleShowPopup("Hai messo un like al post!", "success");
    } catch (error) {
      console.error("Errore durante l'aggiunta del like:", error);
      handleShowPopup("Errore durante l'aggiunta del like.", "error");
    }
  };

  return (
    <Card className="blog-card bg-grigio">
      <Link to={`/post/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Text className="blog-card-text bg-grigio">{content}</Card.Text>
        </Card.Body>
      </Link>
      <Card.Footer className="blog-card-footer bg-grigio">
        <PostUser name={authorDetails.name} avatar={authorDetails.avatar} />
        {userInfo?._id === author && (
          <div className="button-container">
            <Button className="ms-2 icon-button bottone-bianco" onClick={handleEditPost}>
              <i className="fas fa-edit"></i> 
            </Button>
            <Button  onClick={handleDelete} className="icon-button bottone-rosso">
              <i className="fas fa-trash"></i> 
            </Button>
          </div>
        )}
        <div className="like-container">
          <button
            onClick={handleLikePost}
            className={`btn btn-like icon-button ${liked ? "liked-icon" : "default-icon"}`}
            disabled={liked}
          >
            <i className="fas fa-thumbs-up"></i>
          </button>
          <span>{likes.count || 0} likes</span>
        </div>
      </Card.Footer>

      <Card.Body className="comment-section">
        <h5>Commenti:</h5>
        {comments.length > 0 ? (
          <>
            {comments
              .slice(0, showAllComments ? comments.length : 3)
              .map((comment) => (
                <div key={comment._id} className="comment-container">
                  <p className="comment-text">
                    {comment.content} -{" "}
                    <span className="comment-author">{comment.author ? comment.author.name : "Anonimo"}</span>
                  </p>
                </div>
              ))}
            {comments.length > 3 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="bottone-viola"
              >
                <i className={`fas fa-chevron-${showAllComments ? "up" : "down"}`}></i>
                {showAllComments ? " Nascondi commenti" : " Mostra tutti i commenti"}
              </button>
            )}
          </>
        ) : (
          <p className="no-comments">Non ci sono commenti.</p>
        )}
      </Card.Body>

      <Card.Body className="new-comment-form">
        <Form onSubmit={handleNewComment} className="form-new-comment">
          <Form.Group controlId="formNewComment">
            <Form.Control
              type="text"
              placeholder="Scrivi un nuovo commento..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
              className="comment-input"
            />
          </Form.Group>
          <Button  type="submit" className="submit-comment bottone-bianco">
            Invia
          </Button>
        </Form>
      </Card.Body>

      <Modal show={show} onHide={handleClose} className="edit-post-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategory" className="mt-3 category-select">
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
            <Form.Group controlId="formContent" className="mt-3 content-textarea">
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
          <Button variant="secondary" onClick={handleClose} className="close-button">
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} className="save-changes-button">
            Salva Cambiamenti
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Popup messaggio personalizzato */}
      {showPopup && (
        <div className={`popup-message-login ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </Card>
  );
};

export default PostItem;
