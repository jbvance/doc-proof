import React from "react";
import ReactDOM from "react-dom";
import CryptoJS from "crypto-js";
//import Dropzone from "./components/Dropzone/Dropzone";

import Dropzone from "./components/Dropzone/BasicDropzone";

import Button from "react-bootstrap/Button";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: null,
      file: null,
      success: null,
      error: null,
      txHash: null,
      buttonLoading: false
    };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange() {
    this.setState({
      success: null,
      error: null,
      txHash: null,
      buttonLoading: false
    });
    const { files } = document.getElementById("file-input");
    console.log("FILES", files);

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      const filePath = window.URL.createObjectURL(files[0]);
      this.setState({ filePath, file: files[0] });

      reader.onloadend = function(f) {
        var file_result = this.result; // this == reader, get the loaded file "result"
        var file_wordArr = CryptoJS.lib.WordArray.create(file_result); //convert blob to WordArray , see https://code.google.com/p/crypto-js/issues/detail?id=67
        var sha256_hash = CryptoJS.SHA256(file_wordArr); //calculate SHA1 hash
        alert("Calculated SHA256:" + sha256_hash.toString()); //output result
      };
      reader.readAsArrayBuffer(file); //read file as ArrayBuffer
    }
  }

  render() {
    //console.log("HASH", CryptoJS.SHA256("testing"));
    return (
      <div>
        <nav className="navbar navbar-dark  bg-dark flex-md-nowrap p-0 mb-5 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
            DOCPROOF
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>
                <a className="nav-link" href="#">
                  <span id="account" />
                </a>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container">
          <h1>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
          <Dropzone />
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
