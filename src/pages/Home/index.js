import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Scroll1img from '../../assets/Images/scroll1win.png';

export default function Home() {
    
    return(
        <>
        <section className='scroll1'>
            <Container fluid>
                <Row className='scroll1-row'>
                    <Col md={6} className='scroll1-col1'>
                        <h4>Win lottery online</h4>
                        <h2>Just One Click</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                        <button className='btn btn-primary scroll1-btn'>Enter lottery</button>
                    </Col>
                    <Col md={6} className='scroll1-col2'>
                        <img src={Scroll1img} alt='scroll1' />
                    </Col>
                </Row>
            </Container>
        </section>
        </>
    )
}