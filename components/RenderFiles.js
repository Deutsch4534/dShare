import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import Link from "next/link";

class RenderFiles extends Component {
  render() {
    const items = this.props.files.map(address => {
      return {
        header: address,
        description: (
          <Link
            href={{
              pathname: "/files/view",
              query: {
                fileContract: address,
                isShared: this.props.isShared,
                isArchived: this.props.isArchived
              }
            }}
          >
            <a>View File</a>
          </Link>
        ),
        fluid: true,
        key: address
      };
    });
    return <Card.Group items={items} />;
  }
}

export default RenderFiles;