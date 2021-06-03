import React, { useState } from "react";
import {
  Button,
  Container,
  Dimmer,
  Icon,
  Image,
  Segment,
} from "semantic-ui-react";
import ReactPanZoom from "react-image-pan-zoom-rotate";

function ZoomImage({ image, callback }) {
  return (
    <div style={{ width: "100%", overflow: "hidden", height: "80vh" }}>
      <div style={{width: 500, margin: "auto"}}>
        <ReactPanZoom
          image={image}
          alt="document image"
        />
      </div>
    </div>
  );
}

export default ZoomImage;
