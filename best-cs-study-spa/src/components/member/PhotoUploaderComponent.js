import React, { Component, useMemo, useCallback } from 'react'
import Dropzone, {useDropzone} from 'react-dropzone';
import { Loading } from '../LoadingComponent';

const dropzoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
const dropzoneStyleActive = {
  borderColor: '#2196f3'
};

const dropzoneStyleAccept = {
  borderColor: '#00e676'
};

const dropzoneStyleReject = {
  borderColor: '#ff1744'
};

function PhotoUploader(props) {

    const onDrop = useCallback(acceptedFiles => {
        props.handleDroppedFiles(acceptedFiles);
    });

    const {
      acceptedFiles,
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({onDrop, accept: 'image/*'});
    
    const style = useMemo(() => ({
      ...dropzoneStyle,
      ...(isDragActive ? dropzoneStyleActive : {}),
      ...(isDragAccept ? dropzoneStyleAccept : {}),
      ...(isDragReject ? dropzoneStyleReject : {})
    }), [
      isDragActive,
      isDragReject
    ]);

    const files = props.files.map((file, index) => (
      <div key={file.path} className="row">
        <div className="col-md-6 align-self-center">
          {file.path} ({file.size} bytes)
        </div>
        <div className="col-md-6 text-md-right my-1">
        
          <button className="btn btn-sm btn-success mx-1" onClick={(event)=>{props.handleUploadFile(index)}} disabled={props.isUploadingPhoto}>Upload</button>
          <button className="btn btn-sm btn-danger mx-1" onClick={(event)=>{props.handleRemoveFile(index)}} disabled={props.isUploadingPhoto}>Remove</button>
  
        </div>
      </div>
    ));
  
    return (
      <div className="row mt-3">
        <div className="col-md-4 mt-2">
          <h4>Add Photos</h4>
          <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <i className="fa fa-upload fa-3x mt-1"></i>
            <p className="my-1">Drop files or click to select files</p>
          </div>
        </div>
        {
          props.files.length>0?
          <div className="col-md-8 mt-2">
            <h4>Files to Upload</h4>
            {
              props.isUploadingPhoto?<Loading text="Uploading. . ."/>:null
            }
            <div>{files}</div>
          </div>
          :null
        }
      </div>
    );
}

export default PhotoUploader;