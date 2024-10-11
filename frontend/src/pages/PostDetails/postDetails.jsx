import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Image,
  Modal,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PostUser from "../../components/PostUser/PostUser.jsx"; // Componente che mostra nome e avatar dell'autore
import {
  loadPost,
  newComment,
  loadComments,
  deleteComment,
  updateComment,
  loadAuthorDetails,
} from "../../data/fetch.js";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../context/UserContextProvider.jsx";
import "./postDetails.css";

const Post = () => {
  const [editMode, setEditMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [authorDetails, setAuthorDetails] = useState(null); // Stato per memorizzare i dettagli dell'autore
  const { token } = useContext(UserContext);
  const decodedToken = token ? jwtDecode(token) : null;
  const authorIdFromToken = decodedToken ? decodedToken.userId : null;
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormValue(initialFormState);
  };

  const handleShow = () => setShow(true);

  const initialFormState = {
    content: "",
    post: id,
    author: authorIdFromToken,
  };
  const [formValue, setFormValue] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSaveComment = async () => {
    try {
      if (editMode) {
        await updateComment(id, editCommentId, formValue);
      } else {
        await newComment(id, formValue);
      }
      const commentsRes = await loadComments(id);
      setComments(commentsRes.dati);
      setFormValue(initialFormState);
      handleClose();
    } catch (error) {
      console.error("Errore durante il salvataggio del commento:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditMode(true);
    setEditCommentId(comment._id);
    setFormValue({ ...formValue, content: comment.content });
    handleShow();
  };

  const handleShowConfirmModal = (commentId) => {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setCommentToDelete(null);
    setShowConfirmModal(false);
  };

  const confirmDeleteComment = async () => {
    await deleteComment(id, commentToDelete);
    const commentsRes = await loadComments(id);
    setComments(commentsRes.dati);
    handleCloseConfirmModal();
  };

  useEffect(() => {
    const PostDetails = async () => {
      try {
        const res = await loadPost(id);
        const commentsRes = await loadComments(id);

        if (res) {
          setPost(res);
          setComments(commentsRes.dati);

          // Carica i dettagli dell'autore in base all'ID
          const authorRes = await loadAuthorDetails(res.author);
          setAuthorDetails(authorRes);
          setLoading(false);

        } else {
          navigate("/not-found");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    PostDetails();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={post.cover} fluid />
          <h1 className="blog-details-title">{post.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              {/* Mostra i dettagli dell'autore usando il componente PostUser */}
              {authorDetails ? (
                <PostUser
                  name={authorDetails.name}
                  avatar={authorDetails.avatar}
                />
              ) : (
                <div>Loading author details...</div>
              )}
            </div>
            <div className="blog-details-info">
              <div>{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

          <div className="mt-5">Post comments:</div>
          <Row>
            {comments.map((comment) => (
              <Col
                key={comment._id}
                md={8}
                className="mb-3 comment"
                style={{ marginBottom: 20 }}
              >
                <div className="mt-2 border rounded bg-light">
                  {comment.content}
                </div>
                <div className="mt-2 border rounded bg-light">
                  {comment.author.name}
                  {comment.author._id === authorIdFromToken && (
                    <>
                      <i
                        className="fa-solid fa-pen"
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => handleEditComment(comment)}
                      ></i>
                      <i
                        className="fa-solid fa-trash"
                        style={{ cursor: "pointer", marginLeft: 10 }}
                        onClick={() => handleShowConfirmModal(comment._id)}
                      ></i>
                    </>
                  )}
                </div>
              </Col>
            ))}
          </Row>

          <Button onClick={handleShow}>Add Comment</Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editMode ? "Edit Comment" : "Add Comment"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your comment"
                    name="content"
                    value={formValue.content}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveComment}>
                {editMode ? "Save Changes" : "Post Comment"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal di conferma eliminazione */}
          <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this comment?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Close
              </Button>
              <Button variant="danger" onClick={confirmDeleteComment}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }
};

export default Post;
