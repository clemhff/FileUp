import React, {Component} from 'react';
import axios from 'axios';
//import './css/AddQuote.css';


import UploadForm from './UploadForm';
import ListFiles from './ListFiles';

class UploadPage extends Component {

  /*handleChange = (e) => {
    return null
  }*/

  constructor(props) {
    super(props);
    this.state ={
      file:null,
      uploadPercentage: null,
      addFile:false
    }
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    const data = new FormData();
    data.append("file", this.state.file);
    //data.append("file", this.state.file);
    console.log(...data);


    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total )
        console.log( `${loaded}kb of ${total}kb | ${percent}%` );

        if( percent < 100 ){
          this.setState({ uploadPercentage: percent })
        }
      }
    }

    axios.post("http://localhost:8090/file", data, options).then(res => {
        console.log(res)
        this.setState({uploadPercentage: 100 }, ()=>{
        setTimeout(() => {
            this.setState({ addFile:false, uploadPercentage: null })
          }, 1000);
        })
    });

  }

  onChange(e) {

    const files = e.target.files[0];
    console.log(files);
    this.setState({file: files})
  }


  addAFile() {
    this.setState({ addFile:true })
  }




  render () {
    return (
      <div>
        <UploadForm
          uploadPercentage ={this.state.uploadPercentage}
          addFile = {this.state.addFile}
          onFormSubmit = {(e) => this.onFormSubmit(e)}
          onChange = {(e) => this.onChange(e)}
          addAFile = {() => this.addAFile()}
        />
        <ListFiles

        />
      </div>
    );
  }

}

export default UploadPage;





/*fetch('http://localhost:8090/stats', {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    body: data
})
.then(response => response.text())
.then(res => console.log(res));*/
