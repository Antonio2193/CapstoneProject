import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./PostUser.css";

const PostUser = props => {
  const { name, avatar } = props;
  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={avatar} roundedCircle />
      </Col>
      <Col>
        <div>di</div>
        <h6>{name}</h6>
      </Col>
    </Row>
  );
};

export default PostUser;
