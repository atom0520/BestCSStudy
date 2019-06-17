import React, { Component, useCallback } from 'react'
import { createPost } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';
import { postCategoryOptions } from "../shared/global";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

import Autosuggest from 'react-autosuggest'
import './CreatePostComponent.css';
import Dropzone, {useDropzone} from 'react-dropzone';
import { required, minLength, maxLength } from '../shared/validators';
import styles from './CreatePostComponent.module.scss';

function states () {
    return [
      {name: 'Web Development'},
      {name: 'Machine Learning'},
      {name: 'Game Development'},
      {name: 'Virtual Reality'}
    ]
  }

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => ({
    // createPost: (title, description, category, tags, links, images, onSuccess, onError) => { dispatch(createPost(title, description, category, tags, links, images, onSuccess, onError)) }
});

const minTitleLength = 4;
const maxTitleLength = 100;
const minDescriptionLength = 20;
const maxDescriptionLength = 800;
const maxTagNumber = 5;
const maxImageNumber = 5;

class PostForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                fields:{
                    title: {
                        value:''
                    },
                    description: {
                        value:''
                    },
                    category: {
                        value:''
                    },
                    links: [
                        {
                            value:''
                        }
                    ],
                    tags: {
                        value:[]
                    },
                    images: {
                        value:[]
                    }
                },
                mainImage:0,
                isUploadingImage: false,
                valid: false,
                touched: false
            }
            
        }

        this.handleInputChangeTags = this.handleInputChangeTags.bind(this);
        this.handleFormArrayFieldChange = this.handleFormArrayFieldChange.bind(this);
        this.handleFormArrayFieldBlur = this.handleFormArrayFieldBlur.bind(this);
        this.onClickAddLinkButton = this.onClickAddLinkButton.bind(this);
        this.onClickRemoveLinkButton = this.onClickRemoveLinkButton.bind(this);

        this.onInputAcceptedImage = this.onInputAcceptedImage.bind(this);
        this.onInputRejectedImage = this.onInputRejectedImage.bind(this);
        this.onImageFileDialogCancel = this.onImageFileDialogCancel.bind(this);
        // this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);

        this.tagsInputProps = {
            className: 'react-tagsinput-input form-control',
            placeholder: 'Type a tag and press Enter'
        };

        this.handleInputChangeForm = this.handleInputChangeForm.bind(this);
        this.handleBlurForm = this.handleBlurForm.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.validateForm = this.validateForm.bind(this);

        console.log("PostForm.constructor");

    }

    componentDidMount(){
        console.log("PostForm.componentDidMount");

        
        if(this.props.post!=null){
            let form = this.state.form;
            form.fields.title.value = this.props.post.title;
            
            form.fields.description.value = this.props.post.description;

            form.fields.category.value = this.props.post.category;
            
            form.fields.links = this.props.post.links.map(link=>{return {value:link}});
            
            form.fields.tags.value = this.props.post.tags;
            
            form.fields.images.value = this.props.post.postImages.map(
                image=>{
                    return {
                        id: image.id,
                        src: image.url
                    }
                });

            form.mainImage = this.props.post.postImages.findIndex(image=>image.isMain);
            // form.mainImage = this.props.post.tags;
            console.log(form);
            this.setState({form:form});
        }
    }

    handleInputChangeTags(tags){
        if((new Set(tags)).size !== tags.length){
            alertifyService.error("Tags cannot be duplicated!");
            return;
        }

        let form = this.state.form;
        form.fields.tags.value = tags;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }

    handleFormArrayFieldChange(event, index){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let form = this.state.form;
        form.fields[name][index].value = value;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }

    handleFormArrayFieldBlur(event, index){
        const target = event.target;
        const name = target.name;

        let form = this.state.form;
        form.fields[name][index].touched = true;
        form.touched = true;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }

    onClickAddLinkButton(){
        let form = this.state.form;
        form.fields.links.push({value:""});
        this.setState({
            form: form
        });
    }

    onClickRemoveLinkButton(index, event){
        event.preventDefault();

        let form = this.state.form;
        form.fields.links.splice(index,1);
        this.setState({
            form: form
        });
    }

    showFormFieldError(name){
        return this.state.form.fields[name].error && this.state.form.fields[name].touched
    }

    showFormArrayFieldError(name, index){
        return this.state.form.fields[name][index].error && this.state.form.fields[name][index].touched
    }

    onInputAcceptedImage = (acceptedFiles => {
        console.log("CreatePostComponent.onDropAccepted", acceptedFiles);
        // let form = this.state.form;
        // form.fields.imagesToUpload.value = acceptedFiles;
        // this.setState({
        //     form: form
        // });

        acceptedFiles.forEach(acceptedFile => {
            let form = this.state.form;
            let index = form.fields.images.value.length;
            // acceptedFile.isMain = index==0;
            form.fields.images.value.push(acceptedFile);
            this.setState({
                form: form
            });

            let reader = new FileReader();
            reader.onload = (e) => {
                let form = this.state.form;
                form.fields.images.value[index].src=e.target.result;
                form.fields.images.touched = true;
                form = this.validateForm(form);
                this.setState({
                    form: form
                });
                
            };

            reader.readAsDataURL(acceptedFile);
        });
    });
  
    onInputRejectedImage = (rejectedFiles => {
        console.log("CreatePostComponent.onDropRejected", rejectedFiles);
        rejectedFiles.forEach(rejectedFile => {
            alertifyService.error(`"${rejectedFile.name}" is not a valid image file!`)
        });

        let form = this.state.form;
        form.fields.images.touched = true;
        form.touched = true;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    });

    onImageFileDialogCancel(args){
        let form = this.state.form;
        form.fields.images.touched = true;
        form.touched = true;

        form = this.validateForm(form);

        this.setState({
            form: form
        });

    }
    // handleUploadFile = (index=>{
    //     console.log("CreatePostComponent.handleUploadFile", index);
        
    //     this.setState({
    //         form: {...this.state.form, isUploadingImage:true}
    //     });

    //     const file = this.state.files[index];
    //     this.props.uploadPostImage(file,
    //       (res)=>{
    //         console.log(res);
    //         // const photo = {
    //         //   id: res.id,
    //         //   url: res.url,
    //         //   description: res.description,
    //         //   dateAdded: res.dateAdded,
    //         //   isMain: res.isMain
    //         // };
  
    //         // console.log(photo);
    //         // this.props.handleUploadedPhoto(photo);
  
    //         // if(photo.isMain){
    //         //   this.props.handleSetMainPhoto(photo.id);
    //         //   this.props.setUserMainPhotoUrl(photo.url);
    //         // }
  
    //         // this.handleRemoveFile(index);
    //         alertifyService.success(`Uploaded file ${file.path} successfully!`);
    //         this.setState({
    //             form: {...this.state.form, isUploadingImage:false}
    //         });
    //       },
    //       (error)=>{
    //         alertifyService.error(error.message);
    //         this.setState({
    //             form: {...this.state.form, isUploadingImage:false}
    //         });
    //       });
    // });
  
    handleRemoveImage = (index=>{
        console.log("CreatePostComponent.handleRemoveFile", index);
        let form = this.state.form;
        form.fields.images.value.splice(index,1);
        if(form.mainImage>index){
            form.mainImage--;
        }
        else if(form.mainImage==index){
            form.mainImage = 0;
        }

        form = this.validateForm(form);
        this.setState({
            form: form
        });
    });
  
    tagsInputRenderLayout (tagComponents, inputComponent) {
        return (
          <span>
            {inputComponent}
            {tagComponents}
           
          </span>
        )
    }

    autocompleteRenderInput ({addTag, ...props}) {

        const handleOnChange = (e, {newValue, method}) => {
          if (method === 'enter') {
            e.preventDefault()
          } else {
            props.onChange(e)
          }
        }
  
        const inputValue = (props.value && props.value.trim().toLowerCase()) || '';
        const inputLength = inputValue.length;

        let suggestions = states().filter((state) => {
          return state.name.toLowerCase().slice(0, inputLength) === inputValue
        })

        return (
            
            <Autosuggest
                ref={props.ref}
                suggestions={suggestions}
                shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                getSuggestionValue={(suggestion) => suggestion.name}
                renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
                inputProps={{...props, onChange: handleOnChange}}
                onSuggestionSelected={(e, {suggestion}) => {
                addTag(suggestion.name)
                }}
                onSuggestionsClearRequested={() => {}}
                onSuggestionsFetchRequested={() => {}}
            />
            
        )
    }

    setMainImage = (index)=>{
        this.setState({
            form: {...this.state.form, mainImage:index}
        });
    }

    handleInputChangeForm(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let form = this.state.form;
        form.fields[name].value = value;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }
    
    handleBlurForm = (event) => {
        console.log("CreatePostComponent.handleBlurForm");

        const target = event.target;
        const name = target.name;

        let form = this.state.form;
        form.fields[name].touched = true;
        form.touched = true;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }

    validateForm(form){

        for (let key in form.fields) {
            if(!Array.isArray(form.fields[key])){
                form.fields[key].error = null;
            }
            else{
                form.fields[key].forEach(element => {
                    element.error = null;
                });
            }

        }
        
        form.valid = true;

        if (!required(form.fields.title.value)){
            form.valid = false;      
            form.fields.title.error = 'Title is required.';
        }
        else if(!minLength(minTitleLength)(form.fields.title.value) || !maxLength(maxTitleLength)(form.fields.title.value)){
            form.valid = false;      
            form.fields.title.error = `Title should be between ${minTitleLength} to ${maxTitleLength} characters.`;
        }
    
        if (!required(form.fields.description.value)){
            form.valid = false;
            form.fields.description.error = 'Description is required.';      
        }
        else if(!minLength(minDescriptionLength)(form.fields.description.value) || !maxLength(maxDescriptionLength)(form.fields.description.value)){
            form.valid = false;      
            form.fields.description.error = `Description should be between ${minDescriptionLength} to ${maxDescriptionLength} characters.`;
        }

        if (!required(form.fields.category.value)){
            form.valid = false;
            form.fields.category.error = 'Please choose the resource category.';
        }
        
        if (!required(form.fields.tags.value)){
            form.valid = false;
            form.fields.tags.error = 'Please add at least one tag.';
        }
        else if(form.fields.tags.value.length>maxTagNumber){
            form.valid = false;
            form.fields.tags.error = `At most ${maxTagNumber} tags can be added.`;
        }

        for(let i=0; i<form.fields.links.length; i++){
            if (!required(form.fields.links[i].value)){
                form.valid = false;
                form.fields.links[i].error = 'Empty link is not allowed.';
            }
        }

        if (!required(form.fields.images.value)){
            form.valid = false;
            form.fields.images.error = 'Please upload at least one image.';
        }
        else if(form.fields.images.value.length>maxImageNumber){
            form.valid = false;
            form.fields.images.error = `At most ${maxImageNumber} images can be added.`;
        }
       
        return form;
    }

    handleSubmitForm(event) {
        event.preventDefault();
        
        let form = this.state.form;

        if(form.touched){
            if(!form.valid){
               
                for (let key in form.fields) {
                    
                    if(!Array.isArray(form.fields[key])){
                        form.fields[key].touched = true;
                    }
                    else{
                        form.fields[key].forEach(element => {
                            element.touched = true;
                        });
                    }
                }
                form.touched = true;

                form = this.validateForm(form);

                this.setState({
                    form
                });
    
                alertifyService.error('Please correct the errors on this form.');
                return;
            }
        }
        else{
            
            for (let key in form.fields) {
                    
                if(!Array.isArray(form.fields[key])){
                    form.fields[key].touched = true;
                }
                else{
                    form.fields[key].forEach(element => {
                        element.touched = true;
                    });
                }
            }
            form.touched = true;

            form = this.validateForm(form);

            this.setState({
                form
            });

            if(!form.valid){
                alertifyService.error('Please correct the errors on this form.');
                return;
            }
        }

        let encodedLinkValues = this.state.form.fields.links.map(link=>{
            return encodeURIComponent(link.value);
        });

        console.log(encodedLinkValues);

        this.props.onSubmitPost(
            this.state.form.fields.title.value,
            this.state.form.fields.description.value,
            this.state.form.fields.category.value,
            this.state.form.fields.tags.value.join(','),
            encodedLinkValues.join(','),
            this.state.form.fields.images.value,
            this.state.form.mainImage
        );
        // this.props.createPost(
        //     this.state.form.fields.title.value,
        //     this.state.form.fields.description.value,
        //     this.state.form.fields.category.value,
        //     this.state.form.fields.tags.value.join('|'),
        //     encodedLinkValues.join(','),
        //     this.state.form.fields.images.value,
        //     this.state.form.mainImage,
        //     (user)=>{
        //         alertifyService.success("Created post successfully!");
        //     },
        //     (error)=>{
        //         alertifyService.error(error.message);
        //     }
        // )
        
    }

    render() {
        return(
       
                        <form id="post-form" noValidate onSubmit={this.handleSubmitForm}>
                            <div className="form-group row text-left">
                                <label className="col-sm-2 col-form-label font-weight-bold ">Title</label>
                                <div className="col-sm">
                                    <input name="title" type="text" className={"form-control "+(this.showFormFieldError('title')?'is-invalid':'')} placeholder="Name of the Study Resource"
                                        value={this.state.form.fields.title.value}
                                        onChange={this.handleInputChangeForm}
                                        onBlur={this.handleBlurForm}
                                        minLength={minTitleLength} maxLength={maxTitleLength}
                                    />
                                    <div className="invalid-feedback">{this.showFormFieldError('title')?this.state.form.fields.title.error:''}</div>
                                </div>
                            </div>
                            <div className="form-group row text-left ">
                                <label className="col-sm-2 col-form-label font-weight-bold">Description</label>
                                <div className="col-sm">
                                    <textarea name="description" type="text" className={"form-control "+(this.showFormFieldError('description')?'is-invalid':'')} placeholder="Description of the Study Resource"
                                        value={this.state.form.fields.description.value}
                                        onChange={this.handleInputChangeForm}
                                        onBlur={this.handleBlurForm}
                                        minLength={minDescriptionLength} maxLength={maxDescriptionLength}
                                    />
                                    <div className="invalid-feedback">{this.showFormFieldError('description')?this.state.form.fields.description.error:''}</div>
                                </div>
                            </div>
                            <div className="form-group row text-left ">
                                <label className="col-sm-2 col-form-label font-weight-bold">Category</label>
                                <div className="col-sm col-lg-4 col-md-6">
                                    {/* <textarea type="text" className="form-control" placeholder="Description of the Study Resource"/> */}
                                    <select name="category" className={"form-control "+(this.showFormFieldError('category')?'is-invalid':'')} 
                                        value={this.state.form.fields.category.value}
                                        onChange={this.handleInputChangeForm}
                                        onBlur={this.handleBlurForm}
                                    >
                                    <option disabled value='' style={{display:"none"}}></option>
                                    {
                                        
                                        postCategoryOptions.map(category=>{
                                            return (
                                                <option key={category.value} value={category.value}>
                                                    { category.display }
                                                </option>
                                            );
                                        })
                                    }
                                    </select>
                                    <div className="invalid-feedback">{this.showFormFieldError('category')?this.state.form.fields.category.error:''}</div>
                                </div>
                            </div>
                            <div className="form-group row text-left ">
                                <label className="col-sm-2 col-form-label font-weight-bold">Tags</label>
                                <div className="col-sm">
                                    <TagsInput className={"text-left"} 
                                    inputProps={{
                                        className: 'react-tagsinput-input form-control '+(this.showFormFieldError('tags')?'is-invalid':''),
                                        name: "tags",
                                        onBlur: this.handleBlurForm,
                                        placeholder: this.state.form.fields.tags.value.length<maxTagNumber?'Type a tag and press Enter':`At most ${maxTagNumber} tags can be added.`,
                                        disabled:this.state.form.fields.tags.value.length>=maxTagNumber
                                    }} 
                                    
                                    renderInput={this.autocompleteRenderInput} 
                                    renderLayout={this.tagsInputRenderLayout} 
                                    value={this.state.form.fields.tags.value} 
                                    onChange={this.handleInputChangeTags} />
                                    <div className="invalid-feedback" style={{display:"block"}}>{this.showFormFieldError('tags')?this.state.form.fields.tags.error:''}</div>
                                </div>
                            </div>
                            <div className="form-group row text-left ">
                                <label className="col-sm-2 col-form-label font-weight-bold">Links</label>
                                <div className="col-sm-10">
                                    {
                                        this.state.form.fields.links.map((link, index)=>{
                                            return (
                                                <div key={index} className="input-group mb-2">
                                                    <input name='links' type="text" className={"form-control "+(this.showFormArrayFieldError('links',index)?'is-invalid':'')} placeholder="http://example.com" 
                                                        value={link.value} 
                                                        onChange={(event)=>this.handleFormArrayFieldChange(event, index)}
                                                        onBlur={(event)=>this.handleFormArrayFieldBlur(event, index)}
                                                    />
                                                    {
                                                        this.state.form.fields.links.length>1?
                                                        <div className="input-group-append">
                                                            <button className="btn btn-danger" onClick={(event)=>{this.onClickRemoveLinkButton(index,event)}}>
                                                            <span className="fas fa-minus mr-2"></span>
                                                            Remove
                                                            </button>
                                                        </div>
                                                        :null
                                                    }
                                                    <div className="invalid-feedback" >{this.showFormArrayFieldError('links',index)?this.state.form.fields.links[index].error:''}</div>
                                                </div>
                                            );
                                        })
                                    }
                                    
                                </div>
                                <div className="col-sm text-right">
                                    <button className="btn btn-primary" type="button" onClick={this.onClickAddLinkButton}>
                                        <span className="fas fa-plus mr-1"></span>
                                        Add a new link
                                    </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label text-left font-weight-bold">Images</label>
                                <div className="col-sm text-left">
                                    <div className="mx-0 px-0 col-sm-12 col-md-6 col-lg-4 mb-2">
                                        <Dropzone onFileDialogCancel={this.onImageFileDialogCancel} onDropAccepted={this.onInputAcceptedImage} onDropRejected={this.onInputRejectedImage} accept="image/*" noDrag>
                                            {({getRootProps, getInputProps}) => (
                                            <label htmlFor="input-image" {...getRootProps({tabIndex:null, className: styles.labelInputImage+" "+(this.showFormFieldError('images')?styles.isInvalid:"")})}>                            
                                                <input id="input-image" {...getInputProps({
                                                    // name:"images",
                                                    // onBlur:this.handleBlurForm
                                                })} />
                                                <span className="fas fa-upload mr-1"></span> Upload Images
                                            </label>                                                   
                                            )}
                                        </Dropzone>
                                        <div className="invalid-feedback" style={{display:"block"}}>{this.showFormFieldError('images')?this.state.form.fields.images.error:''}</div>
                                    </div>
                                    <div className="row mx-0 px-0 mb-2">
                                    {
                                        this.state.form.fields.images.value.map((image,index)=>{
                                            return(                          
                                                image.src!=null?
                                                <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4 text-center">
                                                    <img src={image.src} className={styles.imgThumbnail} alt="" />
                                                    <div className="text-center mt-1">
                                                        <button type="button" className={"mr-1 btn btn-sm "+(index==this.state.form.mainImage?"btn-success active":"btn-secondary")} 
                                                            onClick={(e)=>{this.setMainImage(index)}}
                                                            disabled={index==this.state.form.mainImage}
                                                        >Cover</button>
                                                        <button type="button" className="btn btn-sm btn-danger"
                                                            onClick={(e)=>{this.handleRemoveImage(index)}}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div> 
                                                </div>
                                                :null
                                            );
                                        })
                                    }
                                    </div>
                                    
                                </div>
                                
                            </div>

                            {/* <div className="form-group text-left row ">
                                <div className="offset-md-2 col">
                                    <button className="btn btn-success btn-lg" type="submit" >
                                        Submit
                                    </button>
                                </div>
                            </div> */}
                        </form>
   
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);