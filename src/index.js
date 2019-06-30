import React from "react";
import ReactDOM from "react-dom";
import CryptoJS from "crypto-js";

import "./styles.css";

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
    console.log("HASH", CryptoJS.SHA256("testing"));
    console.log(CryptoJS.SHA1("Message"));
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>

        <input
          id="file-input"
          className="file-input"
          type="file"
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
