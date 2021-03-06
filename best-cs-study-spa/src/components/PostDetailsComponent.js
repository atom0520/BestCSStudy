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
import Rating from 'react-rating';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
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
        this.onClickEditButton = this.onClickEditButton.bind(this);
    }

    componentDidMount(){
        setTimeout(this.props.fetchPost(
            this.props.match.params.id,
            (post)=>{                    
                // alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');     

                post.tags = post.tags;
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
                // alertifyService.success('Fetched post '+this.props.match.params.id+' successfully!');

                post.tags = post.tags;
                let links = post.links.split(',');
                for(let i=0;i<links.length; i++){
                    links[i] = decodeURIComponent(links[i]);
                }
                post.links = links;
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

        if(!this.isPostLiked()){
            this.props.likePost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                
                    // alertifyService.success('Liked post successfully!');
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
                
                    // alertifyService.success('Cancel liked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }

    isPostLiked(){
        return this.state.post!=null&&this.state.post.likers.findIndex(p=>p.likerId == this.props.authUser.id)!=-1;
    }

    isPostDisliked(){
        return this.state.post!=null&&this.state.post.dislikers.findIndex(p=>p.dislikerId == this.props.authUser.id)!=-1;
    }

    onClickDislikeButton(event){
        if(!this.isPostDisliked()){
            this.props.dislikePost(
                this.props.authUser.id,
                this.props.match.params.id,
                (res)=>{
                    // alertifyService.success('Disliked post successfully!');
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
                
                    // alertifyService.success('Cancel disliked post successfully!');
                    this.fetchPost();
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }

    onClickEditButton(event){
        this.props.history.push(`/posts/${this.props.match.params.id}/edit`);
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
            <div className="container mt-4 pt-3 mb-4 post-details-component">
                {/* <h1 className="mb-4 text-left">
                    Post Details
                </h1> */}
                {/* <div className="row">
                    <h1>
                        {this.state.post? this.state.post.knownAs: ''}'s Profile
                    </h1>
                </div> */}
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-left">
                                    <strong>Posted By:</strong>
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
                                {/* <div className="text-left">
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
                                </div> */}
                                <div className="text-left mb-2">
                                    <strong>Rating:</strong>
                                    <div className="mt-1">
                                    <Rating 
                                        emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                        fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                        initialRating={3.9}
                                        fractions={10}
                                        readonly
                                    />
                                    <span className="ml-2">3.9 (19,298 ratings)</span>
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.post?
                                <div className="card-footer ">
                                {
                                    this.props.isAuthenticated && this.state.post.author.id == this.props.authUser.id?
                                    <React.Fragment>
                                        <button className={"btn mx-1 btn-warning"}
                                            onClick={this.onClickEditButton}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button className={"btn mx-1 btn-danger"}
                                        >
                                        <i className="fas fa-trash-alt"></i> Delete</button>
                                    </React.Fragment>
                                  
                                    :<button className={"btn btn-block btn-warning"}>
                                    <i className="fas fa-edit mr-1"></i> Write a Review</button>  
                                }
                                    
                                    {/* <button className={"btn mx-1 "+
                                    (this.isPostLiked()?"btn-success":"btn-outline-secondary")}
                                        onClick={this.onClickLikeButton}
                                    >
                                    <i className="far fa-thumbs-up"></i> Like
                                    </button>
                                    <button className={"btn mx-1 "+
                                    (this.isPostDisliked()?"btn-danger":"btn-outline-secondary")}
                                        onClick={this.onClickDislikeButton}
                                    >
                                    <i className="far fa-thumbs-down"></i> Dislike</button>   */}
                                    
                                   
                                               
                                    
                                                  
                                </div>
                                :null
                            }
                        </div>
                        
                    </div>
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-body">

                                    <div className="row text-left">
                                       
                                        {/* <label className="col-lg-2 col-md-3 font-weight-bold ">Title</label> */}
                                        <div className="col-sm ">
                                            <h2 className="font-weight-bold">{this.state.post?this.state.post.title:''}</h2>
                                            {/* <p>{this.state.post?this.state.post.title:''}</p> */}
                                        </div>
                                    </div>
                                   
                                    <div className="row text-left mb-2">
                                        {/* <label className="col-lg-2 col-md-3 font-weight-bold">Category</label> */}
                                        <div className="col-sm col-lg-4 col-md-6">
                                            <strong className="mr-1">Category: </strong> {this.state.post?this.state.post.category.toUpperCase():''}
                                            {/* <p>
                                           
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className="row text-left " style={{marginBottom:"2.2rem"}}>
                                        {/* <label className="col-lg-2 col-md-3 font-weight-bold">Tags</label> */}
                                        <div className="col-sm">
                                            <strong className="mr-1">Tags: </strong>
                                            {
                                                this.state.post?
                                                this.state.post.tags.map(tag=>tag.toTitleCase()).join(", ")
                                                // this.state.post.tags.map((tag, index)=>{
                                                //     return(
                                                //         <span key={index} className="mr-2">{tag}</span>
                                                //     );
                                                // })
                                                :null
                                            }
                                        </div>
                                    </div>
                                     <div className="row text-left mb-4">
                                        <h4 className="col-12 font-weight-bold">Description</h4>
                                        <div className="col-sm">
                                            <p className={"bg-light px-3 py-3 "+styles.pDescription}>
                                            {this.state.post?this.state.post.description:''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row text-left mb-5">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Links</label>
                                        <div className="col-sm-10">
                                            {
                                                this.state.post?
                                                this.state.post.links.map((link, index)=>{
                                                    return(
                                                        <div className="mb-2" key={index}>
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
                                    <div className="row text-left mb-5">
                                        <label className="col-lg-2 col-md-3 font-weight-bold">Images</label>
                                        <div className="col-sm-8 col-md-6 col-lg-4">
                                        {
                                      
                                            postImages?
                                            <ImageGallery items={postImages} showPlayButton={false} showFullscreenButton={false} useBrowserFullscreen={false}/>
                                            :null
                                        }
                                            
                                        </div>
                                    </div>
                                    <div className="row text-left mb-5">
                                        <h4 className="col-lg-2 col-md-3 font-weight-bold">Ratings</h4>
                                        <div className="col-12">
                                            <div className="row py-3">
                                                <div className="ml-4 col-2 text-center my-auto">
                                                    <h1 style={{fontSize:"3rem"}}>4.8</h1>
                                                    <Rating 
                                                        emptySymbol={<span className="far fa-star fa-lg" style={{color:"#ffcc00"}}></span>}
                                                        fullSymbol={<span className="fas fa-star fa-lg" style={{color:"#ffcc00"}}></span>}
                                                        initialRating={4.6}
                                                        fractions={10}
                                                        readonly
                                                    />
                                                </div>
                                                <div className="col-9">
                                                    <div className="row mb-3">
                                                        <div className="col-9 mt-1 pr-0">
                                                            <div style={{width:"100%", backgroundColor:"lightGrey", height:"1rem"}}>
                                                                <div style={{width:"20%", backgroundColor:"grey", height:"1rem", zIndex:"1"}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col pl-3">
                                                            <Rating 
                                                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                initialRating={5}
                                                                fractions={10}
                                                                readonly
                                                            />
                                                            <span className="ml-2">75%</span>
                                                        </div>
                                                    </div> 
                                                    <div className="row mb-3">
                                                        <div className="col-9 mt-1 pr-0">
                                                            <div style={{width:"100%", backgroundColor:"lightGrey", height:"1rem"}}>
                                                                <div style={{width:"20%", backgroundColor:"grey", height:"1rem", zIndex:"1"}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col pl-3">
                                                            <Rating 
                                                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                initialRating={4}
                                                                fractions={10}
                                                                readonly
                                                            />
                                                            <span className="ml-2">75%</span>
                                                        </div>
                                                    </div> 
                                                    <div className="row mb-3">
                                                        <div className="col-9 mt-1 pr-0">
                                                            <div style={{width:"100%", backgroundColor:"lightGrey", height:"1rem"}}>
                                                                <div style={{width:"20%", backgroundColor:"grey", height:"1rem", zIndex:"1"}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col pl-3">
                                                            <Rating 
                                                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                initialRating={3}
                                                                fractions={10}
                                                                readonly
                                                            />
                                                            <span className="ml-2">75%</span>
                                                        </div>
                                                    </div> 
                                                    <div className="row mb-3">
                                                        <div className="col-9 mt-1 pr-0">
                                                            <div style={{width:"100%", backgroundColor:"lightGrey", height:"1rem"}}>
                                                                <div style={{width:"20%", backgroundColor:"grey", height:"1rem", zIndex:"1"}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col pl-3">
                                                            <Rating 
                                                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                initialRating={2}
                                                                fractions={10}
                                                                readonly
                                                            />
                                                            <span className="ml-2">75%</span>
                                                        </div>
                                                    </div> 
                                                    <div className="row">
                                                        <div className="col-9 mt-1 pr-0">
                                                            <div style={{width:"100%", backgroundColor:"lightGrey", height:"1rem"}}>
                                                                <div style={{width:"20%", backgroundColor:"grey", height:"1rem", zIndex:"1"}}>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col pl-3">
                                                            <Rating 
                                                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                                initialRating={1}
                                                                fractions={10}
                                                                readonly
                                                            />
                                                            <span className="ml-2">75%</span>
                                                        </div>
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="row text-left mb-3">
                                        <h4 className="col-lg-2 col-md-3 font-weight-bold">Reviews</h4>
                                        <div className="col-12 px-4 py-3">
                                            <div className="row border-bottom border-top py-4">
                                                <div className="col-3">
                                                    <span className="mr-2">
                                                        <img className={styles.imgAuthor} src={this.state.post?(this.state.post.author.photoUrl || ImgUser):''} alt=""/>
                                                    </span>
                                                    {
                                                        this.state.post?
                                                        this.state.post.author.username
                                                        :null
                                                    }
                                                    <p>Posted 15 days ago</p>
                                                </div>
                                             
                                                <div className="col">
                                                    <Rating 
                                                        emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                        fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                                        initialRating={1}
                                                        fractions={10}
                                                        readonly
                                                    />
                                                    <p className="mt-2 mb-3">
                                                    Being C# developer , I started learning IOS development too . From this course I have learn a lot of thing about IOS development.Thank you so much . It was such great experience of learning.
                                                    </p>
                                                    {
                                                        this.props.isAuthenticated?
                                                        <React.Fragment>
                                                            <button className={"btn mr-1 "+
                                                                (this.isPostLiked()?"btn-success":"btn-outline-secondary")}
                                                                    onClick={this.onClickLikeButton}
                                                                >
                                                                <i className="far fa-thumbs-up"></i> Like
                                                            </button>
                                                            <button className={"btn ml-1 "+
                                                            (this.isPostDisliked()?"btn-danger":"btn-outline-secondary")}
                                                                onClick={this.onClickDislikeButton}
                                                            >
                                                            <i className="far fa-thumbs-down"></i> Dislike</button>   
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            <button className={"btn mr-1 btn-outline-secondary"}
                                                                    onClick={this.onClickLikeButton}
                                                                >
                                                                <i className="far fa-thumbs-up"></i> Like 
                                                                <span className="ml-1">(12)</span>
                                                            </button>
                                                            <button className={"btn ml-1 btn-outline-secondary"}
                                                                onClick={this.onClickDislikeButton}
                                                            >
                                                                <i className="far fa-thumbs-down"></i> Dislike 
                                                                <span className="ml-1">(2)</span>
                                                            </button>   
                                                        </React.Fragment>
                                                    }
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    {/* {
                                        this.props.isAuthenticated && this.state.post!=null && this.state.post.author.id==this.props.authUser.id?
                                        <div className="text-right mt-4 mt-sm-0">
                                            <button className={"btn btn-block-xs-only btn-warning"}
                                                onClick={this.onClickEditButton}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                        </div>
                                        :null
                                    } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetails));