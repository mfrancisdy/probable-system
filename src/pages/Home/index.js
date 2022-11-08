import React, {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Scroll1img from '../../assets/Images/scroll1win.png';
import Scroll3img from '../../assets/Images/lottery.png';
import BuyForm from '../../components/buyform';
import WinnerList from '../../components/winnerlist';
import Chart from '../../assets/Images/chart.png';
import Users from '../../assets/Images/users.png';
import MetaMask from '../../assets/Images/meta.png';
import Wc from '../../assets/Images/wc.png';
import Tp from '../../assets/Images/tp.png';
import Bk from '../../assets/Images/bk.png';
import Web3 from 'web3';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

window.Buffer = require('buffer/').Buffer;

export default function Home() {

    const closeWalletPopup = () => {
        document.querySelector('.walletpopup-container').classList.remove('show');
    }

    const [walletConnected, setWalletConnected] = useState(false);

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
                                            chainName: 'Polygon Mainnet',
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
                    localStorage.setItem('connectedWallet', 'metamask');
                    closeWalletPopup();
                });
            } else {
                connector.on("connect", (error, payload) => {
                    if (error) {
                        throw error;
                    }
                    localStorage.setItem('connectedWallet', 'wc');
                    closeWalletPopup();
                });
    
            }
        }else if(wallet === 'tp'){
            closeWalletPopup();
        }else if(wallet === 'bk'){
            
            const provider = window.bitkeep && window.bitkeep.ethereum;
            console.log(provider)
            if (!provider) {
                window.open('https://bitkeep.com/en/download?type=2');
                throw "Please go to our official website to download!!"
            } else {

            }
        }
        
    }
    
    return(
        <>
        <section className='scroll1'>
            <Container fluid>
                <Row className='scroll1-row'>
                    <Col md={6} className='scroll1-col1'>
                        <h4>Win lottery online</h4>
                        <h2>Just One Click</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                        <button className='btn btn-primary scroll1-btn'>Enter lottery</button>
                    </Col>
                    <Col md={6} className='scroll1-col2 d-none d-sm-none d-md-block'>
                        <img src={Scroll1img} alt='scroll1' />
                    </Col>
                </Row>
            </Container>
        </section>
        <section className='scroll2'>
            <Container>
                <Row>
                    <Col md={12}>
                        <h2 className='text-center text-white'>follow These Easy Steps </h2>
                        <p className='text-center py-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                        <Row className='scroll2-row gx-5 gy-5 py-5'>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
                                </div>
                            </Col>
                            <Col md={4} className='scroll2-col'>
                                <div className='steps-box'>
                                    <h4 className='box-sub-head'>Step 1</h4>
                                    <h3 className='box-head'>Buy Tickets</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,</p>
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
                        <p className='text-dark text-center py-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                    </Col>
                </Row>
                <Row className='scroll4-row'>
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
                        <h2 className='theme-text'>Reward Distribution</h2>
                        <p className='theme-text py-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                    </Col>
                </Row>
            </Container>
        </section>
        <section className='scroll6'>
            <Container>
                <Row className='theme-bg py-5 px-5 m-0 d-winners'>
                    <Col md={6}>
                        <h5>get a chance to win!</h5>
                        <h2 className='text-white py-3'>Daily Winners</h2>
                        <p className='d-winners-text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.</p>
                        <div className='d-inline-block mt-3'>
                            <button className='btn btn-primary scroll6-btn'>Get Started</button>
                            <button className='btn btn-primary scroll6-btn-tp'>View More</button>
                        </div>
                    </Col>
                    <Col md={6} className='d-none d-sm-none d-md-block'>
                        <img src={Users} alt='users' className='users-img'/>
                    </Col>
                </Row>
            </Container>
        </section>
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
                        <Col xs={6} sm={6} md={6} className='border-right d-flex align-items-center wallet-btn' onClick={()=>{connectWallet('tp')}}>
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