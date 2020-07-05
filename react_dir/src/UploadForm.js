import React from 'react';


function UploadForm(props) {

  const progress = () => {
    if (props.uploadPercentage ){
      return (
        <progress id="file" value={props.uploadPercentage} max="100"> {props.uploadPercentage}% </progress>
      )
    }

    return(
      null
    )
  }

  const form = () => {
    if (props.addFile === true ){
      return (
        <div className="card cardu">
          <div className="card-body">
            <form>
              <label class="btn btn-info form-button-choose" for="uploadFile">Choose a file !</label>
              <input style={{display: "none"}} id="uploadFile" type="file" onChange={(e) => props.onChange(e)} />
              <button
                onClick={(e) => props.onFormSubmit(e)}
                class="btn btn-success form-button-upload"
              >Upload</button>
              {progress()}
            </form>
          </div>
        </div>
      )
    }

    return(
      <div className="card cardu">
        <div className="card-body">
          <button class="btn btn-success form-button-add" onClick={() => props.addAFile()}>Add</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {form()}
    </div>
  );
}

export default UploadForm;
