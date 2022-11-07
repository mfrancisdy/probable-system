import React from "react";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";

export default function BuyForm() {

    function buyTicket(e) {
        e.preventDefault();
    }

    return (
        <div className='buy-form-container theme-bg'>
            <div className='buy-box'>
                <h3 className="buy-title">LOTTERY #1</h3>
                <p>Number of Tickets decide the probability of you winning the lottery. The more tickets you buy the more chances of you winning the Lottery.</p>
                <div className='lottery-progress'>
                    <ProgressBar 
                    completed={50} 
                    bgColor="#8E71EA" 
                    height="21px" 
                    width="100%" 
                    labelColor="#fff" 
                    labelSize="12px" 
                    barContainerClassName="progress-bg"
                    />
                    <div className='lottery-progress-text'>
                        <p>Pool Filled</p>
                        <p style={{color:"#8E71EA"}}>0 %</p>
                    </div>
                </div>
                <div className='buy-form'>
                    <h3 className="form-title">Enter Tickets</h3>
                    <form onSubmit={(e)=>buyTicket(e)}>
                        <input className="form-control buy-form-i my-3" type="number" placeholder="Enter Total Number of Tickets To Buy" />
                        <Row>
                            <Col md={12}>
                                <button className="ticketVal-btn">5 Tickets</button>
                                <button className="ticketVal-btn">10 Tickets</button>
                                <button className="ticketVal-btn">20 Tickets</button>
                                <button className="ticketVal-btn">50 Tickets</button>
                            </Col>
                        </Row>
                        <Row className="mt-5 total-value">
                            <Col md={6}>
                                <p className="total-txt">Per Ticket Price</p>
                                <p className="total-txt">Total Amount</p>
                            </Col>
                            <Col md={6} style={{textAlign:'right'}}>
                                <p className="total-txt">0.01 ETH</p>
                                <p className="total-txt">0.01 ETH</p>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={12} className='text-center'>
                                <button type='submit' className="buy-btn">Buy Tickets</button>
                            </Col>
                        </Row>
                    </form>
                </div>
            </div>
        </div>
    );
}