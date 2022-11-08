import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import { ethers } from "ethers";
import { useSigner, useProvider } from 'wagmi'
import { lotteryaddress, rpcUrl, lotteryabi } from "./abis/lotteryabi";
import { erc20address, erc20abi } from "./abis/erc20";

export default function BuyForm() {

    const { data: signer } = useSigner()
    const provider = useProvider();

    const [ maxTickets, setMaxTickets ] = useState(0);
    const [ ticketPrice, setTicketPrice ] = useState(0);
    const [ tickets, setTickets ] = useState(0);
    const [ totalAmount, setTotalAmount ] = useState(0);
    const [ ticketsSold, setTicketsSold ] = useState(0);
    const [ soldPercentage, setSoldPercentage ] = useState(0);

    const tokenContract = new ethers.Contract(erc20address, erc20abi, provider);
    const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, provider);

    useEffect(() => {
        getPoolInfo();
    }, []);

    const getPoolInfo = async () => {
        const poolDetails = await lotteryContract.pools(0);
        setMaxTickets(poolDetails[2].toString());
        setTicketPrice(poolDetails[1].toString() / 1000000000000000000);
        const poolSize = await lotteryContract.getCurrentPoolSize();
        setTicketsSold(poolSize.toNumber());
        setSoldPercentage((poolSize.toNumber() / poolDetails[2].toNumber()) * 100);
    }

    function calculateTickets(e) {
        
        if ( e > maxTickets ){
            alert("You cannot buy more than " + maxTickets + " tickets");
            return;
        } else {
            const noOfTickets = e;
            setTickets(noOfTickets);
            setTotalAmount(noOfTickets * ticketPrice);
        }
    }

    function buyTicket(e) {
        e.preventDefault();
        if( tickets === 0 ){
            alert("Please enter a valid number of tickets");
            return;
        } else if ( tickets > maxTickets ){
            alert("You cannot buy more than " + maxTickets + " tickets");
            return;
        } else {
            const amount = tickets * ticketPrice;
            const sendTX = new ethers.Contract(erc20address, erc20abi, signer);
            sendTX.approve(lotteryaddress, amount).then((tx) => {
                console.log("tx", tx);
                lotteryContract.buyTickets(0, tickets).then((tx) => {
                    console.log("tx", tx);
                });
            });
        }
    }

    return (
        <div className='buy-form-container theme-bg'>
            <div className='buy-box'>
                <h3 className="buy-title">LOTTERY #1</h3>
                <p>Number of Tickets decide the probability of you winning the lottery. The more tickets you buy the more chances of you winning the Lottery.</p>
                <div className='lottery-progress'>
                    <ProgressBar 
                    completed={soldPercentage}
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
                        <input className="form-control buy-form-i my-3" type="number" min={1} onChange={(e)=>{setTickets(e.target.value)}} value={tickets} placeholder="Enter Total Number of Tickets To Buy" />
                        <Row>
                            <Col md={12}>
                                <button type="button" className="ticketVal-btn" onClick={()=>{calculateTickets(5)}}>5 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(10)}}>10 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(20)}}>20 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(50)}}>50 Tickets</button>
                            </Col>
                        </Row>
                        <Row className="mt-5 total-value">
                            <Col xs={6} sm={6} md={6}>
                                <p className="total-txt">Per Ticket Price</p>
                                <p className="total-txt">Total Amount</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} style={{textAlign:'right'}}>
                                <p className="total-txt">{ticketPrice} ETH</p>
                                <p className="total-txt">{totalAmount} ETH</p>
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