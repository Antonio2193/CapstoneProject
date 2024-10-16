import React, { useContext, useState, useEffect } from "react";
import { Button, Container, Modal, Form } from "react-bootstrap";
import { UserContext } from "../../context/UserContextProvider";
import { useSearchParams } from "react-router-dom";
import { login } from "../../data/fetch";
import PostList from "../../components/PostList/PostList";
import "./Home.css";

const Home = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { token, setToken, setUserInfo } = useContext(UserContext);
  const [show, setShow] = useState(false);

  // Stati per il popup personalizzato
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success o error
  const [showPopup, setShowPopup] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // Funzione per mostrare il popup
  const handleShowPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleLogin = async () => {
    try {
      const tokenObj = await login(formValue);
      if (tokenObj && tokenObj.token) {
        localStorage.setItem("token", tokenObj.token);
        setToken(tokenObj.token);
        setUserInfo(tokenObj.user); // Imposta le informazioni utente
        handleClose();
        handleShowPopup("Login effettuato con successo!", "success");
      } else {
        handleShowPopup("Credenziali non valide", "error");
      }
    } catch (error) {
      console.error(error);
      handleShowPopup("Errore: impossibile effettuare il login", "error");
    }
  };

  // Gestione dei parametri di ricerca per il login con Google
  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const avatar = searchParams.get("avatar");
    const email = searchParams.get("email");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);

      setUserInfo({
        name: name || "",
        avatar: avatar || "",
        email: email || "",
      });

      setTimeout(() => {
        setSearchParams({});
      }, 100);
    }
  }, [searchParams, setToken, setUserInfo, setSearchParams]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/login-google";
  };

  return (
    <Container fluid className={`home-container ${!token ? "with-bg" : "logged-in-gradient"}`}>
      {!token && <div className="overlay" />}
      <div className="content">
        <div className="home-content text-center mt-5">
          {!token && (
            <>
              <h1 className="blog-main-title mb-3">Benvenuto su OtakuWorld!</h1>
              <p className="mb-3 blog-main-content">
                Il mondo di anime e manga che stavi cercando!
              </p>
            </>
          )}
        </div>
        {!token && (
          <div className="text-center btn-login">
            <Button className = "bottone-rosso" onClick={handleShow}>
              Login
            </Button>
            or
            <Button className = "bottone-viola" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </div>
        )}

        {/* Modale di login */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>LOGIN</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className = "modale-colore">Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className = "modale-colore">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="your password"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bottone-rosso" onClick={handleClose}>
              Close
            </Button>
            <Button className="bottone-viola" onClick={handleLogin}>
              Login now
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Popup messaggio personalizzato */}
        {showPopup && (
          <div className={`popup-message-login ${popupType}`}>
            {popupMessage}
          </div>
        )}

        {/* Mostra il PostList solo se l'utente è loggato */}
        {token && <PostList />}
      </div>
    </Container>
  );
};

export default Home;
