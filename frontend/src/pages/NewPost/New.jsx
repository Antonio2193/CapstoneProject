import React, { useCallback, useState, useContext } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./New.css";
import draftToHtml from "draftjs-to-html";
import { newPost } from "../../data/fetch";
import { UserContext } from "../../context/UserContextProvider";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const NewPost = (props) => {
  const [text, setText] = useState("");
  const [cover, setCover] = useState("");
  const { token } = useContext(UserContext);
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();

  const initialFormValue = {
    category: "",
    cover: "",
    author: decodedToken.userId,
    content: ""
  };

  const [formValue, setFormValue] = useState(initialFormValue);

  const handleChangeFormValue = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeImage = (event) => {
    handleChangeFormValue(event);
    setCover(event.target.files[0]);
  };

  const handleChange = useCallback(value => {
    const htmlContent = draftToHtml(value);
    setText(htmlContent);
    
    // Rimuovi i tag <p>
    const contentWithoutP = htmlContent.replace(/<p>/g, '').replace(/<\/p>/g, '');
    
    setFormValue({
      ...formValue,
      content: contentWithoutP // Aggiorna content senza i tag <p>
    });
  }, [formValue]);

  const handleSend = async (event) => {
    event.preventDefault();
    await newPost(formValue, cover);
    navigate('/');
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSend}>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label className="modale-colore">Categoria</Form.Label>
          <Form.Control size="lg" as="select" name="category" onChange={handleChangeFormValue} className="bottone-bianco">
            <option>Manga</option>
            <option>Anime</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="cover" className="mt-3 mb-3">
          <Form.Label className="modale-colore">Cover</Form.Label>
          <Form.Control type="file" name="cover" onChange={handleChangeImage} className="bottone-bianco"/>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3 modale-colore">
          <Form.Label className="modale-colore">Contenuto Post</Form.Label>
          <Editor value={text} onChange={handleChange} className="new-blog-content" />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" className="bottone-bianco">
            Reset
          </Button>
          <Button type="submit" size="lg" className="bottone-viola" style={{ marginLeft: "1em" }}>
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewPost;
