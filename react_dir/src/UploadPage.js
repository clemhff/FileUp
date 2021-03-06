import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import download from 'downloadjs';
import './css/UploadPage.css';


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
      dataListFiles: [],
      formState: false,
      formInput: [],
      auth : true
    }
  }

  //API call
  componentDidMount() {

    if (localStorage.mkt){
      let lToken = localStorage.mkt;
      console.log(lToken);

      fetch(process.env.REACT_APP_API_URL + '/files' ,
      {
        method: 'GET',
        headers: {
           'Authorization': 'Bearer ' + lToken,
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // bad credential
          if (data.error === 'bad credentials' ) {
            data = [];
            localStorage.removeItem('mkt');
            this.setState({ auth : false })
            return data;
          }
          else if (data.error) { // if something went wrong
            data = [];
            localStorage.removeItem('mkt');
            return data;
          }
          else {
            data.map( x => {
              x.fileCardState = 'ok'; // ok modify delete
              return x
            })
            //console.log(JSON.stringify(data));
            return data;
          }
        })
        .then(data => this.setState({ dataListFiles : data }))
        ;
    }
    else {
      this.setState({ auth : false })
    }
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
      },
      headers: {
        'Authorization': 'Bearer ' + localStorage.mkt
      }
    }

    axios.post(process.env.REACT_APP_API_URL + '/file' , data, options).then(res => {
        //console.log(res)
        this.setState({uploadPercentage: 100 }, ()=>{
        setTimeout(() => {
            //console.log('first is' + JSON.stringify(myFile));
            res.data.ops[0].fileCardState ='ok';
            myFile.unshift(res.data.ops[0]);
            //console.log('second is' +  JSON.stringify(myFile));

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

  onModifyChange(cas, value) {
    //console.log('index is ' + i);
    //console.log('index is ' + e);
    this.setState({ formState: true });
     if (cas === 0){
       const q = this.state.formInput.slice();
       q[0]=value;;
       this.setState({ formInput: q });
     }
     else if (cas === 1){
       const q = this.state.formInput.slice();
       q[1]=value;;
       this.setState({ formInput: q });
     }
     else {
       console.log('pas d\'input error');
     }
   }

   onModifyValid(i) {
     if(this.state.formState){
        const temp = this.state.dataListFiles.slice();
        temp[i].fileCardState ='ok';
        if (this.state.formInput[1] !== null && this.state.formInput[1]){
          temp[i].filename = this.state.formInput[1];
        }
        if (this.state.formInput[0] !== null && this.state.formInput[0]){
          temp[i].originalname = this.state.formInput[0];
        }
        const obj = {
            'originalname' : temp[i].originalname,
            'filename' : temp[i].filename
          }

        fetch(process.env.REACT_APP_API_URL + '/file/'  + temp[i]["_id"] , {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.mkt
          },
          body: JSON.stringify(obj)
        })
         //mettre un contrôle erreur API
         .then (() => this.setState({ dataListFiles: temp, formInput: [], formState: false, addFile: false }));


      }
      else {
        const temp = this.state.cards.slice();
        temp[i].cardState ='ok';
        console.log(JSON.stringify(temp[i].cardState));
        this.setState({ cards: temp, formInput: [], formState: false, addFile: false });
      }
   }

   onModifyCancel(i)  {
     const temp = this.state.dataListFiles.slice();
     temp[i].fileCardState ='ok';
     this.setState({ dataListFiles: temp, formInput: [], formState: false });
   }


  addAFile() {
    const listFiles = this.state.dataListFiles.slice();
    listFiles.map( (x) => {
       if (x.fileCardState === 'modify'){
         x.fileCardState ='ok'
       }
       return x ;
     });
    this.setState({ dataListFiles : listFiles, addFile:true});
  }

  deleteAFile(i, id) {
    fetch(process.env.REACT_APP_API_URL + '/file/' + id , {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.mkt
      }
    })
    .then(response => response.text())
    .then(res => {
      const listFiles = this.state.dataListFiles.slice();
      listFiles[i].fileCardState = 'delete'
      this.setState({ dataListFiles : listFiles, addFile:false});
    });

  }

  updateAFile(i) {
    console.log('update ' + i)
    const listFiles = this.state.dataListFiles.slice();
    listFiles.map( (x) => {
       if (x.fileCardState === 'modify'){
         x.fileCardState ='ok'
       }
       return x ;
     });
    listFiles[i].fileCardState = 'modify';
    this.setState({ dataListFiles : listFiles, addFile:false});
  }

  async onDownload (e, i) {
    const listFiles = this.state.dataListFiles.slice();
    console.log('id file ' + listFiles[i]._id);
    const res = await fetch(process.env.REACT_APP_API_URL + '/download/' + listFiles[i]._id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.mkt
      }
    });
    const blob = await res.blob();
    var objectURL = URL.createObjectURL(blob);
    download(objectURL, listFiles[i].originalname);
  }



  render () {

    let divFiles = this.state.dataListFiles.map((el, index) => {

         return (
           <ListFiles
            key={index}
            num = {index}
            data = {this.state.dataListFiles[index]}
            url = {process.env.REACT_APP_API_URL + '/download/'}
            deleteAFile = {(i, id) => this.deleteAFile(i, id)}
            updateAFile = {(i) => this.updateAFile(i)}
            onModifyChange = {(i, e) => this.onModifyChange(i, e)}
            onModifyValid = {(i) => this.onModifyValid(i)}
            onModifyCancel = {(i) => this.onModifyCancel(i)}
            onDownload = {(e, i) => this.onDownload(e, i)}
           />
         );

    })

    let htmlPage = () => {
      if (this.state.auth === false) {
        return <Redirect to="/login" /> ;
      }
      else {
        return (
          <div>
            <div className="title_div">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <UploadForm
                      uploadPercentage ={this.state.uploadPercentage}
                      addFile = {this.state.addFile}
                      onFormSubmit = {(e) => this.onFormSubmit(e)}
                      onChange = {(e) => this.onChange(e)}
                      addAFile = {(id) => this.addAFile(id)}
                    />
                    {divFiles}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }


    return (
      <div>
        {htmlPage()}
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
