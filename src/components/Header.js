import React, { Component } from "react";
import { Col, Container, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";
import "./Header.css";
import { ReactComponent as IconLogoSvg } from "./../assets/iconlogo.svg";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <Container>
        <br></br>
        <Row>
          <Col>
            <Link to='/'>
              <IconLogoSvg></IconLogoSvg>
              <Label className='whats-in-title'>What's in</Label>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
