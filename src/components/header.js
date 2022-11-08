import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';


export default function Header() {

    window.onscroll = function() {scrollFunction()};
    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.getElementById("header").classList.add("header-sticky");
        } else {
            document.getElementById("header").classList.remove("header-sticky");
        }
    }

    function selectWallet(){
        document.querySelector('.walletpopup-container').classList.add('show');
    }


    return (
        <header id='header' className='header'>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img src="/img/logo.png" className="d-inline-block align-top" alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Container>
                            <Row>
                                <Col md={8}>
                                <Nav className="nav-menu justify-content-center">
                                    <Nav.Link id='item0' href="/" className='px-3'>Home</Nav.Link>
                                    <Nav.Link id='item1' href="#rewards" className='px-3'>Rewards</Nav.Link>
                                    <Nav.Link id='item2' href="#winners" className='px-3'>Winners</Nav.Link>
                                    <Nav.Link id='item3' href="#lottery" className='px-3'>Lottery</Nav.Link>
                                </Nav>
                                </Col>
                                <Col md={4} className='d-flex justify-sm-none'>
                                <button className='connectBtn' onClick={()=>selectWallet()}>Connect Wallet</button>
                                </Col>
                            </Row>
                        </Container>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}