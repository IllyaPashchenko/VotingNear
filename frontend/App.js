import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import {Button, Card, Col, Modal, Row, } from 'react-bootstrap';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

// //Components
import Votes from "./Components/Votes";

export default function App({ isSignedIn, contractId, wallet }) {
  const [options, setOptions] = useState({});
  const [votes, setVotes] = useState({});
  const [available, setAvailable] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await loadOptions();
      await loadVotes();
      const data = await viewMethod('votesAvailable', { user: wallet.accountId })
      setAvailable(data)
    }
    fetchData();
  }, []);

  const callMethod = async (methodName, args = {}) => {
    wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const viewMethod = async (methodName, args = {}) => {
    return await wallet.viewMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const signInFun = () => {
    wallet.signIn();
  };

  const signOutFun = () => {
    wallet.signOut();
  };

  const reset = async () => {
    await callMethod("clearPools");
    await loadOptions();
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 10000))
    setProcessing(false);
    await loadVotes();
    setAvailable(true);
  }

  const loadOptions = async () => {
    const data = await viewMethod("getOptions");
    setOptions(Object.fromEntries(data))
  }

  const loadVotes = async () => {
    const data = await viewMethod("getVotes");
    setVotes(Object.fromEntries(data))
  }

  const addVote = async (vote) => {
    await callMethod("addVote", {
      vote,
      user: wallet.accountId,
    });
    setAvailable(false);
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    setProcessing(false);
    await loadVotes();
  }

  const Home = () =>
    <Container>
      <Row>
        <Col>
          <h2 style={{ marginTop: "20px", marginLeft: '20px' }}>
          Хто буде старостою ІА-94?
          </h2>
        </Col>
      </Row>
      <Votes options={options} votes={votes} addVote={addVote} available={available} />
      <Row>
        <Col>
          <Button
            style={{ marginLeft: '20px' }}
            onClick={reset}
          >
            Reset Pool
          </Button>
        </Col>
      </Row>
    </Container>

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            Pooling 
            {processing ? <span style={{color: 'yellow'}}> [Processing] </span> : null}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto"></Nav>
            <Nav>
              <Nav.Link onClick={isSignedIn ? signOutFun : signInFun}>
                {isSignedIn ? wallet.accountId : 'Login'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isSignedIn
        ? <Home></Home>
        : <Container>
            <Row className='justify-content-center d-flex'>
              <Card style={{ marginTop: "5vh", width: "30vh" }}>
                <Container>
                  <Row>Please Log in</Row>
                  <Row className='justify-content-center d-flex'>
                    <Button style={{ margin: "5vh" }} onClick={signInFun}>
                      Login
                    </Button>
                  </Row>
                </Container>
              </Card>
            </Row>
          </Container>
      }

    </Router>
  );
}
