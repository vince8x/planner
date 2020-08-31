import React from 'react';
import { Img } from 'react-image';

const ProjectItemImgStyle = {
  width: '100%',
  borderTopLeftRadius: `calc(.15rem - 1px)`,
  // height: '150px',
  objectFit: 'cover'
};

const ProjectItemImg = ({
  url,
  alt = 'placeholder',
}) => {

  return (
    <Img
      className="project-item-img"
      style={ProjectItemImgStyle}
      draggable={false}
      src={url}
      alt={alt}
    />
  );
}

export default ProjectItemImg;