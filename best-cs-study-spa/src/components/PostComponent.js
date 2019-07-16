import React, { Component } from 'react'
import styles from './PostComponent.module.scss';
import { maxPostListDescriptionDisplayLength } from '../shared/global';
import Rating from 'react-rating';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        authUser: state.auth.user
    }
}

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
           
        };

    }
    
    render() {
        let post = this.props.post;
        let index = this.props.index;

        return(
            <div className={"col-12 p-4 border-bottom "+(index==0?"border-top ":"")+styles.divPost} onClick={()=>this.props.onClickPost(post.id)}>

                <div className={"row text-left"} >
                    
                    <div className="my-auto text-center col-12 px-5 col-sm-2 px-sm-3">
                        <img className={" "+styles.imgCardSide} src={post.mainPostImageUrl}></img>
                    </div>
                
                    <div className="col col-sm-10 mt-3 mt-md-0">
                        <h3 className="">{post.title}</h3>
                        <div className="mb-2 text-secondary">
                            {
                                this.props.showPostedTime?
                                <span className="mr-2">Posted: {(new Date(post.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})},</span>
                                :null
                            }
                            {
                                this.props.showLikedTime?
                                <span className="mr-2">Liked: {(new Date(post.likedTime)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})},</span>
                                :null
                            }
                            
                            <span>Last Updated: {(new Date(post.updated)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                        </div>
                        
                        <div className="mb-1">
                            <strong className="font-weight-bold mr-1">Category: </strong> {post.category.toUpperCase()}
                        </div>
                        <div className="mb-2">
                            <strong className="font-weight-bold mr-1">Tags: </strong> {post.tags.map(tag=>tag.toTitleCase()).join(", ")}
                        </div>
                        <div className="mb-3">
                            <strong className="font-weight-bold mr-1">Rating: </strong>
                            <Rating 
                                emptySymbol={<span className="far fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                fullSymbol={<span className="fas fa-star fa-md" style={{color:"#ffcc00"}}></span>}
                                initialRating={3.9}
                                fractions={10}
                                readonly
                            />
                            <span className="ml-2">3.9 (19,298 ratings)</span>
                    
                        </div>
                        <div className={"mb-3"}>{post.description.length<=maxPostListDescriptionDisplayLength?post.description.length:(post.description.substring(0,maxPostListDescriptionDisplayLength)+"...")}</div>
                        
                        {
                            this.props.isAuthenticated?
                            <div className={"row text-left"} >
                                {/* <div className="col">
                                    <button className={"btn mr-2 "+(post.likers.includes(this.props.authUser.id)?"btn-success":"btn-outline-secondary")}
                                        onClick={(e)=>{
                                            e.stopPropagation(); 
                                            this.handleLikePost(index)}}
                                    >
                                        <i className="far fa-thumbs-up"></i> Like · {post.likers.length}
                                    </button>
                                    <button className={"btn "+(post.dislikers.includes(this.props.authUser.id)?"btn-danger":"btn-outline-secondary")}
                                        onClick={(e)=>{
                                            e.stopPropagation(); 
                                            this.handleDislikePost(index)}}
                                    >
                                        <i className="far fa-thumbs-down"></i> Dislike · {post.dislikers.length}
                                    </button>
                                </div> */}
                                {
                                    post.author.id==this.props.authUser.id && this.props.showEditButton?
                                    <div className="col-12 text-right">
                                        <button className={"btn btn-warning"}
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                this.props.onClickEditPostButton(post.id);
                                            }}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                    </div>
                                    :null
                                }
                            </div>
                            :
                            <div className={"row text-left"} >
                                {/* <div className="col">
                                    <button className={"btn mr-2 btn-outline-secondary"}
                                        onClick={(e)=>{
                                            e.stopPropagation(); 
                                            this.props.showModal("login"); }}
                                    >
                                        <i className="far fa-thumbs-up"></i> Like · {post.likers.length}
                                    </button>
                                    <button className={"btn btn-outline-secondary"}
                                        onClick={(e)=>{
                                            e.stopPropagation(); 
                                            this.props.showModal("login"); }}
                                    >
                                        <i className="far fa-thumbs-down"></i> Dislike · {post.dislikers.length}
                                    </button>
                                </div> */}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Post)