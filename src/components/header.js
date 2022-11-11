import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import MetaMask from '../assets/Images/meta.png';
import Wc from '../assets/Images/wc.png';
import Tp from '../assets/Images/tp.png';
import Bk from '../assets/Images/bk.png';
import Web3 from 'web3';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

window.Buffer = require('buffer/').Buffer;


export default function Header() {
    
    window.onscroll = function() {scrollFunction()};
    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.getElementById("header").classList.add("header-sticky");
        } else {
            document.getElementById("header").classList.remove("header-sticky");
        }
    }

    function selectWallet(){
        document.querySelector('.walletpopup-container').classList.add('show');
    }

    const closeWalletPopup = () => {
        document.querySelector('.walletpopup-container').classList.remove('show');
    }

    const [walletConnected, setWalletConnected] = useState(false);
    useEffect(() => {
    if (localStorage.getItem('connectedWallet')) {
        setWalletConnected(true);
    }
    }, []);
    const connectWallet = async (wallet) => {
        if(wallet === 'metamask'){
            if (window.ethereum) {
                try {
                    const connect = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    const chainId = 80001
                    if (window.ethereum.networkVersion !== chainId) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: Web3.utils.toHex(chainId) }]
                            });
                        } catch (err) {
                            // This error code indicates that the chain has not been added to MetaMask
                            if (err.code === 4902) {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainName: 'Polygon Testnet',
                                            chainId: Web3.utils.toHex(chainId),
                                            nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                                            rpcUrls: ['https://matic-mumbai.chainstacklabs.com']
                                        }
                                    ]
                                });
                            }
                         }
                        }
                    localStorage.setItem('connectedWallet', 'metamask');
                    setWalletConnected(true);
                    closeWalletPopup();
                } catch (err) {
                    console.log(err)
                }
            } else {
                alert("Please Download Metemask Extension for Chrome")
            }
        }else if(wallet === 'wc'){
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal,
            });
            if (!connector.connected) {
                // create new session
                connector.createSession();
                connector.on("connect", (error, payload) => {
                    if (error) {
                        throw error;
                    } 
                    const { accounts, chainId } = payload.params[0];
                    if (chainId !== 80001) {
                        connector.sendCustomRequest({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: Web3.utils.toHex(80001) }],
                        });
                    }
                    localStorage.setItem('connectedWallet', 'wc');
                    setWalletConnected(true);
                    closeWalletPopup();
                });
            } else {
                    connector.on("connect", (error, payload) => {
                    if (error) {
                        throw error;
                    }
                    const { accounts, chainId } = payload.params[0];
                    if (chainId !== 8001) {
                        try{
                            connector.sendCustomRequest({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: Web3.utils.toHex(8001) }]
                            });
                        } catch (err) {
                            // This error code indicates that the chain has not been added to MetaMask
                            if (err.code === 4902) {
                                connector.sendCustomRequest({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainName: 'Polygon Testnet',
                                            chainId: Web3.utils.toHex(8001),
                                            nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                                            rpcUrls: ['https://matic-mumbai.chainstacklabs.com']
                                        }
                                    ]
                                });
                            }
                            }
                    }

                    localStorage.setItem('connectedWallet', 'wc');
                    setWalletConnected(true);
                    closeWalletPopup();
                });
    
            }
        }else if(wallet === 'tp'){
            closeWalletPopup();
        } else if(wallet === 'bk'){
            
            const provider = window.bitkeep && window.bitkeep.ethereum;
            console.log(provider)
            if (!provider) {
                window.open('https://bitkeep.com/en/download?type=2');
                throw "Please go to our official website to download!!"
            } else {
                const connect = await provider.request({
                    method: "eth_requestAccounts",
                });
                const chainId = 80001
                if( provider.chainId !== chainId ) {
                    try {
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                             params: [{ chainId: Web3.utils.toHex(chainId) }]
                        });
                    } catch (err) {
                        // This error code indicates that the chain has not been added to MetaMask
                        if (err.code === 4902) {
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainName: 'Polygon Testnet',
                                        chainId: Web3.utils.toHex(chainId),
                                        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                                        rpcUrls: ['https://matic-mumbai.chainstacklabs.com']
                                    }
                                ]
                            });
                        }
                    }
                }
                localStorage.setItem('connectedWallet', 'bk');
                setWalletConnected(true);
                closeWalletPopup();
            }
        }
        
    }

    function disconnectWallet(){
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
        });
        connector.killSession();
        localStorage.removeItem('connectedWallet');
        setWalletConnected(false);
    }

    return (
        <>
        <header id='header' className='header'>
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img src="/img/logo.png" className="d-inline-block align-top" alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Container>
                            <Row>
                                <Col md={8}>
                                <Nav className="nav-menu justify-content-center">
                                    <Nav.Link id='item0' href="/" className='px-3'>Home</Nav.Link>
                                    <Nav.Link id='item1' href="#rewards" className='px-3'>Rewards</Nav.Link>
                                    <Nav.Link id='item2' href="#winners" className='px-3'>Winners</Nav.Link>
                                    <Nav.Link id='item3' href="#lottery" className='px-3'>Lottery</Nav.Link>
                                </Nav>
                                </Col>
                                <Col md={4} className='d-flex justify-sm-none'>
                                <button className={walletConnected === true ? 'connectedBtn' : 'connectBtn'} onClick={walletConnected === true ? ()=>{disconnectWallet()} : ()=>selectWallet()}>
                                    {walletConnected === true ? 'Disconnect Wallet' : 'Connect Wallet' }
                                </button>
                                </Col>
                            </Row>
                        </Container>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        <div className='walletpopup-container'>
        <div className='walletpopup'>
            <div className='walletpopup-head'>
                <h3 className='text-center'>Connect Wallet</h3>
                <button className='walletpopup-close' onClick={closeWalletPopup}>X</button>
            </div>
            <div className='walletpopup-body'>
                <Row>
                    <Col xs={6} sm={6} md={6} className='border-right border-bottom wallet-btn' onClick={()=>{connectWallet('metamask')}}>
                        <img src={MetaMask} alt='metamask' className='walletpopup-img'/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className='border-bottom wallet-btn' onClick={()=>{connectWallet('wc')}}>
                        <img src={Wc} alt='walletconnect' className='walletpopup-img'/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className='border-right d-flex align-items-center wallet-btn' onClick={()=>{connectWallet('wc')}}>
                        <img src={Tp} alt='tokenpocket' className='walletpopup-img'/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className='wallet-btn' onClick={()=>{connectWallet('bk')}}>
                        <img src={Bk} alt='bitkeep' className='walletpopup-img'/>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
    </>
    )
}