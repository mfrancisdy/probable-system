import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import Img1 from "../assets/Images/img1.png";
import { ethers } from "ethers";
import { useSigner, useProvider } from 'wagmi'
import { lotteryaddress, rpcUrl, lotteryabi } from "./abis/lotteryabi";
import { erc20address, erc20abi } from "./abis/erc20";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function WinnerList() {

    const { data: signer } = useSigner()
    const provider = useProvider();

    const tokenContract = new ethers.Contract(erc20address, erc20abi, provider);
    const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, provider);
    const [ WinnerData, setWinnerData] = useState([{
        address: '',
        poolid: '',
    }]);

    useEffect(() => {
        getwinnerData();
    }, []);

    const getwinnerData = async () => {
        const poolid = await lotteryContract.getCurrentPoolIndex()
        for(let i = 0; i < poolid; i++){
            const winner = await lotteryContract.getAnyPoolWinners(i);
            setWinnerData(WinnerData => [...WinnerData, { address: winner[0], poolid: i}]);
        } 
        setWinnerData(WinnerData => WinnerData.slice(1));                    
    }

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
            {
                WinnerData && WinnerData.map((item, index) => {
                    return(
                        <Row key={index} className={index % 2 != 0 ? 'winner-list-body my-2 text-center winner-bg1 py-3 px-3' :
                        'winner-list-body my-2 text-center winner-bg2 py-3 px-3'}>
                            <Col md={4} className='d-flex align-items-center'>
                                <img src={Img1} className='winnerImg' alt='img1' />
                                <div className='text-truncate text-white ms-4' style={{maxWidth:'150px'}}>
                                    {item.address}
                                </div>
                            </Col>
                            <Col md={4} className='d-flex align-items-center justify-content-center'>
                                <p>#{item.poolid}</p>
                            </Col>
                            <Col md={4} className='d-flex align-items-center justify-content-center'>
                                <p></p>
                            </Col>
                        </Row>
                    )
            })}
        </>
    )
}