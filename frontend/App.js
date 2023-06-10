import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import {Button, Card, Col, Row, Form} from 'react-bootstrap';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

// //Components
import Votes from "./Components/Votes";
import { async } from 'regenerator-runtime';

export default function App({ isSignedIn, contractId, wallet }) {
  const [options, setOptions] = useState({});
  const [votes, setVotes] = useState({});
  const [available, setAvailable] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inputOption, setInputOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await loadOptions();
      await loadVotes();
      const data = await viewMethod('votesAvailable', { user: wallet.accountId });
      setAvailable(data);
      const data2 = await viewMethod('isUserAdmin', { user: wallet.accountId });
      setIsAdmin(data2);
    }
    fetchData();
  }, []);

  const callMethod = (methodName, args = {}) => {
    return wallet.callMethod({
      contractId: contractId,
      method: methodName,
      args: args,
    });
  };

  const viewMethod = (methodName, args = {}) => {
    return wallet.viewMethod({
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
    await callMethod("clearPools", {user: wallet.accountId});
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

  const addOption = async () => {
    await callMethod("addOption", {
      option: inputOption,
      user: wallet.accountId,
    })
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    setProcessing(false);
    await loadVotes();
  }

  const deleteOption = async (optionId) => {
    await callMethod("deleteOption", {
      optionId,
      user: wallet.accountId,
    })
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
      <Votes options={options} votes={votes} addVote={addVote} available={available} isAdmin={isAdmin} deleteOption={deleteOption}/>
      {(isAdmin) ? (
        <Row>
          <Col>
            <Button
              style={{ marginLeft: '20px' }}
              onClick={reset}
            >
            Reset Pool
            </Button>
          </Col>
          <Col>
            <Form.Control type="text" placeholder="Your option" value={inputOption} onChange={v => {
              console.log(v);
              setInputOption(v.target.value)
            }}/>
            <Button style={{marginTop: 20}} onClick={addOption}>Add Option</Button>
          </Col>
        </Row>
      ) : 
        <Row></Row>
      }      
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
