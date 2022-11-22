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
    const [eraddr, seteraddr] = useState(erc20address);
    const [ maxTickets, setMaxTickets ] = useState(0);
    const [ ticketPrice, setTicketPrice ] = useState(0);
    const [ tickets, setTickets ] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalTicketOwned, settotalTicketOwned] = useState(0);
    const [ ticketsSold, setTicketsSold ] = useState(0);
    const [ soldPercentage, setSoldPercentage ] = useState(0);
    const [ poolIndex, setPoolIndex ] = useState(0);
    const [tokenName, setTokenName] = useState('');
    const [ availableTickets, setAvailableTickets ] = useState(0);
    const [ tokenBalance, setTokenBalance ] = useState(0);
    

    const tokenContract = new ethers.Contract(eraddr, erc20abi, provider);
    const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, provider);

    // execute useEffect every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getPoolInfo();
            console.log(eraddr);
        }, 5000);
        // const inter = setInterval(() => {
        //     // tokenbalance();
        // }, 5000);
        return () => {
            clearInterval(interval);
            // clearInterval(inter);
        }
    }, []);


    const getPoolInfo = async () => {
        const poolIndex = await lotteryContract.getCurrentPoolIndex();
        setPoolIndex(poolIndex.toNumber());
        const poolDetails = await lotteryContract.pools(poolIndex);
        // const poo = await lotteryContract.getPoolSize();
        // console.log(poolDetails[0]);
        seteraddr(poolDetails[0]);
        tokenbalance(poolDetails[0]);
        console.log(eraddr);
        setMaxTickets(poolDetails[2].toNumber());
        setTicketPrice((poolDetails[1].toString() / 1000000000000000000).toFixed(2));
        const poolSize = await lotteryContract.getCurrentPoolSize();
        setTicketsSold(poolSize.toNumber());
        const percent = ((poolSize.toNumber() / poolDetails[2].toNumber()) * 100).toFixed(2);
        setSoldPercentage(percent);
        const availabletickets = poolDetails[2].toNumber() - poolSize.toNumber();
        setAvailableTickets(availabletickets);
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

    const tokenbalance = async (er) => {

        if (localStorage.getItem('connectedWallet') === 'metamask') {
            const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
            const tokenContract = new ethers.Contract(er, erc20abi, provider);
            // console.log(er);
            const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
            console.log((tokenBalance.toString() / 1000000000000000000).toFixed(2));
            setTokenBalance((tokenBalance.toString() / 1000000000000000000).toFixed(2));
            const ticketsbought = await lotteryContract.getUserTicketCount(signer.getAddress());
            settotalTicketOwned(ticketsbought.toString() / 1000000000000000000);
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
            setTokenBalance((tokenBalance.toString() / 1000000000000000000).toFixed(2));
        } else if(localStorage.getItem('connectedWallet') === 'bk') {
            const provider = window.bitkeep && window.bitkeep.ethereum;
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            const tokenBalance = await tokenContract.balanceOf(signer.getAddress());
            setTokenBalance((tokenBalance.toString() / 1000000000000000000).toFixed(2));
        }
    }

    function calculateTickets(e) {
        
        if ( e > maxTickets ){
            toast.error("You cannot buy more than " + maxTickets + " tickets");
            return;
        } else {
            const noOfTickets = e;
            setTickets(noOfTickets);
            setTotalAmount(totalTicketOwned*ticketPrice);
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
                WalletConnectbuy(amount);
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
            }
            else {
                const allowance = await tokenContract.allowance(signer.getAddress(), lotteryaddress);
                const allow = allowance.toString() / 1000000000000000000;
                const allowInt = parseInt(allow);
                const amountInt = parseInt(amount);
                const balance = await tokenContract.balanceOf(signer.getAddress());
                const bal = balance.toString() / 1000000000000000000;
                const balInt = parseInt(bal);
                if (allowInt >= amountInt && balInt >= amountInt)  {    
                    var tx = await lotteryContract.buyTicket(tickets);
                    var txn = await tx.wait();
                    if (txn.status === 1) {
                    toast.success("Transaction successful");
                }
                } else if (allowInt < amountInt && balInt >= amountInt) {
                    toast.warning("Please approve the token first");
                    approveToken(amountInWei);
                    } else if (balInt < amountInt) {
                        toast.error("Insufficient balance");
                    }
        }
        } catch (error) {
            toast.error("Transaction failed");
        }
    }

    const WalletConnectbuy = async (amount) => { 
        const amountInWei = ethers.utils.parseEther(amount.toString());
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
            const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, signer);
            const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
            try{
                const allowance = await tokenContract.allowance(signer.getAddress(), lotteryaddress);
                const allow = allowance.toString() / 1000000000000000000;
                const allowInt = parseInt(allow);
                const amountInt = parseInt(amount);
                const balance = await tokenContract.balanceOf(signer.getAddress());
                const bal = balance.toString() / 1000000000000000000;
                const balInt = parseInt(bal);
                if (allowInt >= amountInt && balInt >= amountInt)  {
                    var tx = await lotteryContract.buyTicket(tickets);
                    var txn = await tx.wait();
                    if (txn.status === 1) {
                    toast.success("Transaction successful");
                }
                } else if (allowInt < amountInt && balInt >= amountInt) {
                    toast.warning("Please approve the token first");
                    approveToken(amountInWei);
                    } else if (balInt < amountInt) {
                        toast.error("Insufficient balance");
                    }
            } catch (error) {
                toast.error("Transaction failed");
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
                toast.info("Please wait while the transaction is being processed")
                const allowance = await tokenContract.allowance(signer.getAddress(), lotteryaddress);
                const allow = allowance.toString() / 1000000000000000000;
                const allowInt = parseInt(allow);
                const amountInt = parseInt(amount);
                const balance = await tokenContract.balanceOf(signer.getAddress());
                const bal = balance.toString() / 1000000000000000000;
                const balInt = parseInt(bal);
                if (allowInt >= amountInt && balInt >= amountInt)  {    
                    var tx = await lotteryContract.buyTicket(tickets);
                    var txn = await tx.wait();
                    if (txn.status === 1) {
                    toast.success("Transaction successful");
                }
                } else if (allowInt < amountInt && balInt >= amountInt) {
                    toast.warning("Please approve the token first");
                    approveToken(amountInWei);
                    } else if (balInt < amountInt) {
                        toast.error("Insufficient balance");
                    }
            } catch (error) {
                toast.error("Transaction failed");
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
                    WalletConnectbuy(amountInWei / 1000000000000000000);
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
                    labelColor="rgb(255 255 255 / 0%)" 
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
                            <Col style={{alignItems:'space-between'}} xs={6} sm={6} md={6}>
                                <p className="total-txt h">Available Tickets</p>
                                <p className="total-txt h">Balance</p>
                                <p className="total-txt h">Ticket Price</p>
                                <p className="total-txt h">My Tickets</p>
                                <p className="total-txt h">Total Amount</p>
                            </Col>
                            <Col  xs={6} sm={6} md={6} style={{textAlign:'right'}}>
                                <p className="total-txt p">{availableTickets}</p>
                                <p className="total-txt p">{tokenBalance}<span>${tokenName}</span></p>
                                <p className="total-txt p">{ticketPrice} <span>${tokenName}</span></p>
                                <p className="total-txt p">{totalTicketOwned} <span>${tokenName}</span></p>
                                <p className="total-txt p">{totalAmount} <span>${tokenName}</span></p>
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