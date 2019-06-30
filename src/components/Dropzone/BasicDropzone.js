import React, { Component } from "react";
import Dropzone from "react-dropzone";
import moment from "moment";

import "./Dropzone.css";
import CryptoJS from "crypto-js";

import Button from "react-bootstrap/Button";

class Basic extends Component {
  constructor() {
    super();

    this.state = {
      files: []
    };

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({
      files: this.state.files.concat(files)
    });
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
    reader.readAsText(file, "UTF-8");
  }

  CreateHashes() {
    const { files } = this.state;
    files.forEach(file => {
      this.setupReader(file);
    });
  }

  render() {
    //const maxSize = 1048576;
    const maxSize = 52428800;
    //console.log(this.state.files)
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.type} -{" "}
        {moment(file.lastModified).format("MM-DD-YYYY HH:mm:ss")}
      </li>
    ));

    return (
      <div>
        <div className="text-center mt-5">
          <Dropzone
            onDrop={this.onDrop}
            minSize={0}
            maxSize={maxSize}
            multiple={true}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragReject,
              rejectedFiles
            }) => {
              const isFileTooLarge =
                rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
              return (
                <div
                  {...getRootProps()}
                  className={`Dropzone ${isDragActive ? "Highlight" : ""}`}
                >
                  <input {...getInputProps()} />
                  {!isDragActive && "Click here or drop a file to upload!"}
                  {isDragActive && !isDragReject && "Drop it like it's hot!"}
                  {isDragReject && "File type not accepted, sorry!"}
                  {isFileTooLarge && (
                    <div className="text-danger mt-2">File is too large.</div>
                  )}
                </div>
              );
            }}
          </Dropzone>
        </div>
        <div>
          <h4>Files</h4>
          {files}
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
    );
  }
}

export default Basic;
