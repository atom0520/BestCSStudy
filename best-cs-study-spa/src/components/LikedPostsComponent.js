import React, { Component } from 'react'
import { Pagination } from 'react-bootstrap';
import { fetchLikedPosts, likePost, cancelLikedPost, dislikePost, cancelDislikedPost } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';
import { postCategoryOptions } from "../shared/global";
import styles from './PostsComponent.module.scss';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchLikedPosts: (userId, pageNumber, pageSize, postParams, onSuccess, onError) => { 
        dispatch(fetchLikedPosts(userId, pageNumber, pageSize, postParams, onSuccess, onError)); },
    likePost: (userId, postId, onSuccess, onError) => { dispatch(likePost(userId, postId, onSuccess, onError)); },
    cancelLikedPost: (userId, postId, onSuccess, onError) => { dispatch(cancelLikedPost(userId, postId, onSuccess, onError)); },
    dislikePost: (userId, postId, onSuccess, onError) => { dispatch(dislikePost(userId, postId, onSuccess, onError)); },
    cancelDislikedPost: (userId, postId, onSuccess, onError) => { dispatch(cancelDislikedPost(userId, postId, onSuccess, onError)); }
});

const orderByOptions = [
    {value:'likedTime', display:'Liked Time'},
    {value:'updated', display:'Updated Time'}
]

