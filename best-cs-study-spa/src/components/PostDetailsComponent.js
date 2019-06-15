import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchPost, likePost, cancelLikedPost, dislikePost, cancelDislikedPost } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
// import styles from './MemberDetailsComponent.module.scss';
// import { Tabs, Tab } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
// import ImgUser from '../../shared/img/user.png';
import TimeAgo from 'react-timeago'
// import MemberMessages from './member/MemberMessagesComponent';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
// import './MemberDetailsComponent.scss';
import './PostDetailsComponent.css';
import ImgUser from '../shared/img/user.png';
import styles from './PostDetailsComponent.module.scss';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPost: (id, onSuccess, onError) => { dispatch(fetchPost(id, onSuccess, onError)); },
    likePost: (userId, postId, onSuccess, onError) => { dispatch(likePost(userId, postId, onSuccess, onError)); },
    cancelLikedPost: (userId, postId, onSuccess, onError) => { dispatch(cancelLikedPost(userId, postId, onSuccess, onError)); },
    dislikePost: (userId, postId, onSuccess, onError) => { dispatch(dislikePost(userId, postId, onSuccess, onError)); },
    cancelDislikedPost: (userId, postId, onSuccess, onError) => { dispatch(cancelDislikedPost(userId, postId, onSuccess, onError)); }
});

class PostDetails extends Component {
    constructor(props) {
        super(props);

        // let initTab = queryString.parse(this.props.location.search).tab;
      
        this.state = {
            post:null
        }

        this.onClickLikeButton = this.onClickLikeButton.bind(this);
        this.onClickDislikeButton = this.onClickDislikeButton.bind(this);
    }

