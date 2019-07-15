import React, { Component } from 'react'
import { fetchMessageThread, sendMessage, markMessageAsRead } from '../../redux/ActionCreators';
import { alertifyService } from '../../services/AlertifyService';
import { connect } from 'react-redux';
import styles from './MemberMessagesComponent.module.scss';
import TimeAgo from 'react-timeago'
import { required } from '../../shared/validators';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchMessageThread: (id, recipientId, onSuccess, onError) => { dispatch(fetchMessageThread(id, recipientId, onSuccess, onError)); },
    sendMessage: (id, message, onSuccess, onError) => { dispatch(sendMessage(id, message, onSuccess, onError)); },
    markMessageAsRead: (userId, messageId, onSuccess, onError) => { dispatch(markMessageAsRead(userId, messageId, onSuccess, onError)); }
});
class MemberMessages extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            messages: [],
            newMessage: {
                content: ''
            }
        }

        this.handleInputChangeNewMessage = this.handleInputChangeNewMessage.bind(this);
        this.handleSendNewMessage = this.handleSendNewMessage.bind(this);
    }

    componentDidMount() {
        setTimeout(()=>{
           this.loadMessages();
        },1);
    }

    loadMessages(){
        this.props.fetchMessageThread(
            this.props.authUser.id,
            this.props.recipientId,
            (messages)=>{
                // alertifyService.success(`Fetched message thread successfully!`);
                
                this.setState({
                    messages: messages
                });

                for(let i=0; i< messages.length; i++){
                    if(messages[i].isRead == false 
                        && messages[i].recipientId == this.props.authUser.id)
                    {
                        this.props.markMessageAsRead(this.props.authUser.id, messages[i].id,
                            ()=>{
                                // alertifyService.success(`Marked message ${messages[i].id} as read successfully!`);
                            },
                            (error)=>{
                                alertifyService.error(error.message);
                            });
                    }
                }
            },
            (error)=>{
                alertifyService.error(error.message);
            },
        );
    }

    handleInputChangeNewMessage(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            newMessage: {...this.state.newMessage, 
                [name]: value
            }
        });

    }

    handleSendNewMessage(e){
        e.preventDefault();

        this.setState({
            newMessage: {...this.state.newMessage, 
                recipientId: this.props.recipientId
            }
        });

        setTimeout(()=>{
            this.props.sendMessage(this.props.authUser.id,
                this.state.newMessage,
                (message)=>{
                    let messages = this.state.messages;
                    messages.push(message);
                    this.setState({
                        messages:messages,
                        newMessage:{content:''}
                    });
    
                    // alertifyService.success(`Sent message successfully!`);
                },
                (error)=>{
                    alertifyService.error(error.message);
                });
         },1);
       
    }



    render() { 
        return(
            <div className={"card "+styles.card}>
              <div className={"card-body "+styles.cardBody}>
               {
                    this.state.messages.length == 0?
                    <div>
                       <p>No messages yet... say hi using the message box below</p>
                    </div>
                    :
                    <ul className={"chat "+styles.chat}>
                    {
                        this.state.messages.map(message=>{
                            return(
                            <li key={message.id}>
                                {
                                    message.senderId==this.props.recipientId?
                                    <div>
                                        <span className="chat-img float-left">
                                            <img src={message.senderPhotoUrl} alt={message.senderKnownAs} className={"rounded-circle mr-2 "+styles.roundedCircle}>
                                            </img>
                                        </span>
                                        <div className="chat-body">
                                            <div className="header">
                                                <strong className="primary-font">{message.senderKnownAs}</strong>
                                                <small className="text-muted float-right">
                                                    <span className="fa fa-clock-o"> <TimeAgo date={message.messageSent} live={false}/> </span>
                                                </small>
                                            </div>
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <span className="chat-img float-right">
                                            <img src={message.senderPhotoUrl} alt={message.senderKnownAs} className={"rounded-circle ml-2 "+styles.roundedCircle}>
                                            </img>
                                        </span>
                                        <div className="chat-body">
                                            <div className="header">
                                                <small className="text-muted">
                                                    <span className="fa fa-clock-o"> <TimeAgo date={message.messageSent} live={false}/> </span>
                                                    {
                                                        message.isRead?
                                                        <span className="text-success"> (read)</span>
                                                        :
                                                        <span className="text-danger"> (unread)</span>
                                                    }
                                                    
                                                </small>
                                                <strong className="primary-font float-right">{message.senderKnownAs}</strong>
                                         
                                            </div>
                                            <p>{message.content}</p>
                                        </div>                                      
                                    </div>
                                }
                            </li>
                            );
                        })
                    }
                    </ul>
               }
               </div>
               <div className="card-footer">
                    <form onSubmit={this.handleSendNewMessage}>
                        <div className="input-group">
                            <input className="form-control input-sm" type="text" placeholder="send a private message"
                                name="content"
                                value={this.state.newMessage.content}
                                onChange={this.handleInputChangeNewMessage}
                                onBlur={(e)=>{}}
                            />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-primary" disabled={!required(this.state.newMessage.content)}>Send</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberMessages);