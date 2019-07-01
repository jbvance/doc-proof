import React from "react";
import ReactDOM from "react-dom";
import CryptoJS from "crypto-js";
import Web3 from "web3";
import { DOCPROOF_ADDRESS, DOCPROOF_ABI } from "./contracts/config";
import moment from "moment";
//import Dropzone from "./components/Dropzone/Dropzone";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import Dropzone from "./components/Dropzone/BasicDropzone";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      docProof: null,
      account: null,
      files: []
    };

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      //await this.loadBlockchainData();
      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "localhost:7545");
    const network = await web3.eth.net.getNetworkType();
    console.log("network:", network);
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    this.setState({ account: accounts[0] });
    const docProof = new web3.eth.Contract(DOCPROOF_ABI, DOCPROOF_ADDRESS);
    console.log("doc", docProof);
    this.setState({ docProof });
    const currentFileIndex = await docProof.methods.currentFileIndex().call();
    console.log("currentFileIndex", currentFileIndex);
  }

  setupReader(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const file_result = reader.result;
      //alert(file_result);
      const file_wordArr = CryptoJS.lib.WordArray.create(file_result); //convert blob to WordArray , see https://code.google.com/p/crypto-js/issues/detail?id=67
      const sha256_hash = CryptoJS.SHA256(file_wordArr); //calculate SHA1 hash
      alert("Calculated SHA256:" + sha256_hash.toString()); //output result
    };
    reader.readAsArrayBuffer(file);
  }

  CreateHashes() {
    const { files } = this.state;
    files.forEach(file => {
      this.setupReader(file);
    });
  }

  handleFileChange(files) {
    console.log("Files changed");
    this.setState(
      {
        files: this.state.files.concat(files)
      },
      () => console.log(this.state.files)
    );
  }

  renderFileList() {
    return this.state.files.map(file => (
      <li key={file.name}>
        <Alert
          variant="success"
          dismissible={true}
          onClose={e => this.removeFile(file.name)}
        >
          File Name: {file.name} <br />
          File Type: {file.type}
          <br />
          Last Modified:{" "}
          {moment(file.lastModified).format("MM-DD-YYYY HH:mm:ss")}
        </Alert>
      </li>
    ));
  }

  removeFile(fileName) {
    const updatedFiles = [...this.state.files].filter(
      file => file.name !== fileName
    );
    this.setState({ files: updatedFiles });
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
          {this.state.loading ? (
            <div>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              <span>...Loading</span>
            </div>
          ) : (
            <Dropzone onFileChange={this.handleFileChange} />
          )}
          <div className="file-list">
            <h4>Files</h4>
            {this.renderFileList()}
          </div>
          <div>
            <Button
              disabled={this.state.files.length < 1}
              variant="primary"
              onClick={e => this.CreateHashes()}
            >
              Upload File Hashes
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
