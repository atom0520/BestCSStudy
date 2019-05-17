import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/ActionCreators';
import { alertifyService } from '../../services/AlertifyService';
import styles from './MemberDetailsComponent.module.scss';
import { Tabs, Tab } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import ImgUser from '../../shared/img/user.png';
import TimeAgo from 'react-timeago'
import MemberMessages from './MemberMessagesComponent';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
// import './MemberDetailsComponent.scss';
// import '../../App.css';

// const mapStateToProps = state => {
//     return {
//         // users: state.users.usersDetails
//     }
// }

const mapDispatchToProps = dispatch => ({
    fetchUser: (id, onSuccess, onError) => { dispatch(fetchUser(id, onSuccess, onError)); }
});

class MemberDetails extends Component {
    constructor(props) {
        super(props);

        let initTab = queryString.parse(this.props.location.search).tab;
      
        this.state = {
            user:null,
            tab:initTab?initTab:'description'
        }
    }

    componentDidMount(){
        console.log('MemberDetails.componentDidMount');
        setTimeout(this.props.fetchUser(
            this.props.match.params.id,
            (user)=>{                    
                alertifyService.success('Fetched user '+this.props.match.params.id+' successfully!');                   
                this.setState({
                    user: user
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        ),1);
    }

    render() { 
        
        
        const photos = this.state.user? this.state.user.photos.map((photo)=>{
            return  {
                original: photo.url,
                thumbnail: photo.url
            };
        }):null;

        return(
            <div className="container mt-4">
                <div className="row">
                    <h1>
                        {this.state.user? this.state.user.knownAs: ''}'s Profile
                    </h1>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="p-3">
                            <img className="card-img-top img-thumbnail" src={this.state.user?this.state.user.photoUrl||ImgUser:ImgUser} alt={this.state.user?this.state.user.knownAs:''}/>
                            </div>
                            <div className={"card-body "+styles.cardBody}>
                                <div className="text-left">
                                    <strong>Location:</strong>
                                    <p>{this.state.user?this.state.user.city:''}, {this.state.user?this.state.user.country:''}</p>
                                </div>
                                <div className="text-left">
                                    <strong>Age:</strong>
                                    <p>{this.state.user?this.state.user.age:''}</p>
                                </div>
                                <div className="text-left">
                                    <strong>Last Active:</strong>
                                    <p>{this.state.user?<TimeAgo date={this.state.user.lastActive} live={false}/>:null}</p>
                                    {/* <p>{this.state.user?this.state.user.lastActive:''}</p> */}
                                </div>
                                <div className="text-left">
                                    <strong>Member Since:</strong>
                                    <p>{this.state.user?(new Date(this.state.user.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}):''}</p>
                                </div>
                            </div>
                            <div className={"card-footer "+styles.cardFooter}>
                                <div className="btn-group d-flex">
                                    <button className="btn btn-primary w-100">Like</button>
                                    <button className="btn btn-success w-100" onClick={(e)=>{this.setState({tabKey:'messages'})}}>Message</button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-sm-8">
                        <div className="tab-panel">
                            <Tabs className="member-tabs" 
                                activeKey={this.state.tab}
                                onSelect={key => this.setState({ tab: key })}
                            >
                                <Tab className="text-left" eventKey="description" title={'About '+ (this.state.user?this.state.user.username:'')}>
                                    <h4>Description</h4>
                                    <p>{this.state.user? this.state.user.introduction: ''}</p>
                                    <h4>Looking For</h4>
                                    <p>{this.state.user? this.state.user.lookingFor: ''}</p>
                                </Tab>
                                <Tab className="text-left" eventKey="interests" title="Interests">
                                    <h4>Interests</h4>
                                    <p>{this.state.user? this.state.user.interests: ''}</p>
                                </Tab>
                                <Tab className="text-left" eventKey="photos" title="Photos">
                                    {
                                        photos?
                                        <div className={styles.imageGallery}>
                                            <ImageGallery items={photos} showPlayButton={false} showFullscreenButton={false} useBrowserFullscreen={false}/>
                                        </div>
                                        :
                                        <h4>Photos will go here</h4>
                                    }
                                </Tab>
                                <Tab className="text-left" eventKey="messages" title="Messages">
                                    {
                                        this.state.user?
                                        <MemberMessages recipientId={this.state.user.id}/>
                                        :
                                        <h4>Messages will go here</h4>
                                    }
                                    
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(null, mapDispatchToProps)(MemberDetails));