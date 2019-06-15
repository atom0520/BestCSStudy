import React, { Component, useMemo, useCallback } from 'react'
import styles from './PhotoEditorComponent.module.scss';
import Dropzone, {useDropzone} from 'react-dropzone';
import { connect } from 'react-redux';
import { uploadUserPhoto, setUserMainPhoto, deleteUserPhoto, setUserMainPhotoUrl } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { Loading } from './LoadingComponent';
import PhotoUploader from './PhotoUploaderComponent';

// const dropzoneStyle = {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '20px',
//     borderWidth: 2,
//     borderRadius: 2,
//     borderColor: '#eeeeee',
//     borderStyle: 'dashed',
//     backgroundColor: '#fafafa',
//     color: '#bdbdbd',
//     outline: 'none',
//     transition: 'border .24s ease-in-out'
//   };
  
// const dropzoneStyleActive = {
//   borderColor: '#2196f3'
// };

// const dropzoneStyleAccept = {
//   borderColor: '#00e676'
// };

// const dropzoneStyleReject = {
//   borderColor: '#ff1744'
// };

// function PhotoUploader(props) {

//     const onDrop = useCallback(acceptedFiles => {
//         props.handleDroppedFiles(acceptedFiles);
//     });

//     const {
//       acceptedFiles,
//       getRootProps,
//       getInputProps,
//       isDragActive,
//       isDragAccept,
//       isDragReject
//     } = useDropzone({onDrop});
    
//     const style = useMemo(() => ({
//       ...dropzoneStyle,
//       ...(isDragActive ? dropzoneStyleActive : {}),
//       ...(isDragAccept ? dropzoneStyleAccept : {}),
//       ...(isDragReject ? dropzoneStyleReject : {})
//     }), [
//       isDragActive,
//       isDragReject
//     ]);

//     const files = props.files.map((file, index) => (
//       <div key={file.path} className="row">
//         <div className="col-md-6 align-self-center">
//           {file.path} ({file.size} bytes)
//         </div>
//         <div className="col-md-6 text-md-right my-1">
        
//           <button className="btn btn-sm btn-success mx-1" onClick={(event)=>{props.handleUploadFile(index)}} disabled={props.isUploadingPhoto}>Upload</button>
//           <button className="btn btn-sm btn-danger mx-1" onClick={(event)=>{props.handleRemoveFile(index)}} disabled={props.isUploadingPhoto}>Remove</button>
  
//         </div>
//       </div>
//     ));
  
//     return (
//       <div className="row mt-3">
//         <div className="col-md-4 mt-2">
//           <h4>Add Photos</h4>
//           <div {...getRootProps({style})}>
//             <input {...getInputProps()} />
//             <i className="fa fa-upload fa-3x mt-1"></i>
//             <p className="my-1">Drop files or click to select files</p>
//           </div>
//         </div>
//         {
//           props.files.length>0?
//           <div className="col-md-8 mt-2">
//             <h4>Files to Upload</h4>
//             {
//               props.isUploadingPhoto?<Loading text="Uploading. . ."/>:null
//             }
//             <div>{files}</div>
//           </div>
//           :null
//         }
//       </div>
//     );
// }

const mapStateToProps = state => {
  return {
      auth: state.auth
  }
}

const mapDispatchToProps = dispatch => ({
  uploadUserPhoto: (userId, file, onSuccess, onError) => { dispatch(uploadUserPhoto(userId, file, onSuccess, onError)) },
  setUserMainPhoto: (userId, photoId, onSuccess, onError) => { dispatch(setUserMainPhoto(userId, photoId, onSuccess, onError)) },
  setUserMainPhotoUrl: (url) => { dispatch(setUserMainPhotoUrl(url)) },
  deleteUserPhoto: (userId, photoId, onSuccess, onError) => { dispatch(deleteUserPhoto(userId, photoId, onSuccess, onError)) }
});

class PhotoEditor extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            files: [],
            isUploadingPhoto: false
        };

        this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
        this.setMainPhoto = this.setMainPhoto.bind(this);
        this.handleDeletePhoto = this.handleDeletePhoto.bind(this);
    }

    handleDroppedFiles = (files=> {
      console.log("PhotoEditor.handleDroppedFiles",files);
      this.setState({files});
    });

    handleUploadFile = (index=>{
      this.setState({isUploadingPhoto: true});
      const file = this.state.files[index]
      console.log("PhotoEditor.handleUploadFile",file);
      this.props.uploadUserPhoto(this.props.auth.decodedToken.nameid, file,
        (res)=>{
          console.log(res);
          const photo = {
            id: res.id,
            url: res.url,
            description: res.description,
            dateAdded: res.dateAdded,
            isMain: res.isMain
          };

          console.log(photo);
          this.props.handleUploadedPhoto(photo);

          if(photo.isMain){
            this.props.handleSetMainPhoto(photo.id);
            this.props.setUserMainPhotoUrl(photo.url);
          }

          this.handleRemoveFile(index);
          alertifyService.success(`Uploaded file ${file.path} successfully!`);
          this.setState({isUploadingPhoto: false});
        },
        (error)=>{
          alertifyService.error(error.message);
          this.setState({isUploadingPhoto: false});
        });
    });

    handleRemoveFile = (index=>{
      console.log("PhotoEditor.handleRemoveFile", index);
      var files = [...this.state.files];
      files.splice(index,1);
      this.setState({files: files})
    });

    setMainPhoto = (photoId)=>{
      this.props.setUserMainPhoto(this.props.auth.decodedToken.nameid, photoId, 
        ()=>{

          this.props.handleSetMainPhoto(photoId);

          alertifyService.success(`Set photo ${photoId} as main photo successfully!`);
        },
        (error)=>{
          alertifyService.error(error.message);
        });
    }

    handleDeletePhoto = (photoId)=>{
      alertifyService.confirm('Are you sure you want to delete this photo?', ()=>{
        this.props.deleteUserPhoto(this.props.auth.decodedToken.nameid, photoId,
          ()=>{
            this.props.handleDeletedPhoto(photoId);
            alertifyService.success(`Deleted photo ${photoId} successfully!`);

          },
          (error)=>{
            alertifyService.error(error.message);
          })
      });
    }
    
    render() {
        return(
            <div className="container">
              {
                  this.props.photos && this.props.photos.length>0?
                  <div className="row mt-3">
                    {
                        this.props.photos.map(photo=>{
                            return(
                                <div key={photo.id} className="col-sm-6 col-md-4 col-lg-3 my-1 text-center">
                                    <img src={photo.url} className={"img-thumbnail p-1 "+styles.imgThumbnail} alt="" />
                                    <div className="text-center mt-1">
                                        <button type="button" className={"mr-1 btn btn-sm "+(photo.isMain?"btn-success active":"btn-secondary")} 
                                          onClick={(e)=>{this.setMainPhoto(photo.id)}}
                                          disabled={photo.isMain}
                                        >Main</button>
                                        <button type="button" className="btn btn-sm btn-danger"
                                          onClick={(e)=>{this.handleDeletePhoto(photo.id)}}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div> 
                                </div>
                            );
                        })
                    }
                  </div>
                  :null
                }
                <PhotoUploader 
                  files = {this.state.files}
                  handleDroppedFiles = {this.handleDroppedFiles}
                  handleUploadFile = {this.handleUploadFile}
                  handleRemoveFile = {this.handleRemoveFile}
                  isUploadingPhoto = {this.state.isUploadingPhoto}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoEditor);