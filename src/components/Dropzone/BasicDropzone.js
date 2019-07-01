import React from "react";
import Dropzone from "react-dropzone";
import "./Dropzone.css";

const Basic = props => {
  const onDrop = files => {
    props.onFileChange(files);
  };

  //const maxSize = 1048576;
  const maxSize = 52428800;
  //console.log(this.state.files)

  return (
    <div>
      <div className="text-center mt-5">
        <Dropzone onDrop={onDrop} minSize={0} maxSize={maxSize} multiple={true}>
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
    </div>
  );
};

export default Basic;
