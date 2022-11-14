import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import { ethers, providers } from "ethers";
import { lotteryaddress, rpcUrl, lotteryabi } from "./abis/lotteryabi";
import { erc20address, erc20abi } from "./abis/erc20";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { chain } from "wagmi";


export default function BuyForm() {


    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const [ maxTickets, setMaxTickets ] = useState(0);
    const [ ticketPrice, setTicketPrice ] = useState(0);
    const [ tickets, setTickets ] = useState(0);
    const [ totalAmount, setTotalAmount ] = useState(0);
    const [ ticketsSold, setTicketsSold ] = useState(0);
    const [ soldPercentage, setSoldPercentage ] = useState(0);
    const [ poolIndex, setPoolIndex ] = useState(0);
    const [tokenName, setTokenName] = useState('');
    const [ availableTickets, setAvailableTickets ] = useState(0);
    const [ tokenBalance, setTokenBalance ] = useState(0);
    

    const tokenContract = new ethers.Contract(erc20address, erc20abi, provider);
    const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, provider);

    // execute useEffect every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getPoolInfo();
        }, 5000);
        return () => clearInterval(interval);
        tokenbalance();
    }, []);


    const getPoolInfo = async () => {
        const poolDetails = await lotteryContract.pools(0);
        setMaxTickets(poolDetails[2].toNumber());
        setTicketPrice(poolDetails[1].toString() / 1000000000000000000);
        const poolSize = await lotteryContract.getCurrentPoolSize();
        setTicketsSold(poolSize.toNumber());
        setSoldPercentage((poolSize.toNumber() / poolDetails[2].toNumber()) * 100);
        const availabletickets = poolDetails[2].toNumber() - poolSize.toNumber();
        setAvailableTickets(availabletickets);
        const poolIndex = await lotteryContract.getCurrentPoolIndex();
        setPoolIndex(poolIndex.toNumber());
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

        }

    const tokenbalance = async () => {

        if (localStorage.getItem('connectedWallet') === 'metamask') {
            const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
            setTokenBalance(tokenBalance.toString() / 1000000000000000000);
        } else if(localStorage.getItem('connectedWallet') === 'wc') {
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal,
                });
                const provider = new WalletConnectProvider({
                    rpc: {
                        56: rpcUrl,
                    },
                    chainId: 56,
                    network: "binance",
                    qrcode: true,
                    qrcodeModalOptions: {
                        mobileLinks: [
                          "metamask",
                          "trust",
                        ]
                    }
                });
                provider.networkId = 56;
                provider.updateRpcUrl(56);
                await provider.enable();
                provider.updateRpcUrl(56);
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
            setTokenBalance(tokenBalance.toString() / 1000000000000000000);
        } else if(localStorage.getItem('connectedWallet') === 'bk') {
            const provider = window.bitkeep && window.bitkeep.ethereum;
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
            setTokenBalance(tokenBalance.toString() / 1000000000000000000);
        }
    }

    function calculateTickets(e) {
        
        if ( e > maxTickets ){
            toast.error("You cannot buy more than " + maxTickets + " tickets");
            return;
        } else {
            const noOfTickets = e;
            setTickets(noOfTickets);
            setTotalAmount(noOfTickets * ticketPrice);
        }
    }

    function handleChange(e) {
        calculateTickets(e.target.value);
    }


    function buyTicket(e) {
        e.preventDefault();
        if (localStorage.getItem('connectedWallet') === null) {
            toast.error("Please connect wallet");
        } else {
        if( tickets === 0 ){
            toast.error("Please enter the number of tickets you want to buy");
            return;
        } else if ( tickets > maxTickets ){
            toast.error("You cannot buy more than " + maxTickets + " tickets");
            return;
        } else {
            const amount = tickets * ticketPrice;
            const amountInWei = ethers.utils.parseEther(amount.toString());
           if (localStorage.getItem('connectedWallet') === 'metamask') {
               Metamaskbuy(amount);
           } else if (localStorage.getItem('connectedWallet') === 'wc'){
                approveToken(amountInWei);
              }
              else if (localStorage.getItem('connectedWallet') === 'bk'){
                Bitkeepbuy(amount);
              }
        }
    }   
    }

   const Metamaskbuy = async (amount) => {
        const amountInWei = ethers.utils.parseEther(amount.toString());
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
        const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, signer);
 
        try{
            toast.info("Please wait while the transaction is being processed", {
                timeout: 10000,
            });
            const chain = await window.ethereum.request({ method: 'eth_chainId' });
            if (chain !== '0x38') {
                // switch to BSC
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }],
                });
                var tx = await lotteryContract.buyTicket(tickets);
                var txn = await tx.wait();
                if (txn.status === 1) {
                toast.success("Transaction successful");
            }
            }
            else {
            var tx = await lotteryContract.buyTicket(tickets);
            var txn = await tx.wait();
            if (txn.status === 1) {
                toast.success("Transaction successful");
            }
        }
        } catch (error) {
            const message = error.reason;
            const balance = await tokenContract.balanceOf(signer.getAddress());
           if (balance >= amountInWei) {
                approveToken(amountInWei);
            }
            else {
                toast.error(message);
            }
        }
    }

    const WalletConnectbuy = async () => { 
       toast.info("Please wait while the transaction is being processed");
       const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
        });
        const provider = new WalletConnectProvider({
        chainId: 56,
        connector,
        rpc: {
            56: rpcUrl,
        },
        });
         provider.enable().then(async () => {
            provider.updateRpcUrl(56);
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            console.log(signer);
            const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, signer);
            try{
                var tx = await lotteryContract.buyTicket(tickets);
                var txn = await tx.wait();
                if (txn.status === 1) {
                    toast.success("Transaction successful");
                }
            } catch (error) {
                toast.error(error.reason);
            }
         });

        
    }
    
    const Bitkeepbuy = async (amount) =>{
       const amountInWei = ethers.utils.parseEther(amount.toString());
       const provider = window.bitkeep && window.bitkeep.ethereum;
         const signer = new ethers.providers.Web3Provider(provider).getSigner();
            const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
            const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, signer);
            try{
                toast.info("processing transaction");
                var tx = await lotteryContract.buyTicket(tickets);
                var txn = await tx.wait();
                if (txn.status === 1) {
                    toast.success("Transaction successful");
                }
            } catch (error) {
                const message = error.reason;
                const balance = await tokenContract.balanceOf(signer.getAddress());
                if (balance >= amountInWei) {
                    approveToken(amountInWei);
                }
                else {
                    toast.error(message);
                }
            }
    }
    
   const approveToken = async (amountInWei) => {
        toast.info("Approving token");
        if (localStorage.getItem('connectedWallet') === 'metamask') {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();    
        const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
        try {
            var tx = await tokenContract.approve(lotteryaddress, amountInWei);
            var txn = await tx.wait();
            if (txn.status === 1) {
                toast.success("Token approved");
                Metamaskbuy(amountInWei / 1000000000000000000);
            }
        } catch (error) {
            toast.error("Transaction failed");
        }
    } else if (localStorage.getItem('connectedWallet') === 'wc'){
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
            });
            // fetch provider from walletconnect
            const provider = new WalletConnectProvider({
                rpc: {
                    56: rpcUrl,
                },
                chainId: 56,
                network: "binance",
                qrcode: true,
                qrcodeModalOptions: {
                    mobileLinks: [
                      "metamask",
                      "trust",
                    ]
                }
            });
            provider.networkId = 56;
            provider.updateRpcUrl(56);
            await provider.enable();
            provider.updateRpcUrl(56);
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
            try {
                var tx = await tokenContract.approve(lotteryaddress, amountInWei);
                var txn = await tx.wait();
                if (txn.status === 1) {
                    toast.success("Token approved");
                    WalletConnectbuy();
                }
            } catch (error) {
                toast.error("Transaction failed");
            }
      }
        else if (localStorage.getItem('connectedWallet') === 'bk'){
        
           const provider = window.bitkeep && window.bitkeep.ethereum;
              const signer = new ethers.providers.Web3Provider(provider).getSigner();
                const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
                try {
                    var tx = await tokenContract.approve(lotteryaddress, amountInWei);
                    var txn = await tx.wait();
                    if (txn.status === 1) {
                        toast.success("Token approved");
                        Bitkeepbuy(amountInWei / 1000000000000000000);
                    }
                } catch (error) {
                    toast.error(error);
                    alert(error);
                }
        }
   }



    return (
        
        <div className='buy-form-container theme-bg'>
            <div className='buy-box'>
            <ToastContainer />
                <h3 className="buy-title">LOTTERY #{poolIndex}</h3>
                <p>Number of Tickets decide the probability of you winning the lottery. The more tickets you buy the more chances of you winning the Lottery. Get started below and increase your chances of winning!</p>
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
                        <p style={{color:"#8E71EA"}}>{soldPercentage} %</p>
                    </div>
                </div>
                <div className='buy-form'>
                    <h3 className="form-title">Enter Tickets</h3>
                    <form onSubmit={(e)=>buyTicket(e)}>
                        <input className="form-control buy-form-i my-3" type="number" min={1} onChange={handleChange} value={tickets} placeholder="Enter Total Number of Tickets To Buy" />
                        <Row>
                            <Col md={12}>
                                <button type="button" className="ticketVal-btn" onClick={()=>{calculateTickets(5)}}>5 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(10)}}>10 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(20)}}>20 Tickets</button>
                                <button type='button' className="ticketVal-btn" onClick={()=>{calculateTickets(50)}}>50 Tickets</button>
                            </Col>
                        </Row>
                        <Row className="mt-3 total-value">
                            <Col xs={6} sm={6} md={6}>
                                <p className="total-txt">Available Tickets</p>
                                <p className="total-txt">Token Balance</p>
                                <p className="total-txt">Per Ticket Price</p>
                                <p className="total-txt">Total Amount</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} style={{textAlign:'right'}}>
                                <p className="total-txt">{availableTickets}</p>
                                <p className="total-txt">{tokenBalance}${tokenName}</p>
                                <p className="total-txt">{ticketPrice} ${tokenName}</p>
                                <p className="total-txt">{totalAmount} ${tokenName}</p>
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