    componentDidMount(){
        setTimeout(this.props.fetchPost(
            this.props.match.params.id,
            (post)=>{                    
                alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');     
                console.log(post);

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

    fetchPost(){
        this.props.fetchPost(
            this.props.match.params.id,
            (post)=>{                    
                alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');     
                console.log(post);

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
        );
    }

    onClickLikeButton(event){
        console.log("PostDetailsComponent.onClickLikeButton");

        if(!this.isPostLiked()){
            this.props.likePost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                
                    alertifyService.success('Liked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }else{
            this.props.cancelLikedPost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                
                    alertifyService.success('Cancel liked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }

    isPostLiked(){
        console.log(this.state.post);
        return this.state.post!=null&&this.state.post.likers.findIndex(p=>p.likerId == this.props.authUser.id)!=-1;
    }

    isPostDisliked(){
        console.log(this.state.post);
        return this.state.post!=null&&this.state.post.dislikers.findIndex(p=>p.dislikerId == this.props.authUser.id)!=-1;
    }

    onClickDislikeButton(event){
        console.log("PostDetailsComponent.onClickDislikeButton");

        if(!this.isPostDisliked()){
            this.props.dislikePost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                    alertifyService.success('Disliked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }else{
            this.props.cancelDislikedPost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                
                    alertifyService.success('Cancel disliked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }

    render() {
        // const postImages = [{
        //         original: "http://res.cloudinary.com/atom0520/image/upload/v1559884265/glewuxjd8rwve3ymc5eh.png",
        //         thumbnail: "http://res.cloudinary.com/atom0520/image/upload/v1559884265/glewuxjd8rwve3ymc5eh.png"
        //     },
        //     {
        //         original: "http://res.cloudinary.com/atom0520/image/upload/v1559884395/necu38bdkvdfgrs5gwaf.png",
        //         thumbnail: "http://res.cloudinary.com/atom0520/image/upload/v1559884395/necu38bdkvdfgrs5gwaf.png"
        //     },
        //     {
        //         original: "http://res.cloudinary.com/atom0520/image/upload/v1559884403/u7uvux74wx0ezfumxyqj.png",
        //         thumbnail: "http://res.cloudinary.com/atom0520/image/upload/v1559884403/u7uvux74wx0ezfumxyqj.png"
        //     }];
        const postImages = this.state.post? this.state.post.postImages.map((postImage)=>{
            return  {
                original: postImage.url,
                thumbnail: postImage.url
            };
        }):null;

        return(
            <div className="container mt-4 post-details-component">
                <h1 className="mb-4 text-left">
                    Post Details
                </h1>
                {/* <div className="row">
                    <h1>
                        {this.state.post? this.state.post.knownAs: ''}'s Profile
                    </h1>
                </div> */}
                <div className="row">
                    <div className="col-sm-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-left">
                                    <strong>Author:</strong>
                                    <p>
                                    {
                                        this.state.post?
                                        <Link to={"/members/"+this.state.post.author.id} className="navbar-brand">
                                            <span className="mr-2">
                                                <img className={styles.imgAuthor} src={this.state.post?(this.state.post.author.photoUrl || ImgUser):''} alt=""/>
                                            </span>
                                            {
                                                this.state.post?
                                                this.state.post.author.username
                                                :null
                                            }
                                        </Link>
                                        :null
                                    }
                                    </p>
                                </div>
                                <div className="text-left">
                                    <strong>Created At:</strong>
                                    <p>
                                    {
                                        this.state.post?
                                        (new Date(this.state.post.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
                                        :''
                                    }
                                    </p>
                                </div>
                                <div className="text-left">
                                    <strong>Last Updated At:</strong>
                                    <p>
                                    {
                                        this.state.post?
                                        (new Date(this.state.post.updated)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
                                        :''
                                    }
                                    </p>
                                </div>
                                <div className="text-left">
                                    <strong><i className="far fa-thumbs-up"></i> Likes:</strong>
                                    <p>
                                    {
                                        this.state.post?
                                        this.state.post.likers.length
                                        :''
                                    }
                                    </p>
                                </div>
                                <div className="text-left">
                                    <strong><i className="far fa-thumbs-down"></i> Dislikes:</strong>
                                    <p>
                                    {
                                        this.state.post?
                                        this.state.post.dislikers.length
                                        :''
                                    }
                                    </p>
                                </div>
                            </div>
                            <div className="card-footer ">
                                {/* <div className="btn-group d-flex"> */}
                                    <button className={"btn mx-1 "+
                                    (this.isPostLiked()?"btn-success":"btn-secondary")}
                                        onClick={this.onClickLikeButton}
                                    >
                                    <i className="far fa-thumbs-up"></i> Like
                                    </button>
                                    <button className={"btn mx-1 "+
                                    (this.isPostDisliked()?"btn-danger":"btn-secondary")}
                                        onClick={this.onClickDislikeButton}
                                    >
                                    <i className="far fa-thumbs-down"></i> Dislike</button>
                                {/* </div> */}
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-sm-9">
                        <div className="card">
                            <div className="card-body">
                                    
                                    <div className="row text-left">
                                        <label className="col-lg-2 col-md-3 font-weight-bold ">Title</label>
                                        <div className="col-sm">
                                            <p>{this.state.post?this.state.post.title:''}</p>
                                        </div>
                                    </div>
                                    <div className="row text-left ">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Description</label>
                                        <div className="col-sm">
                                            <p>
                                            {this.state.post?this.state.post.description:''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row text-left ">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Category</label>
                                        <div className="col-sm col-lg-4 col-md-6">
                                            <p>
                                            {this.state.post?this.state.post.category:''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row text-left ">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Tags</label>
                                        <div className="col-sm">
                                            {
                                                this.state.post?
                                                this.state.post.tags.map((tag, index)=>{
                                                    return(
                                                        <span key={index} className="mr-2">{tag}</span>
                                                    );
                                                })
                                                :null
                                            }
                                        </div>
                                    </div>
                                    <div className="row text-left ">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Links</label>
                                        <div className="col-sm-10">
                                            {
                                                this.state.post?
                                                this.state.post.links.map((link, index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <a href={link} target="_blank">{link}</a>
                                                        </div>
                                                    );
                                                })
                                                :null
                                            }
                                            {/* <div>
                                            <a href="http://test1.com">http://test1.com</a>
                                            </div>
                                            <div>
                                            <a href="http://test2.com">http://test2.com</a>
                                            </div>
                                            <div>
                                            <a href="http://test3.com">http://test3.com</a>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="row text-left mt-4">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Images</label>
                                        <div className="col-sm-8 col-md-6 col-lg-4">
                                        {
                                            postImages?
                                            <ImageGallery items={postImages} showPlayButton={false} showFullscreenButton={false} useBrowserFullscreen={false}/>
                                            :null
                                        }
                                            
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetails));