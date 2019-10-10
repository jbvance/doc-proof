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
      files: [],
      error: []
    };

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      await this.loadBlockchainData();
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
    const docProof = new web3.eth.Contract(DOCPROOF_ABI, DOCPROOF_ADDRESS);
    console.log("doc", docProof);
    this.setState({
      docProof,
      account: accounts[0]
    });
    const currentFileIndex = await docProof.methods.currentFileIndex().call();
    console.log("currentFileIndex", currentFileIndex);
    // window.ethereum.enable().then(accounts => {
    //   const defaultAccount = accounts[0];
    //   web3.eth.defaultAccount = defaultAccount;
    //   this.setState({ account: defaultAccount }, () => {
    //     console.log("ACCOUNT", this.state.account);
    //   });
    // });
  }

  registerFiles(files) {}

  getFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const file_result = reader.result;
        const file_wordArr = CryptoJS.lib.WordArray.create(file_result); //convert blob to WordArray , see https://code.google.com/p/crypto-js/issues/detail?id=67
        const sha256_hash = CryptoJS.SHA256(file_wordArr); //calculate SHA1 hash
        resolve(sha256_hash);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async CreateHashes() {
    try {
      this.setState({ error: [] });
      const { files } = this.state;
      console.log("FILES", files);
      const filesWithHash = [...files];

      filesWithHash.forEach(async file => {
        const hash = await this.getFileHash(file);
        file["hash"] = hash.toString();
        console.log("HASH: " + hash);
        console.log("GOT HERE IN CREATEHASH");
        const fileExistsResult = await this.state.docProof.methods
          .checkFileExists(file.hash)
          .call();
        if (fileExistsResult["fileExists"]) {
          console.log("NOPE, FILE EXISTS");
          this.setState({
            error: [
              ...this.state.error,
              `The file hash for '${
                file.name
              }' has already been uploaded. Please remove it from the file list and try again.`
            ]
          });
          return; // exit here, file already exists
        }
        this.state.docProof.methods
          .registerFile(file.hash, file.name, file.lastModified)
          .send({ from: this.state.account })
          .then(() => console.log("DONE"))
          .catch(err => {
            console.error("ERROR", err.message);
            this.setState({ error: err.message });
          });

        console.log("FILES", filesWithHash);
      });
    } catch (err) {
      console.error("ERROR: ", err);
    }
  }

  handleFileChange(files) {
    this.setState({ error: null });
    const MAX_FILES = 10;
    console.log("Files changed");
    const numFiles = this.state.files.length;
    if (numFiles + files.length > MAX_FILES) {
      this.setState({
        error: "Only 10 file hashes may be uploaded at one time"
      });
    }
    const allowedNumFiles = MAX_FILES - numFiles;
    if (allowedNumFiles <= 0) return;

    let allowedFiles = [];
    const numToAdd =
      allowedNumFiles < files.length ? allowedNumFiles : files.length;
    for (let i = 0; i < numToAdd; i++) {
      allowedFiles.push(files[i]);
    }
    this.setState(
      {
        files: this.state.files.concat(allowedFiles)
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
          Last Modified: {file.lastModified}--
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
  j;

  displayErrors() {
    return this.state.error.map(err => <p>{err}</p>);
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
            <div>
              <Dropzone onFileChange={this.handleFileChange} />
              {this.state.error && this.state.error.length > 0 && (
                <Alert variant="danger" dismissible={false}>
                  {this.displayErrors()}
                </Alert>
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
          )}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
