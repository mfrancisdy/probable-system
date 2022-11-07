import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';


export default function Header() {
    return (
        <header className='header'>
            <Navbar expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <img src="/img/logo.png" className="d-inline-block align-top" alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Container>
                            <Row>
                                <Col md={8}>
                                <Nav className="nav-menu">
                                    <Nav.Link href="#home">Home</Nav.Link>
                                    <Nav.Link href="#link">Link</Nav.Link>
                                </Nav>
                                </Col>
                                <Col md={4}>
                                    <button className="btn btn-primary connectBtn">Connect Wallet</button>
                                </Col>
                            </Row>
                        </Container>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}