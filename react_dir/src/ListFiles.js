import React from 'react';



function ListFiles(props) {

  return (
    <div>
    <div>'//////////////////////////////////////////////////////////////////////////////////'</div>
      <div>{props.data._id}</div>
      <div>{props.data.fieldname}</div>
      <div>{props.data.originalname}</div>
      <div>{props.data.encoding}</div>
      <div>{props.data.mimetype}</div>
      <div>{props.data.destination}</div>
      <div>{props.data.filename}</div>
      <div>{props.data.path}</div>
      <div>{props.data.size}</div>
    </div>
  );

}

export default ListFiles;
