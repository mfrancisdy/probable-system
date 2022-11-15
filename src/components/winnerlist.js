import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import Img1 from "../assets/Images/img1.png";
import { ethers } from "ethers";
import { lotteryaddress, rpcUrl, lotteryabi } from "./abis/lotteryabi";
import { erc20address, erc20abi } from "./abis/erc20";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/style.css";
import { randpix, RandpixColorScheme, Symmetry } from 'randpix'

window.Buffer = require('buffer/').Buffer;
export default function WinnerList() {

    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const tokenContract = new ethers.Contract(erc20address, erc20abi, provider);
    const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, provider);
    const [ WinnerData, setWinnerData] = useState([{
        address: '',
        poolid: '',
        img: '',
        serialnumber: '',
        amount: '',
    }]);
    const [ tokenName, setTokenName] = useState('');

    useEffect(() => {
        getwinnerData();
    }, []);

    const getwinnerData = async () => {
        const poolid = await lotteryContract.getCurrentPoolIndex()
        const tokenaddress = await lotteryContract.getPoolTicketToken();
        const response = await fetch('https://deep-index.moralis.io/api/v2/erc20/metadata?chain=bsc&addresses='+tokenaddress, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'X-API-Key': 'TWZEjRdJ3XCmja4GeRYx9GShQHNU8EnBdhVYUQSNFUuib4EiNkAbYyW4JTSrOYkg',
            },
        })
        const json = await response.json();
        setTokenName(json[0].symbol);
        const generate = randpix({
            colorScheme: RandpixColorScheme.NEUTRAL, // Color theme (default: NEUTRAL)
            size: 8, // Art size. Recommended 7 or 8 (odd/even symmetry) (default: 8)
            scale: 32, // Pixel scale (default: 1)
            symmetry: Symmetry.VERTICAL, // Symmetry (default: VERTICAL)
            grayscaleBias: false, // Change only the brightness of the color instead of the hue (default: undefined)
            seed: poolid
        });
        
            for(let j = 0; j < 9; j++){
                let i = poolid - 1;
                const winner = await lotteryContract.getAnyPoolWinners(i);
                const winnerAddress = winner[j];
                const amount = await lotteryContract.poolWinnersAmounts(winnerAddress, i);
                const winneramount = amount.toString();
                const art = generate();
                const pix = art.toDataURL();
                //const serialnumber = ((i+1) * 9) - j;
                setWinnerData(WinnerData => [...WinnerData, {
                    address: winnerAddress,
                    poolid: i,
                    img: pix,
                    serialnumber: ++j,
                    amount: winneramount,
                }]);
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
                    <h4 className="text-white">Amount Won ${tokenName}</h4>
                </Col>
            </Row>
            {
                WinnerData && WinnerData.map((item, index) => {
                    return(
                        <Row key={index} className={index % 2 != 0 ? 'winner-list-body my-2 text-center winner-bg1 py-3 px-3' :
                        'winner-list-body my-2 text-center winner-bg2 py-3 px-3'}>
                            <Col md={4} className='d-flex align-items-center'>
                                <img src={item.img} className='winnerImg' alt='img1' />
                                <div className='text-truncate text-white ms-4' style={{maxWidth:'150px'}}>
                                   <a className='link' href={` https://mumbai.polygonscan.com/address/${item.address}`} target="_blank">{item.address}</a> 
                                </div>
                            </Col>
                            <Col md={4} className='d-flex align-items-center justify-content-center'>
                                <p>#{item.serialnumber}</p>
                            </Col>
                            <Col md={4} className='d-flex align-items-center justify-content-center'>
                                <p>{item.amount}</p>
                            </Col>
                        </Row>
                    )
            })}
        </>
    )
}