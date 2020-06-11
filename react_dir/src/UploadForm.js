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
        <form onSubmit={(e) => props.onFormSubmit(e)}>
          <label for="uploadFile">Choose a file !</label>
          <input style={{display: "none"}} id="uploadFile" type="file" onChange={(e) => props.onChange(e)} />
          <button type="submit">Upload</button>
          {progress()}
        </form>
      )
    }

    return(
      <button onClick={() => props.addAFile()}>Add</button>
    )
  }

  return (
    <div>
      {form()}
    </div>
  );
}

export default UploadForm;
