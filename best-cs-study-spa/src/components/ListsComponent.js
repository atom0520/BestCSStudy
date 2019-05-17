import React, { Component } from 'react'
import MemberCard from './member/MemberCardComponent';
import { Pagination } from 'react-bootstrap';
import { fetchUsers, sendLike } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUsers: (pageNumber, pageSize, userParams, onSuccess, onError) => { dispatch(fetchUsers(pageNumber, pageSize, userParams, onSuccess, onError)); },
    sendLike: (id, recipientId, onSuccess, onError) => { dispatch(sendLike(id, recipientId, onSuccess, onError)); }
});

class Lists extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            userParams:{
                likers: false,
                likees: true
            },
            pagination: {
                currentPage: 1,
                itemsPerPage: 5,
                totalItems: 0,
                totalPages: 0
            }
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleToggleUsersParams = this.handleToggleUsersParams.bind(this);
        this.handleClickLikeUserButton = this.handleClickLikeUserButton.bind(this);
    }

    loadUsers(pageIndex){
        this.props.fetchUsers(
            pageIndex,
            this.state.pagination.itemsPerPage,
            this.state.userParams,
            (users, pagination)=>{
            
                alertifyService.success('Fetched users successfully!');
                
                this.setState({
                    users: users,
                    pagination:pagination
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            },
        );
    }

    componentDidMount() {
        setTimeout(()=>{
           this.loadUsers(this.state.pagination.currentPage);
        },1);
    }

    handleToggleUsersParams(param){

        this.setState({
            userParams: {...this.state.userParams, 
                likers: param=='likers',
                likees: param=='likees'
            }
        });
        
        setTimeout(()=>{
            this.loadUsers(this.state.pagination.currentPage);
         },1);
    }

    handleChangePage(pageIndex){
        this.loadUsers(pageIndex);
    }

    handleClickLikeUserButton(recipient){
        this.props.sendLike(this.props.authUser.id, recipient.id,
            ()=>{
                alertifyService.success(`You have liked ${recipient.knownAs}!`);
            },
            (error)=>{
                alertifyService.error(error.message);
            }); 
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
                    <div className="text-center my-4">
                        <h2>{this.state.userParams.likers? 'Members who like me' : 'Members who I\'ve Liked'} : {this.state.pagination.totalItems}</h2>
                    </div>
                    <div className="row">
                        <div className="btn-group">
                            <button className={"btn btn-primary "+(this.state.userParams.likers?"active":"")} name="likers" onClick={(e)=>{this.handleToggleUsersParams('likers')}}>Members who like me</button>
                            <button className={"btn btn-primary "+(this.state.userParams.likees?"active":"")} name="likees" onClick={(e)=>{this.handleToggleUsersParams('likees')}}>Members who I like</button>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        {
                            this.state.users.map(user=>{
                                return (
                                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-2" key={user.id} >
                                        <MemberCard 
                                            user={user}
                                            handleClickLikeButton={(e)=>{this.handleClickLikeUserButton(user)}}
                                        />
                                    </div>
                                );
                            })
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

export default connect(mapStateToProps, mapDispatchToProps)(Lists);