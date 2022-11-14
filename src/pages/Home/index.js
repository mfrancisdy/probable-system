import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Scroll1img from '../../assets/Images/scroll1win.png';
import Scroll3img from '../../assets/Images/lottery.png';
import BuyForm from '../../components/buyform';
import WinnerList from '../../components/winnerlist';
import Chart from '../../assets/Images/chart.jpeg';
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
                        <p>looking for a way to win some extra cash, why not try your luck in a lottery? If you win, the prize money will be deposited into your account. use it however you'd like! 
                            So, what are you waiting for?</p>
                        <a href="#lottery"><button className='btn btn-primary scroll1-btn'>Enter lottery</button></a>
                    </Col>
                    <Col md={6} className='scroll1-col2 d-none d-sm-none d-md-block'>
                        <img src={Scroll1img} alt='scroll1' />
                    </Col>
                </Row>
            </Container>
        </section>
        <section id="steps" className='scroll2'>
            <Container>
                <Row>
                    <Col md={12}>
                        <h2 className='text-center text-white'>follow These Easy Steps </h2>
                        <p className='text-center py-3'>Follow these super simple steps to enter the lottery and start winning today! 
                        Its fully decentalized and safe</p>
                        <Row className='scroll2-row gx-5 gy-5 py-5'>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Buy the required amount of tickets and increase your chances of winning the lottery.</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 2</h4>
                                    <h3 className='box-head'>Let pool end</h3>
                                    <p>As people enter the lottery and the pool gets filled, it will automatically draw the winners randomly and will send rewards.</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 3</h4>
                                    <h3 className='box-head'> Enjoy Lottery</h3>
                                    <p>enjoy the rewards automatically in your wallet. Do whatever you want with your rewards!</p>
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
                    <Col md={6} className='scroll3-col d-none d-sm-none d-md-flex'>
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
                        <p className='text-dark text-center py-5'>Checkout  our last winners here. Want to come in this list? get started with the lottery and win rewards automatically!</p>
                    </Col>
                </Row>
                <Row className='scroll4-row px-2'>
                    <Col md={12}>
                        <WinnerList />
                    </Col>
                </Row>
            </Container>
        </section>
        <section id='rewards' className='scroll5'>
            <Container>
                <Row className='flex-column-reverse flex-sm-column-reverse flex-md-row'>
                    <Col md={6}>
                        <img src={Chart} alt='chart' className='token-chart'/>
                    </Col>
                    <Col md={6}>
                        <h2 className='theme-text'>reward Distribution system</h2>
                        <p className='theme-text py-4'>The following is the rewards distribution. The contract randomly selects 9 lucky winners and sents the rewards to their address automatically. Everything is open, safe, and decentralized. Users can go to their wallet and check.</p>
                    </Col>
                </Row>
            </Container>
        </section>
        <section className='scroll6'>
            <Container>
                <Row className='theme-bg py-5 m-0 d-winners'>
                    <Col md={6}>
                        <h5>get a chance to win!</h5>
                        <h2 className='text-white py-3'>Daily Winners</h2>
                        <p className='d-winners-text'>Win a chance to come in the list of winners by entering the Lucky draw. Winner rewards are automatically sent to the winners, in a safe and decentralized manner.</p>
                        <div className='d-inline-block mt-3'>
                            <a href='#lottery'><button className='btn btn-primary scroll6-btn'>Get Started</button></a>
                            <a href="#steps"><button className='btn btn-primary scroll6-btn-tp'>Know More</button></a>
                        </div>
                    </Col>
                    <Col md={6} className='d-none d-sm-none d-md-block'>
                        <img src={Users} alt='users' className='users-img'/>
                    </Col>
                </Row>
            </Container>
        </section>
        <section className='scroll7'>
            <Container>
                <Row className="theme-bg py-5 m-0 d-winners d-none d-md-flex">
                    <Col md={6} className='d-none d-sm-none d-md-block'>
                        <h5 className="btm-txt">Token Address</h5>
                        <h5 className="btm-txt">Lottery Address</h5>
                    </Col>
                    <Col md={6} className='d-none d-sm-none d-md-block'>
                        <h5>0x9389a6D59d3a04C76E1eb28CF11B7E032A2CDa6A</h5>
                        <h5>0x8D1cc2747842630AC18e02ACA83cc4B3e171f917</h5>
                    </Col>
                </Row> 
                <Row className="theme-bg py-5 m-0 d-winners d-block d-md-none">
                    <Col md={6} className='d-block'>
                        <h5 className="btm-txt">Token Address</h5>
                        <h5 className='address-txt'>0x9389a6D59d3a04C76E1eb28CF11B7E032A2CDa6A</h5>
                    </Col>
                    <Col md={6} className='d-block'>
                        <h5 className="btm-txt">Lottery Address</h5>
                        <h5 className='address-txt'>0x8D1cc2747842630AC18e02ACA83cc4B3e171f917</h5>
                    </Col>
                </Row>  
            </Container>
         </section>   
        </>
    )
}