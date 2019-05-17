import React, { Component } from 'react'
import { Pagination } from 'react-bootstrap';
import { } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';
import { postCategoryOptions } from "../shared/global";

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => ({
});

const orderByOptions = [{value:'postedTime', display:'Posted Time'}, {value:'mostLikes', display:'Most Likes'}]

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 5,
                totalItems: 0,
                totalPages: 0
            }
        };

        this.handleChangePage = this.handleChangePage.bind(this);
    }

    componentDidMount() {
 
    }

    handleChangePage(pageIndex){
       
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
                        <h2>Search Study Resources</h2>
                    </div>
                    <form className="row" noValidate>   
                       
                        <div className="form-inline ml-3 mb-2">
                                <label className="mr-2">Category</label>
                                <select className="form-control" style={{width: "108px"}} name="category">
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
                  
                     
                  
                        
                        <div className="col-sm-12 col-lg mb-2" >
                    
                        <div className="input-group ">
                            <input className="form-control  "  type="text" placeholder="Web Development"
                                name="content"
                            
                            />
                       
                            <div className="input-group-append">
                             
                                <button type="submit" className="btn btn-primary" >Search</button>
                            </div>
                        </div>

                        </div>
                    
                        <div className="form-inline ml-auto mb-2">
                            <label className="mr-2">Order By</label>
                            <select className="form-control" style={{width: "166px"}} name="orderBy"
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
                    <div className="row">                    
                        {
                            this.state.posts.map((post)=>{
                                return(
                                    <div key={post.id} className="col-lg-2 col-md-3 col-sm-6">
                                        {post.name}
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

export default connect(mapStateToProps, mapDispatchToProps)(Posts);