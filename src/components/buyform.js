import React, { useEffect, useState} from "react";
import { Row, Col } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import { ethers, providers } from "ethers";
import { useSigner, useProvider } from 'wagmi'
import { lotteryaddress, rpcUrl, lotteryabi } from "./abis/lotteryabi";
import { erc20address, erc20abi } from "./abis/erc20";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
        setMaxTickets(poolDetails[2].toNumber());
        setTicketPrice(poolDetails[1].toString() / 1000000000000000000);
        const poolSize = await lotteryContract.getCurrentPoolSize();
        setTicketsSold(poolSize.toNumber());
        setSoldPercentage((poolSize.toNumber() / poolDetails[2].toNumber()) * 100);
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
            var tx = await lotteryContract.buyTicket(tickets);
            var txn = await tx.wait();
            if (txn.status === 1) {
                toast.success("Transaction successful");
                window.location.reload(false);
            }
        } catch (error) {
            const message = error.reason;
            if (message === "execution reverted: token balance or allowance is lower than amount requested") {
                approveToken(amountInWei);
            }
            else {
                toast.error(message);
            }
        }
    }

    const WalletConnectbuy = async (amount) => { 
       const amountInWei = ethers.utils.parseEther(amount.toString());
       toast.info("Please wait while the transaction is being processed");
       const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
        });
        // fetch provider from walletconnect
        const provider = new WalletConnectProvider({
        infuraId: "23496caecbbf436fb0a618b8129f6430",
        chainId: 80001,
        connector,
        rpc: {
            80001: rpcUrl,
        },
        });
         provider.enable().then(async () => {
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            console.log(signer);
            const tokenContract = new ethers.Contract(erc20address, erc20abi, signer);
            const lotteryContract = new ethers.Contract(lotteryaddress, lotteryabi, signer);
            try{
                var tx = await lotteryContract.buyTicket(tickets);
                var txn = await tx.wait();
                if (txn.status === 1) {
                    toast.success("Transaction successful");
                    window.location.reload(false);
                }
                
               
            } catch (error) {
                const message = error.reason;
                if (message === "execution reverted: token balance or allowance is lower than amount requested") {
                    approveToken(amountInWei);
                }
                else {
                    toast.error(message);
                }
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
                    window.location.reload(false);
                }
            } catch (error) {
                const message = error.reason;
                if (message === "execution reverted: token balance or allowance is lower than amount requested") {
                    approveToken(amountInWei);
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
            infuraId: "23496caecbbf436fb0a618b8129f6430",
            chainId: 80001,
            connector,
            rpc: {
                80001: rpcUrl,
            },
            });
             provider.enable().then(async () => {
                 const web3 = new Web3(provider);
                 // get signer address
                    const signer = new ethers.providers.Web3Provider(provider).getSigner();
                    const address = await signer.getAddress();
                    const tokenContract = new web3.eth.Contract(erc20abi, erc20address);
                    try {
                        var tx = await tokenContract.methods.approve(lotteryaddress, amountInWei.toString()).send({from:address});
                        if (tx.status === true) {
                            toast.success("Token approved");
                            WalletConnectbuy(amountInWei / 1000000000000000000);
                        }
                    }
                    catch (error) {
                        console.log(error)
                        toast.error("Transaction failed");
                    }
                
             });
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
                        <Row className="mt-5 total-value">
                            <Col xs={6} sm={6} md={6}>
                                <p className="total-txt">Per Ticket Price</p>
                                <p className="total-txt">Total Amount</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} style={{textAlign:'right'}}>
                                <p className="total-txt">{ticketPrice} $Tokens</p>
                                <p className="total-txt">{totalAmount} $Tokens</p>
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