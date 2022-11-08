import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Scroll1img from '../../assets/Images/scroll1win.png';
import Scroll3img from '../../assets/Images/lottery.png';
import BuyForm from '../../components/buyform';
import WinnerList from '../../components/winnerlist';
import Chart from '../../assets/Images/chart.png';
import Users from '../../assets/Images/users.png';

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
        <section className='scroll2'>
            <Container>
                <Row>
                    <Col md={12}>
                        <h2 className='text-center text-white'>follow These Easy Steps </h2>
                        <p className='text-center py-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                        <Row className='scroll2-row gx-5 py-5'>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
        <section id='lottery' className='scroll3'>
            <Container>
                <Row>
                    <Col md={12}>
                        <h2 className="text-center theme-text">Buy Lottery Tickets</h2>
                    </Col>
                </Row>
                <Row className='scroll3-row gx-5'>
                    <Col md={6} className='scroll3-col'>
                        <img src={Scroll3img} alt='lottery-tickets' />
                    </Col>
                    <Col md={6} className='scroll3-col2'>
                        <BuyForm />
                    </Col>
                </Row>
            </Container>
        </section>
        <section id='winners' className='scroll4 py-5'>
            <Container>
                <Row>
                    <Col md={12}>
                        <h2 className="text-center theme-text">Last Lottery Winner Result</h2>
                        <p className='text-dark text-center py-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                    </Col>
                </Row>
                <Row className='scroll4-row'>
                    <Col md={12}>
                        <WinnerList />
                    </Col>
                </Row>
            </Container>
        </section>
        <section id='rewards' className='scroll5'>
            <Container>
                <Row>
                    <Col md={6}>
                        <img src={Chart} alt='chart' className='token-chart'/>
                    </Col>
                    <Col md={6}>
                        <h2 className='theme-text'>Reward Distribution</h2>
                        <p className='theme-text py-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                    </Col>
                </Row>
            </Container>
        </section>
        <section className='scroll6'>
            <Container>
                <Row className='theme-bg py-5 px-5 d-winners'>
                    <Col md={6}>
                        <h5>get a chance to win!</h5>
                        <h2 className='text-white py-3'>Daily Winners</h2>
                        <p className='d-winners-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                        <div className='d-inline-block mt-3'>
                            <button className='btn btn-primary scroll6-btn'>Get Started</button>
                            <button className='btn btn-primary scroll6-btn-tp'>View More</button>
                        </div>
                    </Col>
                    <Col md={6}>
                        <img src={Users} alt='users' className='users-img'/>
                    </Col>
                </Row>
            </Container>
        </section>
        </>
    )
}