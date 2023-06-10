import { Near } from 'near-api-js';
import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Row, Col } from 'react-bootstrap';
import { async } from 'regenerator-runtime';

const contractId = process.env.CONTRACT_NAME;

const Votes = ({ options, votes, addVote, available, isAdmin, deleteOption, processing, accountId}) => {
  return (
      <Table style={{ margin: '20px' }} striped bordered hover>
        <thead>
          <tr>
            <th>Options</th>
            <th>Votes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(options).map((index) =>
            <tr key={index}>
              <td>{options[index]}</td>
              <td>
                Count: {votes[index] ? votes[index].length : 0}
              </td>
              
              <td>
                {available ? <Button disabled={processing} onClick={() => addVote(index)}>Vote</Button> : null}
                {isAdmin ? <Button disabled={processing} variant='danger' style={{marginLeft: 16}} onClick={() => deleteOption(index)}>Delete</Button> : null}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
  );
};

export default Votes;
