import React, { Component } from "react";
import web3 from "../ethereum/web3";
import ipfs from "../ethereum/ipfs";
import { Table } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import { getMultihashFromBytes32 } from "../lib/multihash";

class FileDetail extends Component {
  state = {
    ipfsHash: ""
  };
  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = File(this.props.address);
    const returnedHash = await fileInstance.methods.getFileDetail().call({
      from: accounts[0]
    });
    const ipfsHash = {
      digest: returnedHash[0],
      hashFunction: returnedHash[1],
      size: returnedHash[2]
    };
    console.log(ipfsHash);
    this.setState({ ipfsHash: getMultihashFromBytes32(ipfsHash) });

    ipfs.files.get(this.state.ipfsHash, function(err, files) {
      files.forEach(file => {
        console.log(file.path);
        console.log(file.content);
      });
    });
  };
  render() {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">File Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>file name</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Deployed at</Table.Cell>
            <Table.Cell>{this.props.address}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>IPFS Hash</Table.Cell>
            <Table.Cell>{this.state.ipfsHash}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default FileDetail;