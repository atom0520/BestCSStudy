import React, { Component } from 'react'
import MemberCard from './MemberCardComponent';
import { alertifyService } from '../../services/AlertifyService';
import { connect } from 'react-redux';
import { fetchUsers, sendLike } from '../../redux/ActionCreators';
import { Pagination } from 'react-bootstrap';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user,
        users: state.users
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUsers: (pageNumber, pageSize, userParams, onSuccess, onError) => { dispatch(fetchUsers(pageNumber, pageSize, userParams, onSuccess, onError)); },
    sendLike: (id, recipientId, onSuccess, onError) => { dispatch(sendLike(id, recipientId, onSuccess, onError)); }
});

const genderOptions = [{value:'male', display:'Male'}, {value:'female', display:'Female'}]
const orderByOptions = [{value:'created', display:'Created Time'}, {value:'lastActive', display:'Last Active Time'}]

class MemberList extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.users);

        this.state = {
            // usersParamsForm:{

            // },
            userParams:{
                gender: this.props.authUser.gender == 'female'? 'male' : 'female',
                minAge: 0,
                maxAge: 200,
                orderBy: 'lastActive'
            },
            pagination: {
                currentPage: 1,
                itemsPerPage: 5,
                totalItems: 0,
                totalPages: 0
            }
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.handleInputChangeUsersParamsForm = this.handleInputChangeUsersParamsForm.bind(this);
        this.handleSubmitUsersParamsForm = this.handleSubmitUsersParamsForm.bind(this);
        this.handleClickLikeUserButton = this.handleClickLikeUserButton.bind(this);
    }

    componentDidMount() {
        console.log("MemberList.componentDidMount");
        
        setTimeout(()=>{
           this.loadUsers(this.state.pagination.currentPage);
        },1);

    }

    resetFilter(){
        this.setState({
            userParams:{
                gender: this.props.authUser.gender == 'female'? 'male' : 'female',
                minAge: 18,
                maxAge: 99,
                orderBy: 'lastActive'
            }
        });

        setTimeout(()=>{
           this.loadUsers(this.state.pagination.currentPage);
        },1);
    }

    handleInputChangeUsersParamsForm(event){

        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            userParams: {...this.state.userParams, 
                [name]: value
            }
        });

    }

    handleSubmitUsersParamsForm(event){
        event.preventDefault();

        this.loadUsers(this.state.pagination.currentPage);
    }

    loadUsers(pageIndex){
        console.log('MemberListComponent.loadUsers',this.state.userParams);
        this.props.fetchUsers(
            pageIndex,
            this.state.pagination.itemsPerPage,
            this.state.userParams,
            (users, pagination)=>{
                alertifyService.success('Fetched users successfully!');
                
                this.setState({
                    pagination:pagination
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            },
        );
    }

    handleChangePage(pageIndex){
        console.log('MemeberListComponent.handleChangePage', pageIndex);
        // this.setState({
        //     pagination: {...this.state.pagination, currentPage:pageIndex}
        // });
        
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
                        <h2>Your matches - {this.state.pagination.totalItems} found</h2>
                    </div>
                    <form className="form-inline my-1" noValidate onSubmit={this.handleSubmitUsersParamsForm}>
                        <div className="form-group px-2">
                            <label className="mr-1">Age From</label>
                            <input type="number" className="form-control ml-1" style={{width: "70px"}} id="minAge" name="minAge"
                                value={this.state.userParams.minAge}
                                onChange={this.handleInputChangeUsersParamsForm}
                            />
                        </div>
                    
                        <div className="form-group px-2">
                            <label className="mr-1">Age To</label>
                            <input type="number" className="form-control ml-1" style={{width: "70px"}}id="maxAge" name="maxAge"
                                value={this.state.userParams.maxAge}
                                onChange={this.handleInputChangeUsersParamsForm}
                            />
                        </div>
                    
                        <div className="form-group px-2">
                            <label className="mr-1">Show</label>
                            <select className="form-control ml-1" style={{width: "108px"}} id="gender" name="gender"
                                value={this.state.userParams.gender}
                                onChange={this.handleInputChangeUsersParamsForm}
                            >
                                {
                                    genderOptions.map(gender=>{
                                        return (
                                            <option key={gender.value} value={gender.value}>
                                                { gender.display }
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        
                        <div className="form-group px-2">
                            <label className="mr-1">Order By</label>
                            <select className="form-control ml-1" style={{width: "166px"}} id="orderBy" name="orderBy"
                                value={this.state.userParams.orderBy}
                                onChange={this.handleInputChangeUsersParamsForm}
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

                        <button type="submit" className="btn btn-primary" style={{marginLeft:"10px"}}>Apply Filters</button>
                        <button type="button" className="btn btn-info" style={{marginLeft:"10px"}}
                            onClick={(e)=>{this.resetFilter()}}
                        >Reset Filter</button>
                    
                    </form>
                    <br/>
                    <div className="row">                    
                        {
                            this.props.users.users.map((user)=>{
                                return(
                                    <div key={user.id} className="col-lg-2 col-md-3 col-sm-6">
                                        <MemberCard 
                                            user={user}
                                            handleClickLikeButton={(e)=>{this.handleClickLikeUserButton(user)}}
                                        />
                                    </div>
                                    // <p key={user.id}>{user.knownAs}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);