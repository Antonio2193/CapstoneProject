import { Button, Container, Modal, Form } from "react-bootstrap";
import "./Home.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContextProvider";
import { useSearchParams, Link } from "react-router-dom";
import { login } from "../../data/fetch";
import PostList from "../../components/PostList/PostList";

const Home = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { token, setToken, setUserInfo } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const tokenObj = await login(formValue); // Ottieni il token da mettere nel localStorage
      console.log(tokenObj);
      if (tokenObj && tokenObj.token) {
        localStorage.setItem("token", tokenObj.token);
        setToken(tokenObj.token);
        handleClose();
        alert("Login effettuato con successo");
      } else {
        alert("Credenziali non valide");
      }
    } catch (error) {
      console.log(error);
      alert(error + " errore");
    }
  };

  // Gestione dei parametri di ricerca per il login con Google
  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const email = searchParams.get('email');
    console.log("Avatar URL:", avatar);

    if (token) {
      // Salva il token nel localStorage e nel contesto
      localStorage.setItem('token', token);
      setToken(token);

      // Aggiorna il contesto con le informazioni dell'utente
      setUserInfo({
        name: name || '',
        avatar: avatar || '',
        email: email || ''
      });

      // Rimuovi i parametri di ricerca dall'URL dopo averli utilizzati
      setSearchParams({});
    }
  }, [searchParams, setToken, setUserInfo, setSearchParams]);

  return (
    <Container fluid className={`home-container ${!token ? 'with-bg' : 'logged-in-gradient'}`}>
      <div className="content"> {/* Aggiunto per gestire lo scrolling */}
        {/* Mostra il titolo e il paragrafo solo se l'utente NON è loggato */}
        {!token && (
          <>
            <h1 className="blog-main-title mb-3">Benvenuto su OtakuWorld!</h1>
            <p className="mb-3 blog-main-content">
              Il mondo di anime e manga che stavi cercando!
            </p>
          </>
        )}

        {/* Mostra i pulsanti di login solo se l'utente NON è loggato */}
        {!token && (
          <div>
            <Button variant="primary" onClick={handleShow}>
              Login
            </Button>
            or
            <Button
              variant="primary"
              as={Link}
              to={"http://localhost:5000/api/v1/auth/login-google"}
            >
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
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label>Password</Form.Label>
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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleLogin}>
              Login now
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Mostra il PostList solo se l'utente è loggato */}
        {token && <PostList />}
      </div>
    </Container>
  );
};

export default Home;
