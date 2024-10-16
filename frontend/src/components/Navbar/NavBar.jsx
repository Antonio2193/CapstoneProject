import React, { useContext, useState } from "react";
import { Button, Container, Navbar, Modal, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { UserContext } from "../../context/UserContextProvider";
import { register } from "../../data/fetch";

const NavBar = (props) => {
  const { token, setToken } = useContext(UserContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [showReg, setShowReg] = useState(false);

  const handleCloseReg = () => setShowReg(false);
  const handleShowReg = () => setShowReg(true);

  const initialRegistrationFormValue = {
    name: "",
    surname: "",
    avatar: "",
    password: "",
    email: "",
  };

  const [regFormValue, setRegFormValue] = useState(initialRegistrationFormValue);
  const [avatar, setAvatar] = useState("");

  const handleChangeRegistration = (event) => {
    setRegFormValue({
      ...regFormValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    setAvatar(event.target.files[0]);
  };

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

  const handleRegister = async () => {
    const res = await register(regFormValue, avatar);
    handleCloseReg();
    setRegFormValue(initialRegistrationFormValue);

    // Verifica della presenza di un ID per confermare la registrazione
    if (res && res._id) {
      handleShowPopup("Registrazione effettuata con successo!", "success");
    } else {
      handleShowPopup("Errore nella registrazione", "error");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="blog-navbar-title">OtakuWorld!</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <div className="d-flex align-items-center ms-auto">
            {token && (<Link to="/library" className="navbar-link ms-3">Library</Link>)}
            {token && (<Link to="/mylibrary" className="navbar-link ms-3">La Mia Libreria</Link>)}
            {token && (<Link to="/search" className="navbar-link ms-3">Cerca Utenti</Link>)}

            {!token && (
              <Button className="ms-3 bottone-rosso" variant="secondary" onClick={handleShowReg}>
                Registrati
              </Button>
            )}

            {token && (
              <Button as={Link} to="/new" className="bottone-rosso">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
                Post
              </Button>
            )}

            {token && (
              <Button className="ms-2 me-2 logout bottone-bianco"  onClick={handleLogout}>
                Logout
              </Button>
            )}
            
            {userInfo && <Image src={userInfo.avatar} className="userAvatar me-2" />}
          </div>
        </Navbar.Collapse>
      </Container>

      {/* Modal per la registrazione */}
      <Modal show={showReg} onHide={handleCloseReg}>
        <Modal.Header closeButton>
          <Modal.Title>REGISTRAZIONE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={regFormValue.email}
                onChange={handleChangeRegistration}
                placeholder="nome@esempio.com"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={regFormValue.password}
                onChange={handleChangeRegistration}
                placeholder="la tua password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={regFormValue.name}
                onChange={handleChangeRegistration}
                placeholder="il tuo nome"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={regFormValue.surname}
                onChange={handleChangeRegistration}
                placeholder="il tuo cognome"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                name="avatar"
                onChange={handleChangeImage}
                placeholder="la tua immagine"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReg}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            Registrati ora
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Popup messaggio personalizzato */}
      {showPopup && (
        <div className={`popup-message-login ${popupType}`}>
          {popupMessage}
        </div>
      )}
    </Navbar>
  );
};

export default NavBar;
