import { Button, Container, Modal, Form } from "react-bootstrap";
/* import "./styles.css"; */
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContextProvider";
import { useSearchParams, Link } from "react-router-dom";
import { login } from "../data/fetch";
import PostList from "../components/PostList";


const Home = (props) => {
  let [searchParams, setSearchParams]=useSearchParams()
  useEffect(()=>{
    console.log(searchParams.get('token'))
    if(searchParams.get('token')){
      localStorage.setItem('token',searchParams.get('token'))
      setToken(searchParams.get('token'))// aggiorna il token nello stato del contesto
    }
  },[])

  const {token, setToken} = useContext(UserContext)
  const [show, setShow] = useState(false); 
  const handleClose = () =>setShow(false); 
  const handleShow = () => setShow(true);
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleLogin = async() => {
    try {
      const tokenObj = await login(formValue) //così abbiamo il token da mettere nel localStorage
      console.log(tokenObj)
      if (tokenObj && tokenObj.token) {
        localStorage.setItem("token", tokenObj.token)
        setToken(tokenObj.token)
        handleClose()
        alert("Login effettuato con successo") 
      }else{
        alert("Credenziali non valide")
      }
      
    } catch (error) {
     console.log(error)
      alert(error + "errore")
    }
  }


  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto su OtakuWorld!</h1>
      <>
        {!token&&<div><Button variant="primary" onClick={handleShow}>
          Login
        </Button>
        or
        <Button variant="primary" as={Link} to ={'http://localhost:5000/api/v1/auth/login-google'}>
          Login with google
        </Button></div>}
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" onChange={handleChange} placeholder="name@example.com" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} placeholder="your password" />
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

      </>
      {token&&<PostList />}
    </Container>
  );
};

export default Home;
