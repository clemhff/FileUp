import React, {Component} from 'react';
import axios from 'axios';
//import './css/AddQuote.css';

class UploadForm extends Component {

  /*handleChange = (e) => {
    return null
  }*/

  constructor(props) {
    super(props);
    this.state ={
      file:null,
      files: null,
      uploadPercentage: null
    }
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    const data = new FormData();
    data.append("file", this.state.file);
    data.append("file", this.state.file);
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

    axios.post("http://localhost:8090/stats", data, options).then(res => {
        console.log(res)
        this.setState({uploadPercentage: 100 }, ()=>{
        setTimeout(() => {
            this.setState({ uploadPercentage: 0 })
          }, 1000);
        })
    });
    /*fetch('http://localhost:8090/stats', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: data
    })
    .then(response => response.text())
    .then(res => console.log(res));*/

  }

  onChange(e) {
    /*const data = new FormData();
    data.append('inputfile', e.target.files[0]);
    console.log(data.get('inputname'));
    this.setState({file:e.target.files[0]});*/

    const files = e.target.files[0];
    console.log(files);
    this.setState({file: files})
  }



  render () {
    return (
      <form onSubmit={(e) => this.onFormSubmit(e)}>
        <h1>File Upload</h1>
        <input type="file" onChange={(e) => this.onChange(e)} />
        <button type="submit">Upload</button>
        <progress id="file" value={this.state.uploadPercentage} max="100"> {this.state.uploadPercentage}% </progress>
      </form>
    );
  }

}

export default UploadForm;
