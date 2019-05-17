import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchUser, updateUser } from '../../redux/ActionCreators';
import { alertifyService } from '../../services/AlertifyService';
import styles from './MemberEditComponent.module.scss';
import { Tabs, Tab } from 'react-bootstrap';
import { Control, LocalForm} from 'react-redux-form';
import { Prompt } from 'react-router-dom';
import PhotoEditor from './PhotoEditorComponent';
import ImgUser from '../../shared/img/user.png';
import TimeAgo from 'react-timeago'

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUser: (id, onSuccess, onError) => { dispatch(fetchUser(id, onSuccess, onError)); },
    updateUser: (id, user, onSuccess, onError) => { dispatch(updateUser(id, user, onSuccess, onError)); }
});


class MemberEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            profileForm: {
                dirty:false,
                touched: {
                    introduction: false,
                    lookingFor: false,
                    interests: false,
                    city: false,
                    country: false
                }
            }
        }

        this.handleInputChangeProfileForm = this.handleInputChangeProfileForm.bind(this);
        this.handleBlurProfileForm = this.handleBlurProfileForm.bind(this);
        this.handleSubmitProfileForm = this.handleSubmitProfileForm.bind(this);

        this.handleBeforeunload = this.handleBeforeunload.bind(this);

        this.handleUploadedPhoto = this.handleUploadedPhoto.bind(this);
        this.handleSetMainPhoto = this.handleSetMainPhoto.bind(this);
        this.handleDeletedPhoto = this.handleDeletedPhoto.bind(this);
    }

    componentDidMount(){
        console.log('MemberEdit.componentDidMount');
        setTimeout(this.props.fetchUser(
            this.props.auth.decodedToken.nameid,
            (user)=>{   
                alertifyService.success('Fetched your profile successfully!');                   
                this.setState({
                    user: user
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        ),1);

        window.addEventListener("beforeunload", this.handleBeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeunload);
    }

    handleBeforeunload(event) {
        if(this.state.profileForm.dirty){
            event.preventDefault();    
            return (event || window.event).returnValue = 'Are you sure you want to continue? Any unsaved changes will be lost!';
        }       
    }

    handleUploadedPhoto(photo) {

        var photos = [...this.state.user.photos];

        console.log(photo);
        photos.push(photo);

        this.setState({
            user: {...this.state.user, photos: photos}
        });
    }

    handleSetMainPhoto(photoId) {

        var photos = [...this.state.user.photos];

        var oldMainPhoto = photos.find(p=>p.isMain==true);
        var newMainPhoto = photos.find(p=>p.id==photoId);
        
        newMainPhoto.isMain = true;

        if(oldMainPhoto.id!=newMainPhoto.id){
            oldMainPhoto.isMain = false;
        }

        this.setState({
            user: {...this.state.user, photos: photos, photoUrl: newMainPhoto.url}
        });
    }

    handleDeletedPhoto(photoId) {

        var photos = [...this.state.user.photos];
        console.log(photos.findIndex(p=>p.id==photoId));
        photos.splice(photos.findIndex(p=>p.id==photoId), 1);

        this.setState({
            user: {...this.state.user, photos: photos}
        });
    }

    handleInputChangeProfileForm(event){

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            user: {...this.state.user, 
                [name]: value
            },
            profileForm: {...this.state.profileForm, dirty: true}
        });
    }

    handleSubmitProfileForm(event) {
        event.preventDefault();
        this.props.updateUser(this.props.auth.decodedToken.nameid,
            this.state.user,
            ()=>{
                alertifyService.success('Updated your profile successfully!');
                this.setState({
                    profileForm: {...this.state.profileForm, dirty: false}
                });
            },
            error=>{
                alertifyService.error(error.message);
            });
    }

    handleBlurProfileForm = (field) => (evt) => {
        this.setState({
            profileForm: {...this.state.profileForm, touched: {...this.state.profileForm.touched, [field]: true} }
        });
    }

    render() { 
        return(     
            <div className="container mt-4">
                <Prompt
                    when={this.state.profileForm.dirty}
                    message="Are you sure you want to continue? Any unsaved changes will be lost!"
                />
                <div className="row">
                    <div className="col-sm-4">
                        <h1>
                            Your Profile
                        </h1>
                    </div>
                    <div className="col-sm-8">
                        {
                            this.state.profileForm.dirty?
                            <div className="alert alert-info text-left">
                                <strong>Information:</strong> You have made changes. Any unsaved changes will be lost!
                            </div>
                            :
                            null
                        }
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
                                    {/* <p>{this.state.user?this.state.user.created:''}</p> */}
                                    <p>{this.state.user?(new Date(this.state.user.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}):''}</p>
                                </div>
                            </div>
                            <div className={"card-footer "+styles.cardFooter}>
                                <button disabled={!this.state.profileForm.dirty} form="profile-form" className="btn btn-success btn-block">Save Changes</button>
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-sm-8">
                        <div className="tab-panel">
                            <Tabs className="member-tabs" defaultActiveKey="edit-profile">
                                <Tab className="text-left" eventKey="edit-profile" title="Edit Profile">
                                    <form id="profile-form" onSubmit={this.handleSubmitProfileForm}>
                                        <h4>Description</h4>
                                        <textarea rows="6" className="form-control"
                                            name="introduction"
                                            value={this.state.user?this.state.user.introduction||'':''}
                                            onChange={this.handleInputChangeProfileForm}
                                            onBlur={this.handleBlurProfileForm('introduction')}
                                        >
                                        </textarea>
                                        <h4>Looking For</h4>
                                        <textarea rows="6" className="form-control"
                                            name="lookingFor"
                                            value={this.state.user?this.state.user.lookingFor||'':''}
                                            onChange={this.handleInputChangeProfileForm}
                                            onBlur={this.handleBlurProfileForm('lookingFor')}
                                        ></textarea>
                                        <h4>Interests</h4>
                                        <textarea rows="6" className="form-control"
                                            name="interests" 
                                            value={this.state.user?this.state.user.interests||'':''}
                                            onChange={this.handleInputChangeProfileForm}
                                            onBlur={this.handleBlurProfileForm('interests')}
                                        ></textarea>
                                        <h4>Location Details</h4>
                                        <div className="form-inline">
                                            <label >City</label>
                                            <input className="form-control" type="text"
                                                name="city" 
                                                value={this.state.user?this.state.user.city:''}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm('city')}
                                            ></input>
                                            <label >Country</label>
                                            <input className="form-control" type="text"
                                                 name="country" 
                                                 value={this.state.user?this.state.user.country:''}
                                                 onChange={this.handleInputChangeProfileForm}
                                                 onBlur={this.handleBlurProfileForm('country')}
                                            ></input>
                                        </div>
                                    </form>
                                </Tab>
                                <Tab className="text-left" eventKey="edit-photos" title="Edit Photos">
                                    <PhotoEditor 
                                        photos={this.state.user?this.state.user.photos:null}
                                        handleUploadedPhoto={this.handleUploadedPhoto}
                                        handleSetMainPhoto={this.handleSetMainPhoto}
                                        handleDeletedPhoto={this.handleDeletedPhoto}
                                    />
                                </Tab>                               
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberEdit);