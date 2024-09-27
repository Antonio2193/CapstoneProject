import React, { useContext, useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PostUser from "../PostUser/PostUser";
import "./PostItem.css";
import { UserContext } from "../../context/UserContextProvider";
import { jwtDecode } from "jwt-decode";
import { deletePost, newComment, loadComments } from "../../data/fetch";

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
  } = props;

  const { token, userInfo } = useContext(UserContext);
  const decodedToken = jwtDecode(token);
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);
  const initialFormValue = {
    author: decodedToken.userId,
    content: ""
  };
  const [formValue, setFormValue] = useState(initialFormValue);

  const [newCommentText, setNewCommentText] = useState("");

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
    } catch (error) {
        console.error("Errore durante l'aggiunta del commento:", error);
    }
};


  /* const decodedToken = jwtDecode(token); */

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
        console.log("Post updated successfully:", updatedPost);
        handleClose();
        setAggiornaPostList(!aggiornaPostList);
      } else {
        console.error("Error updating the post:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
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

 

  return (
    <Card className="blog-card">
      <Link to={`/blog/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{content}</Card.Text>
        </Card.Body>
      </Link>
      <Card.Footer>
        <PostUser {...author} />
        {userInfo._id === author && (
          <>
            <Button variant="success" className="ms-2" onClick={handleEditPost}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Card.Footer>

      {/* Mostra i commenti */}
      <Card.Body>
      
        <h5>Commenti:</h5>
        {comments.length > 0 ? (
  comments.map((comment) => (
    <div key={comment._id}>
      <p>
        {comment.content} - {comment.author ? comment.author.name : "Anonimo"} {/* Qui mostri il nome dell'autore */}
      </p>
    </div>
  ))
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
              <Form.Label>Category</Form.Label>
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
              <Form.Label>Content</Form.Label>
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
  
};


export default PostItem;
