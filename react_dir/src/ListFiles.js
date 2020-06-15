import React from 'react';



function ListFiles(props) {

  if(props.data.fileCardState === 'ok') {

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
        <button
          onClick={() => props.deleteAFile(props.num, props.data._id)}
        >Delete</button>
        <button
          onClick={() => props.updateAFile(props.num)}
        >Modify</button>
      </div>
    );
  }

  if(props.data.fileCardState === 'modify') {
      return(

        <div>
          <input
            className="form-control"
            id={'quoteForm'+ props.num}
            defaultValue={props.data.originalname}
            placeholder="Enter quote"
            onChange={(event) => {
              event.preventDefault();
              const q = event.target;
              //console.log(JSON.stringify(q.value));
              props.onModifyChange(0, q.value);
          }}/>
          <button
            onClick={() => props.onModifyValid(props.num)}
          >Confirm</button>
          <button
            onClick={() => props.onModifyCancel(props.num)}
          >Cancel</button>
        </div>

      );
  }

  else {
    return null
  }
}

export default ListFiles;
