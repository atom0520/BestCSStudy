import React, { Component, useCallback } from 'react'
import {createPost, fetchPost } from '../redux/ActionCreators';
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
    fetchPost: (id, onSuccess, onError) => { dispatch(fetchPost(id, onSuccess, onError)); }
    // updatePost: (title, description, category, tags, links, images, onSuccess, onError) => { dispatch(editPost(title, description, category, tags, links, images, onSuccess, onError)) }
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
    }

    componentDidMount(){
        setTimeout(this.props.fetchPost(
            this.props.match.params.id,
            (post)=>{                    
                alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');     

                post.tags = post.tags.split('|');
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

        // this.props.createPost(
        //     title,
        //     description,
        //     category,
        //     tags,
        //     encodedLinks,
        //     images,
        //     mainImage,
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
                                    <button className="btn btn-info btn-lg" type="submit" form="post-form">
                                        Update
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