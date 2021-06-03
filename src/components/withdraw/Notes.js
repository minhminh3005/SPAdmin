import React, { useEffect, useState } from "react";
import { Dimmer, Header, Icon, Segment } from "semantic-ui-react";
import { get } from "../../utils/api";

function Notes({ id, onClose }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    id && get(`/fund-service/withdraw/logs?id=${id}`, (data) => setData(data));
  }, [id]);

  return (
    id &&
    data && (
      <Dimmer active page>
        <Segment
          textAlign="right"
          style={{ height: 300, overflow: "auto", width: 600 }}
        >
          <Icon
            name="x"
            onClick={onClose}
            color="black"
            link
            style={{ position: "absolute", top: "1em", right: "1em" }}
            size="large"
          />
          <Header textAlign="left">Withdraw logs</Header>
          <Segment vertical textAlign="left">
            {data.map((item, index) => (
              <p key={index} style={{ color: "#000" }}>
                {item}
              </p>
            ))}
          </Segment>
        </Segment>
      </Dimmer>
    )
  );
}

export default Notes;
