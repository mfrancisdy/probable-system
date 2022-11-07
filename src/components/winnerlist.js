import React from "react";
import { Row, Col } from "react-bootstrap";
import Img1 from "../assets/Images/img1.png";

export default function WinnerList() {
    return(
        <>
            <Row className='winner-list-head theme-bg text-center'>
                <Col md={4}>
                    <h4 className="text-white">Lottery Winner Address</h4>
                </Col>
                <Col md={4}>
                    <h4 className="text-white">Serial Number</h4>
                </Col>
                <Col md={4}>
                    <h4 className="text-white">Amount Won($TOKENS)</h4>
                </Col>
            </Row>
            <Row className='winner-list-body my-2 text-center winner-bg1 py-3 px-3'>
                <Col md={4} className='d-flex align-items-center'>
                    <img src={Img1} className='winnerImg' alt='img1' />
                    <div className='text-truncate text-white ms-4' style={{maxWidth:'150px'}}>
                       0x0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d
                    </div>
                </Col>
                <Col md={4} className='d-flex align-items-center justify-content-center'>
                    <p>#1</p>
                </Col>
                <Col md={4} className='d-flex align-items-center justify-content-center'>
                    <p>32342</p>
                </Col>
            </Row>
            <Row className='winner-list-body my-2 text-center winner-bg2 py-3 px-3'>
                <Col md={4} className='d-flex align-items-center'>
                    <img src={Img1} className='winnerImg' alt='img1' />
                    <div className='text-truncate text-white ms-4' style={{maxWidth:'150px'}}>
                    0x0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d
                    </div>
                </Col>
                <Col md={4} className='d-flex align-items-center justify-content-center'>
                    <p>#2</p>
                </Col>
                <Col md={4} className='d-flex align-items-center justify-content-center'>
                    <p>32342</p>
                </Col>
            </Row>
        </>
    )
}