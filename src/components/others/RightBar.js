import React from "react";
import { Icon, Segment, Sidebar } from "semantic-ui-react";

export default function RightBar({ children, visible, close }) {
    return (
        <Sidebar
            as={Segment}
            animation="overlay"
            icon="labeled"
            vertical
            visible={visible}
            direction="right"
            width="very wide"
            style={{
                backgroundColor: "#fff",
            }}
        >
            <Segment
                vertical
                style={{ paddingTop: 0, paddingLeft: "1em" }}
                textAlign="left"
            >
                <Icon name="x" size="large" link onClick={close} />
            </Segment>
            <Segment basic>{children}</Segment>
        </Sidebar>
    );
}
