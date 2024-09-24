import React, { useEffect, useState, useContext } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import PostItem from "../PostItem/PostItem";
import { loadPosts } from "../../data/fetch";
import { UserContext } from "../../context/UserContextProvider";
import "./PostList.css";

const PostList = () => {
  const { token } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [aggiornaPostList, setAggiornaPostList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (event) => {
    setSearch(event.target.value ? event.target.value : "");
  };

  useEffect(() => {
    loadPosts(search, currentPage).then((data) => {
      setPosts(data.dati);
      setTotalPages(data.totalPages); // Imposta il numero totale di pagine
    });
  }, [search, currentPage, aggiornaPostList]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {/* {token && (
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search post"
            className="me-2 mb-2 w-25"
            aria-label="Search"
            name="search"
            onChange={handleSearch}
          />
        </Form>
      )} */}
      <Row>
        {posts.map((post, i) => (
          <Col
            key={`item-${i}`}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <PostItem
              key={post._id}
              {...post}
              setAggiornaPostList={setAggiornaPostList}
              aggiornaPostList={aggiornaPostList}
            />
          </Col>
        ))}
      </Row>
      {/* Paginazione */}
      <div className="pagination-controls">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
};

export default PostList;