class LikedPosts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            postParams:{
                category: "",
                orderBy: "likedTime"
            },
            pagination: {
                currentPage: 1,
                itemsPerPage: 5,
                totalItems: 0,
                totalPages: 0
            }
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleLikePost = this.handleLikePost.bind(this);
        this.onClickPost = this.onClickPost.bind(this);

        this.handleInputChangePostParamsForm = this.handleInputChangePostParamsForm.bind(this);
        this.handleSubmitPostParamsForm = this.handleSubmitPostParamsForm.bind(this);

        this.onClickEditPostButton = this.onClickEditPostButton.bind(this);
    }

    componentDidMount() {
        setTimeout(()=>{
            this.loadPosts(this.state.pagination.currentPage);
         }, 1);
    }

    handleChangePage(pageIndex){
        this.loadPosts(pageIndex);
    }

    isPostLiked(postIndex){
        return this.state.posts[postIndex].likers.includes(this.props.authUser.id);
    }

    handleLikePost(postIndex){
        console.log("PostsComponent.handleLikePost",postIndex);
        
        if(!this.isPostLiked(postIndex)){
            this.props.likePost(
                this.props.authUser.id,
                this.state.posts[postIndex].id,
                (res)=>{
                    alertifyService.success('Liked post successfully!');
                    let posts = this.state.posts;
                    posts[postIndex].likers.push(this.props.authUser.id);

                    let authUserDislikerIndex = this.state.posts[postIndex].dislikers.indexOf(this.props.authUser.id);
                    if(authUserDislikerIndex!=-1){
                        posts[postIndex].dislikers.splice(authUserDislikerIndex,1);
                    }

                    this.setState({
                        posts: posts
                    });
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }else{
            this.props.cancelLikedPost(
                this.props.authUser.id,
                this.state.posts[postIndex].id,
                (res)=>{
                    alertifyService.success('Cancel liked post successfully!');
                    let posts = this.state.posts;
                    
                    let authUserLikerIndex = this.state.posts[postIndex].likers.indexOf(this.props.authUser.id);
                    if(authUserLikerIndex!=-1){
                        posts[postIndex].likers.splice(authUserLikerIndex,1);
                    }
                    this.setState({
                        posts: posts
                    });
                    
                    
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }

    isPostDisliked(postIndex){
        return this.state.posts[postIndex].dislikers.includes(this.props.authUser.id);
    }

    handleDislikePost(postIndex){
        console.log("PostsComponent.handleDislikePost",postIndex);

        if(!this.isPostDisliked(postIndex)){
            this.props.dislikePost(
                this.props.authUser.id,
                this.state.posts[postIndex].id,
                (res)=>{
                    alertifyService.success('Disliked post successfully!');

                    let posts = this.state.posts;
                    posts[postIndex].dislikers.push(this.props.authUser.id);
                    
                    let authUserLikerIndex = this.state.posts[postIndex].likers.indexOf(this.props.authUser.id);
                    if(authUserLikerIndex!=-1){
                        posts[postIndex].likers.splice(authUserLikerIndex,1);
                    }

                    this.setState({
                        posts: posts
                    });
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }else{
            this.props.cancelDislikedPost(
                this.props.authUser.id,
                this.state.posts[postIndex].id,
                (res)=>{
                
                    alertifyService.success('Cancel disliked post successfully!');
                    let posts = this.state.posts;
                    let authUserDislikerIndex = this.state.posts[postIndex].dislikers.indexOf(this.props.authUser.id);
                    if(authUserDislikerIndex!=-1){
                        posts[postIndex].dislikers.splice(authUserDislikerIndex,1);
                    }
                    this.setState({
                        posts: posts
                    });
                },
                (error)=>{
                    alertifyService.error(error.message);
                },
            );
        }
    }
    
    onClickPost(postId){
        this.props.history.push(`/posts/${postId}`);
    }

    onClickEditPostButton(postId){
        this.props.history.push(`/posts/${postId}/edit`);
    }

    loadPosts(pageIndex){
        console.log('LikedPostsComponent.loadPosts',this.state.postParams);
        this.props.fetchLikedPosts(
            this.props.authUser.id,
            pageIndex,
            this.state.pagination.itemsPerPage,
            this.state.postParams,
            (posts, pagination)=>{
                alertifyService.success('Fetched posts successfully!');
                console.log(posts);

                this.setState({
                    posts: posts,
                    pagination: pagination
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            },
        );
    }

    handleInputChangePostParamsForm(event){

        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name,value);

        this.setState({
            postParams: {...this.state.postParams, 
                [name]: value
            }
        });

        if(name=="category" || name=="orderBy"){
            setTimeout(()=>{
            this.loadPosts(1);
         }, 1);
        }
    }

    handleSubmitPostParamsForm(event){
        event.preventDefault();
        this.loadPosts(1);
    }

    render() {
        let paginationItems = [];
        if(this.state.pagination){
            for (let pageIndex = 1; pageIndex <= this.state.pagination.totalPages; pageIndex++) {
                paginationItems.push(
                    <Pagination.Item key={pageIndex} 
                        active={pageIndex === this.state.pagination.currentPage}
                        onClick={(e)=>{this.handleChangePage(pageIndex)}}
                    >
                        {pageIndex}
                    </Pagination.Item>,
                );
            }
        }

        return(
            <div>
                <div className="container mt-4">
                    <div className="text-left mb-4">
                        <h2><i className="far fa-thumbs-up"></i> Posts I Liked</h2>
                    </div>
                    <form className="row" noValidate>   
                       
                        <div className="form-inline ml-3 mb-2">
                                <label className="mr-2">Category</label>
                                <select className="form-control" style={{width: "108px"}} name="category"
                                    value={this.state.postParams.category}
                                    onChange={this.handleInputChangePostParamsForm}
                                >
                                    <option key={"all"} value={""}>
                                        { "All" }
                                    </option>
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
                            </div>
                  
                     
                  
                        
                        {/* <div className="col-sm-12 col-lg mb-2" >
                    
                            <div className="input-group ">
                                <input className="form-control"  type="text" placeholder="Web Development"
                                    value={this.state.postParams.search}
                                    onChange={this.handleInputChangePostParamsForm}
                                    name="search"
                                />
                        
                                <div className="input-group-append">
                                
                                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmitPostParamsForm}>Search</button>
                                </div>
                            </div>

                        </div> */}
                    
                        <div className="form-inline ml-auto mb-2">
                            <label className="mr-2">Order By</label>
                            <select className="form-control" style={{width: "166px"}} name="orderBy"
                                value={this.state.postParams.orderBy}
                                onChange={this.handleInputChangePostParamsForm}
                            >
                                {
                                    orderByOptions.map(orderBy=>{
                                        return (
                                            <option key={orderBy.value} value={orderBy.value}>
                                                { orderBy.display }
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        {/* <button type="submit" className="btn btn-primary" >Search</button> */}
                        {/* <button type="button" className="btn btn-info" style={{marginLeft:"10px"}}
                        >Reset Filter</button> */}
                    
                    </form>
                    <br/>
                    <div className="row mb-4">                    
                        {
                            this.state.posts && this.state.posts.length>0?
                            this.state.posts.map((post, index)=>{
                                return(
                                    <div key={post.id} className={"col-12 p-4 border-bottom "+(index==0?"border-top ":"")+styles.divPost} onClick={()=>this.onClickPost(post.id)}>

                                        <div className={"row text-left"} >
                                            
                                            {/* <div className="col-12 my-auto px-5 px-sm-2 col-sm-2"> */}
                                            <div className="my-auto text-center col-12 px-5 col-sm-2 px-sm-3">
                                                <img className={" "+styles.imgCardSide} src={post.mainPostImageUrl}></img>
                                            </div>
                                            {/* <div className="col pt-0 pt-sm-2"> */}
                                         
                                            <div className="col mt-3 mt-md-0">
                                                <h3 className="">{post.title}</h3>
                                                <div className="mb-2 text-secondary">
                                                    <span className="mr-2">Liked: {(new Date(post.updated)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})},</span>
                                                    <span>Updated: {(new Date(post.updated)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <strong className="font-weight-bold">Category: </strong> {post.category.toUpperCase()}
                                                </div>
                                                <div className="mb-3">
                                                    <strong className="font-weight-bold">Tags: </strong> {post.tags.split("|").join(", ")}
                                                </div>
                                              
                                               
                                                <div className="mb-5">{post.description}</div>
                                                <div className={"row text-left"} >
                                                    <div className="col">
                                                        <button className={"btn mr-2 "+(post.likers.includes(this.props.authUser.id)?"btn-success":"btn-secondary")}
                                                            onClick={(e)=>{
                                                                e.stopPropagation(); 
                                                                this.handleLikePost(index)}}
                                                        >
                                                            <i className="far fa-thumbs-up"></i> Like · {post.likers.length}
                                                        </button>
                                                        <button className={"btn "+(post.dislikers.includes(this.props.authUser.id)?"btn-danger":"btn-secondary")}
                                                            onClick={(e)=>{
                                                                e.stopPropagation(); 
                                                                this.handleDislikePost(index)}}
                                                        >
                                                            <i className="far fa-thumbs-down"></i> Dislike · {post.dislikers.length}
                                                        </button>
                                                    </div>
                                                    {
                                                        post.author.id==this.props.authUser.id?
                                                        <div className="col-4 text-right">
                                                            <button className={"btn btn-warning"}
                                                                onClick={(e)=>{
                                                                    e.stopPropagation();
                                                                    this.onClickEditPostButton(post.id);
                                                                }}
                                                            >
                                                                <i className="fas fa-edit"></i> Edit
                                                            </button>
                                                        </div>
                                                        :null
                                                    }
                                                </div>
                                                {/* <span className="ml-auto text-right">
                                                    
                                                </span> */}
                                                {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                                            </div>
                                            {/* <div className="card-footer text-muted">
                                                2 days ago
                                            </div> */}
                                        </div>
                                    </div>
                                    // <div key={post.id} className="col-lg-2 col-md-3 col-sm-6">
                                    //     {post.title}
                                    // </div>
                                );
                            })
                            :
                            this.state.posts && this.state.posts.length==0?
                            <h3 className="mx-auto text-secondary">
                                You didn't like any post.
                            </h3>
                            :null
                        }                 
                        
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First 
                            onClick={(e)=>{                  
                                if(this.state.pagination.currentPage!=1){
                                    this.handleChangePage(1);
                                }
                            }}

                            disabled={this.state.pagination.currentPage<=1}
                        />
                        <Pagination.Prev 
                            onClick={(e)=>{                  
                                if(this.state.pagination.currentPage>1){
                                    this.handleChangePage(this.state.pagination.currentPage-1);
                                }
                            }}

                            disabled={this.state.pagination.currentPage<=1}
                        />
                        {paginationItems}
                        <Pagination.Next 
                            onClick={(e)=>{
                                if(this.state.pagination.currentPage<this.state.pagination.totalPages){
                                    this.handleChangePage(this.state.pagination.currentPage+1);
                                }
                            }}
                            disabled={this.state.pagination.currentPage>=this.state.pagination.totalPages}
                        />
                        <Pagination.Last 
                            onClick={(e)=>{
                                if(this.state.pagination.currentPage<this.state.pagination.totalPages){
                                    this.handleChangePage(this.state.pagination.totalPages);
                                }
                            }}
                            disabled={this.state.pagination.currentPage>=this.state.pagination.totalPages}
                        />
                    </Pagination>
                </div> 
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LikedPosts));