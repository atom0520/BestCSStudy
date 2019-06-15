import React, { Component, useCallback } from 'react'
import {createPost } from '../redux/ActionCreators';
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
import { withRouter } from 'react-router-dom';

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
    createPost: (title, description, category, tags, links, images, mainImage, onSuccess, onError) => { dispatch(createPost(title, description, category, tags, links, images, mainImage, onSuccess, onError)) }
});

const minTitleLength = 4;
const maxTitleLength = 100;
const minDescriptionLength = 20;
const maxDescriptionLength = 800;
const maxTagNumber = 5;

class CreatePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }

        this.onSubmitPost = this.onSubmitPost.bind(this);
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
        console.log(mainImage);
        this.props.createPost(
            title,
            description,
            category,
            tags,
            encodedLinks,
            images,
            mainImage,
            (post)=>{
                console.log(post);
                alertifyService.success("Created post successfully!");
                this.props.history.push(`/posts/${post.id}`);
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        )
    }

    render() {
        return(
            <div className="container mt-4">
                <h1 className="mb-4 text-left">
                    Create New Post
                </h1>
                <div className="card">
                    <div className="card-body">
                        <PostForm
                            onSubmitPost={this.onSubmitPost}
                        />
                        <div className="text-left row ">
                            <div className="offset-md-2 col">
                                <button className="btn btn-success btn-lg" type="submit" form="post-form">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePost));