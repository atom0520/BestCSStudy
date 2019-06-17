import React, { Component, useCallback } from 'react'
import { fetchPost, updatePost } from '../redux/ActionCreators';
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
import PostForm from "./PostFormComponent";
import { withRouter, Redirect } from 'react-router-dom';

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
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPost: (id, onSuccess, onError) => { dispatch(fetchPost(id, onSuccess, onError)); },
    updatePost: (id, title, description, category, tags, links, deletedImages, addedImages, mainImage, onSuccess, onError) => 
    { dispatch(updatePost(id, title, description, category, tags, links, deletedImages, addedImages, mainImage, onSuccess, onError)) }
});

const minTitleLength = 4;
const maxTitleLength = 100;
const minDescriptionLength = 20;
const maxDescriptionLength = 800;
const maxTagNumber = 5;

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: null
        }

        this.onSubmitPost = this.onSubmitPost.bind(this);
        this.onClickCancelButton = this.onClickCancelButton.bind(this);

        // console.log(this.props.match.params.id);
        // console.log(this.props.authUser.posts);
        // console.log(this.props.authUser.posts.includes(Number(this.props.match.params.id)));
    }

    componentDidMount(){
        if(!this.props.authUser.posts.includes(Number(this.props.match.params.id))){
            return;
        }
        
        setTimeout(this.props.fetchPost(
            this.props.match.params.id,
            (post)=>{                    
                alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');     

                // post.tags = post.tags.split('|');
                let links = post.links.split(',');
                for(let i=0;i<links.length; i++){
                    links[i] = decodeURIComponent(links[i]);
                }
                post.links = links;
                console.log(post);
                this.setState({
                    post: post
                });
            },
            (error)=>{

                alertifyService.error(error.message);
            }
        ),1);
    }

    onClickCancelButton(event){
        this.props.history.goBack();
    }

    onSubmitPost(
        title,
        description,
        category,
        tags,
        encodedLinks,
        images,
        mainImage
    ){
        console.log("EditPostComponent",title,description,category,tags,encodedLinks,images,mainImage);
        
        let deletedImages = [];
        let addedImages = [];

        this.state.post.postImages.forEach(postImage=>{
            let index = images.findIndex(image=>image.id==postImage.id);
            if(index==-1){
                deletedImages.push(postImage.id);
            }
        });

        images.forEach(image => {
            if(image.path!=null){
                addedImages.push(image);
            }
        });

        let addedImageStartIndex = images.length - addedImages.length;

        if(mainImage>=addedImageStartIndex)
        {
            mainImage = mainImage - addedImageStartIndex;
        }
        else{
            mainImage = -images[mainImage].id;
        }

        console.log("updatePost",deletedImages,addedImages,mainImage);

        this.props.updatePost(
            this.props.match.params.id,
            title,
            description,
            category,
            tags,
            encodedLinks,
            deletedImages.join(","),
            addedImages,
            mainImage,
            (user)=>{
                alertifyService.success("Updated post successfully!");
                this.props.history.push(`/posts/${this.props.match.params.id}`);
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        )
    }

    render() {
        if(!this.props.authUser.posts.includes(Number(this.props.match.params.id))){
            return <Redirect to={{ pathname: '/home' }} />;
        }

        return(
            <div className="container mt-4">
                
                <h1 className="mb-4 text-left">
                    Edit Post {this.props.match.params.id}
                </h1>
                <div className="card">
              
                    <div className="card-body">
                    {
                        this.state.post!=null?
                        <React.Fragment>
                            <PostForm
                                post={this.state.post}
                                onSubmitPost={this.onSubmitPost}
                            />
                            <div className="text-left row ">
                                <div className="offset-md-2 col">
                                    <button className="btn btn-info btn-lg mr-3 " type="submit" form="post-form">
                                        Update
                                    </button>
                                    <button className="btn btn-secondary btn-lg" onClick={this.onClickCancelButton}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            
                        </React.Fragment>
                        :null
                    }
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPost));