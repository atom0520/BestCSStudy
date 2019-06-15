import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchUser } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import styles from './MemberDetailsComponent.module.scss';
import { Tabs, Tab } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import ImgUser from '../shared/img/user.png';
import TimeAgo from 'react-timeago'
import MemberMessages from './member/MemberMessagesComponent';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { defaultDatetimeValue } from '../shared/global';
// import './MemberDetailsComponent.scss';
// import '../../App.css';

const mapStateToProps = state => {
    return {
        authUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUser: (id, onSuccess, onError) => { dispatch(fetchUser(id, onSuccess, onError)); }
});

class MemberDetails extends Component {
    constructor(props) {
        super(props);

        let initTab = queryString.parse(this.props.location.search).tab;
      
        this.state = {
            user:null,
            tab:initTab?initTab:'profile'
        }
    }

    componentDidMount(){
        console.log('MemberDetails.componentDidMount');
        setTimeout(this.props.fetchUser(
            this.props.match.params.id,
            (user)=>{                    
                alertifyService.success('Fetched user '+this.props.match.params.id+' successfully!'); 
                console.log(user);                  
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
        if(this.state.user)
        console.log((new Date(this.state.user.dateOfBirth)).valueOf());
        const photos = this.state.user? this.state.user.photos.map((photo)=>{
            return  {
                original: photo.url,
                thumbnail: photo.url
            };
        }):null;

        return(
            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <h1 className="text-left">
                            {this.state.user? this.state.user.username: ''}'s Profile
                        </h1>
                    </div>
                                 
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="p-3">
                            <img className="card-img-top img-thumbnail" src={this.state.user?this.state.user.photoUrl||ImgUser:ImgUser} alt={this.state.user?this.state.user.knownAs:''}/>
                            </div>
                            <div className={"card-body "+styles.cardBody}>
                                <div className="text-left">
                                    <strong>Last Active At:</strong>
                                    <p>{this.state.user?<TimeAgo date={this.state.user.lastActive} live={false}/>:null}</p>
                                </div>
                                <div className="text-left">
                                    <strong>Register At:</strong>
                                    <p>{this.state.user?(new Date(this.state.user.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}):''}</p>
                                </div>
                            </div>
                            {/* <div className={"card-footer "+styles.cardFooter}>
                                <div className="btn-group d-flex">
                                    <button className="btn btn-primary w-100">
                                    <i className="far fa-thumbs-up"></i> Like
                                    </button>
                                    <button className="btn btn-success w-100" onClick={(e)=>{this.setState({tabKey:'messages'})}}>Message</button>
                                </div>
                            </div> */}
                        </div>
                        
                    </div>
                    <div className="col-sm-8">
                        <div className="tab-panel">
                            <Tabs className="member-tabs" 
                                activeKey={this.state.tab}
                                onSelect={key => this.setState({ tab: key })}
                            >
                                <Tab className="text-left " eventKey="profile" title={'About '+ (this.state.user?this.state.user.username:'')}>
                                    <div className="mt-3 mx-2">
                                        <div className="row text-left">
                                            <label className="col-sm-2 font-weight-bold">Introduction</label>
                                            <div className="col-sm">
                                                <p>{this.state.user?this.state.user.introduction||"This lazy user didn't write anything...":''}</p>
                                            </div>
                                        </div>
                                        <div className="row text-left ">
                                            <label className="col-sm-2 font-weight-bold">Gender</label>
                                            <div className="col-sm col-lg-5 col-md-6">
                                                <p>{this.state.user?this.state.user.gender||"Unknown":''}</p>
                                            </div>
                                        </div>
                                        <div className="row text-left ">
                                            <label className="col-sm-2 font-weight-bold">Date of Birth</label>
                                            <div className="col-sm col-lg-5 col-md-6">
                                                <p>{this.state.user?
                                                    (new Date(this.state.user.dateOfBirth)).valueOf()==defaultDatetimeValue?"Unknown":(new Date(this.state.user.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})
                                                    :''}</p>
                                            </div>
                                        </div>
                                        <div className="row text-left ">
                                            <label className="col-sm-2 font-weight-bold">Country</label>
                                            <div className="col-sm col-lg-5 col-md-6">
                                                <p>{this.state.user?this.state.user.country||"Unknown":''}</p>
                                            </div>
                                        </div>
                                        <div className="row text-left ">
                                            <label className="col-sm-2 font-weight-bold">City</label>
                                            <div className="col-sm col-lg-5 col-md-6">
                                                <p>{this.state.user?this.state.user.city||"Unknown":''}</p>
                                            </div>
                                        </div>
                                    </div>
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
                                {/* {
                                    this.state.user!=null && this.state.user.id != this.props.authUser.id?
                                    <Tab className="text-left" eventKey="messages" title="Messages">
                                        <MemberMessages recipientId={this.state.user.id}/>
                                    </Tab>
                                    :null
                                } */}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MemberDetails));