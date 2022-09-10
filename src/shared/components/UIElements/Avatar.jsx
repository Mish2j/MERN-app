import React from "react";

import "./Avatar.css";

const Avatar = ({ width, className, style, image, alt }) => {
  return (
    <div className={`avatar ${className}`} style={style}>
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  );
};

export default Avatar;
