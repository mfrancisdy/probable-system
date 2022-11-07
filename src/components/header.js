import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
  } from '@rainbow-me/rainbowkit';
  import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
  } from 'wagmi';
  import { alchemyProvider } from 'wagmi/providers/alchemy';
  import { publicProvider } from 'wagmi/providers/public';
  import { ConnectButton } from '@rainbow-me/rainbowkit';


  const { chains, provider } = configureChains(
    [chain.polygonMumbai],
    [
      alchemyProvider({ apiKey: "49YmnXw90OQ1d2ZRy5hCUcpgi6I6UP6H" }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'Lottery',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })


export default function Header() {

    window.onscroll = function() {scrollFunction()};
    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.getElementById("header").classList.add("header-sticky");
        } else {
            document.getElementById("header").classList.remove("header-sticky");
        }
    }


    return (
        <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
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
                                <Nav className="nav-menu">
                                    <Nav.Link href="#home">Home</Nav.Link>
                                    <Nav.Link href="#link">Link</Nav.Link>
                                </Nav>
                                </Col>
                                <Col md={4}>
                                <ConnectButton className='connectBtn' />
                                </Col>
                            </Row>
                        </Container>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        </RainbowKitProvider>
    </WagmiConfig>
    )
}