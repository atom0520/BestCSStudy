import React, { Component } from 'react'
import { Pagination } from 'react-bootstrap';
import { fetchMessages, deleteMessage } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';
import styles from './MessagesComponent.module.scss';
import { withRouter } from 'react-router-dom';
import TimeAgo from 'react-timeago'

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchMessages: (id, pageNumber, pageSize, messageContainer, onSuccess, onError) => { dispatch(fetchMessages(id, pageNumber, pageSize, messageContainer, onSuccess, onError)); },
    deleteMessage: (id, userId, onSuccess, onError) => { dispatch(deleteMessage(id, userId, onSuccess, onError)); }
});

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 5,
                totalItems: 0,
                totalPages: 0
            },
            messageContainer: 'Unread'
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeMessageContainer = this.handleChangeMessageContainer.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
    }

    componentDidMount() {
        setTimeout(()=>{
           this.loadMessages(this.state.pagination.currentPage);
        },1);
    }

    loadMessages(pageIndex){
        this.props.fetchMessages(
            this.props.authUser.id,
            pageIndex,
            this.state.pagination.itemsPerPage,
            this.state.messageContainer,
            (messages, pagination)=>{
            
                alertifyService.success('Fetched messages successfully!');
                
                this.setState({
                    messages: messages,
                    pagination:pagination
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            },
        );
    }

    handleChangePage(pageIndex){
        this.loadMessages(pageIndex);
    }

    handleChangeMessageContainer(value){

        this.setState({
            messageContainer: value
        });
        
        setTimeout(()=>{
            this.loadMessages(this.state.pagination.currentPage);
         },1);
    }

    deleteMessage(id){
        alertifyService.confirm("Are you sure you want to delete this message",
            ()=>{
                this.props.deleteMessage(id, this.props.authUser.id, 
                    ()=>{
                        // let messages = this.state.messages;
                        // messages.splice(messages.findIndex(m => m.id==id), 1);
                        // this.setState({
                        //     messages:messages
                        // });
                        this.loadMessages(this.state.pagination.currentPage);
                        alertifyService.success('Message has been deleted');
                    },
                    (error)=>{
                        alertifyService.success(error.message);
                    });
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
                <div className="container mt-5">
                    <div className="row">
                        <div className="btn-group">
                            <button className={"btn btn-primary "+(this.state.messageContainer=="Unread"?"active":"")} 
                                onClick={(e)=>{this.handleChangeMessageContainer("Unread")}}
                            >
                                <i className="fa fa-envelope"></i> Unread
                            </button>
                            <button className={"btn btn-primary "+(this.state.messageContainer=="Inbox"?"active":"")} 
                                onClick={(e)=>{this.handleChangeMessageContainer("Inbox")}}
                            >
                                <i className="fa fa-envelope-open"></i> Inbox
                            </button>
                            <button className={"btn btn-primary "+(this.state.messageContainer=="Outbox"?"active":"")} 
                                onClick={(e)=>{this.handleChangeMessageContainer("Outbox")}}
                            >
                                <i className="fa fa-paper-plane"></i> Outbox
                            </button>
                        </div>
                    </div>

                    {
                        this.state.messages.length <= 0?
                        <div className="row">
                            <h3 className="my-2">No messages</h3>
                        </div>
                        : 
                        <div className="row" >
                            <table className={"table table-hover "+styles.table} style={{cursor: "pointer"}}>
                                <tbody>
                                <tr>
                                    <th className="text-left" style={{width: "30%"}}>Message</th>
                                    <th className="text-left" style={{width: "25%"}}>{this.state.messageContainer=='Outbox'?'To':'From'}</th>
                                    <th className="text-left" style={{width: "25%"}}>{this.state.messageContainer=='Outbox'?'Sent':'Received'}</th>
                                    <th className="text-left" style={{width: "20%"}}></th>
                                </tr>
                    
                                {
                                    this.state.messages.map(message=>{
                                        return (
                                        <tr key={message.id} onClick={(e)=>{this.props.history.push("/members/"+(this.state.messageContainer=='Outbox'?message.recipientId:message.senderId)+"?tab=messages")}}>
                                            <td className={"text-left "+styles.td}>{message.content}</td>
                                            <td className={"text-left "+styles.td}>
                                                {
                                                    this.state.messageContainer=='Outbox'?
                                                    <div>
                                                        <img src={message.recipientPhotoUrl} className={"img-circle rounded-circle mr-2 "+styles.imgCircle}/>
                                                        <strong>{message.recipientKnownAs}</strong>
                                                    </div>
                                                    :
                                                    <div>
                                                        <img src={message.senderPhotoUrl} className={"img-circle rounded-circle mr-2 "+styles.imgCircle}/>
                                                        <strong>{message.senderKnownAs}</strong>
                                                    </div>
                                                }
                                            </td>
                                            <td className={"text-left "+styles.td}><TimeAgo date={message.messageSent} live={false}/></td>
                                            <td className={"text-left "+styles.td}>
                                                <button className="btn btn-danger" 
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        this.deleteMessage(message.id);
                                                    }}
                                                >Delete</button>
                                            </td>
                                        </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    }
                  
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

  
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Messages));