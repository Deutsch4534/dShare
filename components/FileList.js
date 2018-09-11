import React, { Component } from "react";
import { Card, Dimmer, Loader, Segment } from "semantic-ui-react";
import Link from "next/link";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";

class FileList extends Component {
  state = {
    loadingFiles: false,
    files: []
  };

  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();
    const files = await factory.methods.getMyFiles(accounts[0]).call();
    this.setState({ files: files, loadingFiles: false });
  };

  renderFiles() {
    console.log(this.state.files);
    const items = this.state.files.map(address => {
      return {
        header: address,
        description: (
          <Link href={{ query: { name: address } }}>
            <a>View File</a>
          </Link>
        ),
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        {this.renderFiles()}
        <Loader active={this.state.loadingFiles} inline="centered" />
      </div>
    );
  }
}

export default FileList;