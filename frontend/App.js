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
  }

  const loadOptions = async () => {
    const data = await viewMethod("getOptions") || [];
    setOptions(Object.fromEntries(data))
  }

  const loadVotes = async () => {
    const data = await viewMethod("getVotes") || [];
    setVotes(Object.fromEntries(data))
  }

  const addVote = async (vote) => {
    await callMethod("addVote", {
      vote,
      user: wallet.accountId,
    });
  }

  const Home = () =>
    <Container>
      <Row>
        <Col>
          <h2 style={{ marginTop: "20px", marginLeft: '20px' }}>
          Who is the president of the USA?
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
        ? <Home />
        : <Container>
            <Row className='justify-content-center d-flex'>
              <Card style={{ marginTop: "5vh", width: "30vh" }}>
                <Container>
                  <Row>Hey there bud! Please Sign in :D </Row>
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
