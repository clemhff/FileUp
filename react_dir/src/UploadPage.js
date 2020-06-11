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
      addFile:false,
      dataListFiles: []
    }
  }

  //API call
  componentDidMount() {
      fetch(process.env.REACT_APP_API_URL + '/lastentries')
        .then(response => response.json())
        .then(data => {
          data.map( x => {
            x.fileCardState = 'ok'; // ok modify delete
            return x
          })
          //console.log(JSON.stringify(data));
          return data;

        })
        .then(data => this.setState({ dataListFiles : data }))
      ;
   }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    const data = new FormData();
    const myFile = this.state.dataListFiles.slice();
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
        //console.log(res)
        this.setState({uploadPercentage: 100 }, ()=>{
        setTimeout(() => {
            console.log('first is' + JSON.stringify(myFile));
            myFile.unshift(res.data);
            console.log('second is' +  JSON.stringify(myFile));

            this.setState({ dataListFiles : myFile, addFile:false, uploadPercentage: null });
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

    let divFiles = this.state.dataListFiles.map((el, index) => {

         return (
           <ListFiles
            key={index}
            num = {index}
            data = {this.state.dataListFiles[index]}
           />
         );

    })


    return (
      <div>
        <UploadForm
          uploadPercentage ={this.state.uploadPercentage}
          addFile = {this.state.addFile}
          onFormSubmit = {(e) => this.onFormSubmit(e)}
          onChange = {(e) => this.onChange(e)}
          addAFile = {() => this.addAFile()}
        />
        {divFiles}
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
