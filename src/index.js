import React from "react";
import ReactDOM from "react-dom";
import CryptoJS from "crypto-js";
import Web3 from "web3";
import { DOCPROOF_ADDRESS, DOCPROOF_ABI } from "./contracts/config";
//import Dropzone from "./components/Dropzone/Dropzone";

import Spinner from "react-bootstrap/Spinner";

import Dropzone from "./components/Dropzone/BasicDropzone";

import Button from "react-bootstrap/Button";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      docProof: null,
      account: null
    };

    this.loadBlockchainData = this.loadBlockchainData.bind(this);
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
    this.setState({ account: accounts[0] });
    const docProof = new web3.eth.Contract(DOCPROOF_ABI, DOCPROOF_ADDRESS);
    console.log("doc", docProof);
    this.setState({ docProof });
    const currentFileIndex = await docProof.methods.currentFileIndex().call();
    console.log("currentFileIndex", currentFileIndex);
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
            <Dropzone />
          )}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
