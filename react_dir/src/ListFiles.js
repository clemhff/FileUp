import React from 'react';



function ListFiles(props) {

  if(props.data.fileCardState === 'ok') {

    return (
      <div>
        <div className="card cardf">
          <div className="card-body">
              <h5>{props.data.originalname}</h5>
              <div>{props.data.mimetype}</div>
              <div>{props.data.size} Bytes </div>
              <button
                class="btn btn-danger list-delete"
                onClick={() => props.deleteAFile(props.num, props.data._id)}
              >Delete</button>
              <button
                class="btn btn-warning list-modify"
                onClick={() => props.updateAFile(props.num)}
              >Modify</button>
              <button
                class="btn btn-primary list-modify"
                onClick={(e) => props.onDownload(e, props.num)}
              >Download </button>
          </div>
        </div>
      </div>
    );
  }

  if(props.data.fileCardState === 'modify') {
      return(

        <div>
          <div className="card cardf">
            <div className="card-body">
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
                class="btn btn-success list-delete"
                onClick={() => props.onModifyValid(props.num)}
              >Confirm</button>
              <button
                class="btn btn-danger list-modify"
                src = {props.url + props.data._id}
                onClick={() => props.onModifyCancel(props.num)}
              >Cancel</button>
          </div>
        </div>
      </div>

      );
  }

  else {
    return null
  }
}

export default ListFiles;
