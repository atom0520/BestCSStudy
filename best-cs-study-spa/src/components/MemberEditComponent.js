import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchUser, updateUser } from '../redux/ActionCreators';
import { alertifyService } from '../services/AlertifyService';
import styles from './MemberEditComponent.module.scss';
import { Tabs, Tab } from 'react-bootstrap';
import { Control, LocalForm} from 'react-redux-form';
import { Prompt } from 'react-router-dom';
import PhotoEditor from './PhotoEditorComponent';
import ImgUser from '../shared/img/user.png';
import TimeAgo from 'react-timeago'
import { genderOptions } from "../shared/global";
import { Form, Field, useForm, FormSpy } from 'react-final-form'
import { required, minLength, maxLength, validDate } from '../shared/validators';

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
            // profileForm: {
            //     dirty:false,
            //     touched: {
            //         introduction: false,
            //         lookingFor: false,
            //         interests: false,
            //         city: false,
            //         country: false
            //     }
            // }
            profileForm: {
                fields:{
                    introduction: {
                        value:''
                    },
                    gender: {
                        value:''
                    },
                    dateOfBirth: {
                        value:''
                    },
                    country: {
                        value:''
                    },
                    city: {
                        value:''
                    }
                },
                valid: false,
                touched: false,
                dirty: false
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
        setTimeout(this.props.fetchUser(
            this.props.auth.decodedToken.nameid,
            (user)=>{   
                // alertifyService.success('Fetched your profile successfully!');

                let profileForm = this.state.profileForm;
                profileForm.fields.introduction.value = user.introduction||"";
                profileForm.fields.gender.value = user.gender||"";
                profileForm.fields.dateOfBirth.value = user.dateOfBirth||"";
                profileForm.fields.country.value = user.country||"";
                profileForm.fields.city.value = user.city||"";

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

        // var photos = [...this.state.user.photos];

        // console.log(photo);
        // photos.push(photo);

        // this.setState({
        //     user: {...this.state.user, photos: photos}
        // });

        this.props.fetchUser(
            this.props.auth.decodedToken.nameid,
            (user)=>{   
                this.setState({
                    user: user
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        );
    }

    handleSetMainPhoto(photoId) {

        this.props.fetchUser(
            this.props.auth.decodedToken.nameid,
            (user)=>{   
                this.setState({
                    user: user
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        );

        // var photos = [...this.state.user.photos];

        // var oldMainPhoto = photos.find(p=>p.isMain==true);
        // var newMainPhoto = photos.find(p=>p.id==photoId);
        
        // newMainPhoto.isMain = true;

        // if(oldMainPhoto.id!=newMainPhoto.id){
        //     oldMainPhoto.isMain = false;
        // }

        // this.setState({
        //     user: {...this.state.user, photos: photos, photoUrl: newMainPhoto.url}
        // });
    }

    handleDeletedPhoto(photoId) {

        // var photos = [...this.state.user.photos];
        // console.log(photos.findIndex(p=>p.id==photoId));
        // photos.splice(photos.findIndex(p=>p.id==photoId), 1);

        // this.setState({
        //     user: {...this.state.user, photos: photos}
        // });

        this.props.fetchUser(
            this.props.auth.decodedToken.nameid,
            (user)=>{   
                this.setState({
                    user: user
                });
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        );
    }

    handleInputChangeProfileForm(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let form = this.state.profileForm;
        form.fields[name].value = value;
        form.dirty = true;

        form = this.validateProfileForm(form);

        this.setState({
            form: form
        });
    }

    handleBlurProfileForm = (event) => {

        const target = event.target;
        const name = target.name;
        console.log("MemberEditComponent.handleBlurProfileForm", name);
        let form = this.state.profileForm;
        form.fields[name].touched = true;
        form.touched = true;

        form = this.validateProfileForm(form);

        this.setState({
            form: form
        });
    }

    validateProfileForm(form){

        for (let key in form.fields) {
            if(!Array.isArray(form.fields[key])){
                form.fields[key].error = null;
            }
            else{
                form.fields[key].forEach(element => {
                    element.error = null;
                });
            }

        }
        
        form.valid = true;

        // if (!required(form.fields.introduction.value)){
        //     form.valid = false;      
        //     form.fields.introduction.error = 'Introduction is required.';
        // }
    
        // if (!required(form.fields.gender.value)){
        //     form.valid = false;
        //     form.fields.gender.error = 'Gender is required.';      
        // }
        console.log(form);
        if (required(form.fields.dateOfBirth.value) && !validDate(form.fields.dateOfBirth.value)){
            form.valid = false;
            form.fields.dateOfBirth.error = 'Date of birth should be in yyyy-mm-dd format.';      
        }
       
        return form;
    }

    handleSubmitProfileForm(event) {
        event.preventDefault();
        this.props.updateUser(this.props.auth.decodedToken.nameid,
            {
                introduction: this.state.profileForm.fields.introduction.value,
                gender: this.state.profileForm.fields.gender.value,
                dateOfBirth: this.state.profileForm.fields.dateOfBirth.value,
                country: this.state.profileForm.fields.country.value,
                city: this.state.profileForm.fields.city.value
            },
            ()=>{
                // alertifyService.success('Updated your profile successfully!');
                let profileForm = this.state.profileForm;
                profileForm.touched = false;
                profileForm.dirty = false;
                this.setState({
                    profileForm: profileForm
                });
            },
            error=>{
                alertifyService.error(error.message);
            });
    }

    // handleBlurProfileForm = (field) => (evt) => {
    //     this.setState({
    //         profileForm: {...this.state.profileForm, touched: {...this.state.profileForm.touched, [field]: true} }
    //     });
    // }

    showFormFieldError(name){
        return this.state.profileForm.fields[name].error && this.state.profileForm.fields[name].touched
    }


    render() { 

        // const { form, handleSubmit, values, pristine, submitting } = useForm();

        return(     
            <div className="container mt-4">
               
                    <Prompt
                        when={this.state.profileForm.dirty}
                        message="Are you sure you want to continue? Any unsaved changes will be lost!"
                    />
             
                <div className="row">
                    <div className="col-md-4">
                        <h1 className="text-left">
                            Edit Profile
                        </h1>
                    </div>
                    <div className="col-md-8">
              
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
                    <div className="col-md-4">
                        <div className="card">
                            <div className="p-3">
                            <img className="card-img-top img-thumbnail" src={this.state.user?this.state.user.photoUrl||ImgUser:ImgUser} alt={this.state.user?this.state.user.knownAs:''}/>
                            </div>
                            <div className={"card-body "+styles.cardBody}>
                                {/* <div className="text-left">
                                    <strong>Location:</strong>
                                    <p>{this.state.user?this.state.user.city:''}, {this.state.user?this.state.user.country:''}</p>
                                </div>
                                <div className="text-left">
                                    <strong>Age:</strong>
                                    <p>{this.state.user?this.state.user.age:''}</p>
                                </div> */}
                                <div className="text-left">
                                    <strong>Last Active At:</strong>
                                    <p>{this.state.user?<TimeAgo date={this.state.user.lastActive} live={false}/>:null}</p>
                                    {/* <p>{this.state.user?this.state.user.lastActive:''}</p> */}
                                </div>
                                <div className="text-left">
                                    <strong>Register At:</strong>
                                    {/* <p>{this.state.user?this.state.user.created:''}</p> */}
                                    <p>{this.state.user?(new Date(this.state.user.created)).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}):''}</p>
                                </div>
                            </div>
                            <div className={"card-footer "+styles.cardFooter}>
                                <button disabled={!this.state.profileForm.dirty} form="profile-form" className="btn btn-success btn-block">Save Changes</button>
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-md-8">
                        <div className="tab-panel">
                            <Tabs className="member-tabs" defaultActiveKey="edit-profile">
                                <Tab className="text-left" eventKey="edit-profile" title="Edit Profile">
                                <form noValidate id="profile-form" className="mt-3 mx-2" onSubmit={this.handleSubmitProfileForm}>
                                    <div className="form-group row text-left">
                                        <label className="col-sm-2 col-form-label font-weight-bold ">Introduction</label>
                                        <div className="col-sm">
                                            <textarea name="introduction" type="text" className={"form-control "+(this.showFormFieldError('introduction')?'is-invalid':'')} placeholder="Write something about yourself..."
                                                value={this.state.profileForm.fields.introduction.value}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm}
                                                // minLength={minTitleLength} maxLength={maxTitleLength}
                                            />
                                            <div className="invalid-feedback">{this.showFormFieldError('introduction')?this.state.form.fields.introduction.error:''}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row text-left ">
                                        <label className="col-sm-2 col-form-label font-weight-bold">Gender</label>
                                        <div className="col-sm col-lg-5 col-md-6">
                                           
                                            <select name="gender" className={"form-control "+(this.showFormFieldError('gender')?'is-invalid':'')} 
                                                value={this.state.profileForm.fields.gender.value}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm}
                                            >
                                            <option value=''></option>
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
                                            <div className="invalid-feedback">{this.showFormFieldError('gender')?this.state.form.fields.gender.error:''}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row text-left ">
                                        <label className="col-sm-2 col-form-label font-weight-bold">Date of Birth</label>
                                        <div className="col-sm col-lg-5 col-md-6">
                                            <input name="dateOfBirth" type="date" className={"form-control "+(this.showFormFieldError('dateOfBirth')?'is-invalid':'')} 
                                                value={this.state.profileForm.fields.dateOfBirth.value}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm}
                                            />
                                           
                                            <div className="invalid-feedback">{this.showFormFieldError('dateOfBirth')?this.state.form.fields.dateOfBirth.error:''}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row text-left ">
                                        <label className="col-sm-2 col-form-label font-weight-bold">Country</label>
                                        <div className="col-sm col-lg-5 col-md-6">
                                            <input name="country" type="text" className={"form-control "+(this.showFormFieldError('country')?'is-invalid':'')} 
                                                value={this.state.profileForm.fields.country.value}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm}
                                            />
                                           
                                            <div className="invalid-feedback">{this.showFormFieldError('country')?this.state.form.fields.country.error:''}</div>
                                        </div>
                                    </div>
                                    <div className="form-group row text-left ">
                                        <label className="col-sm-2 col-form-label font-weight-bold">City</label>
                                        <div className="col-sm col-lg-5 col-md-6">
                                            <input name="city" type="text" className={"form-control "+(this.showFormFieldError('city')?'is-invalid':'')} 
                                                value={this.state.profileForm.fields.city.value}
                                                onChange={this.handleInputChangeProfileForm}
                                                onBlur={this.handleBlurProfileForm}
                                            />
                                           
                                            <div className="invalid-feedback">{this.showFormFieldError('city')?this.state.form.fields.city.error:''}</div>
                                        </div>
                                    </div>
                                
                                </form>
                                    {/* <Form
                                        onSubmit={this.handleSubmitProfileForm}
                                        validate={values => {
                                          const errors = {};
                                          if (!required(values.introduction)) {
                                            errors.introduction = "Introduction is required.";
                                          }

                                          if (!required(values.gender)) {
                                            errors.gender = "Gender is required.";
                                          }

                                          if (!required(values.dateOfBirth)) {
                                            errors.dateOfBirth = "Date of birth is required.";
                                          }

                                          return errors;
                                        }}
                                        render={({ handleSubmit, reset, submitting}) => (
                                            <form id="profile-form" className="mt-3 mx-2" onSubmit={handleSubmit}>
                                              <Field name="introduction">
                                                {({ input, meta }) => (
                                                    <div className="form-group row text-left ">
                                                        <label className="col-sm-2 col-form-label font-weight-bold">Introduction</label>
                                                        <div className="col-sm">
                                                            <textarea {...input} type="text" className={"form-control "+(meta.touched&&meta.error?'is-invalid':'')} placeholder="Write something about yourself..."/>
                                                            <div className="invalid-feedback">{meta.touched&&meta.error?meta.error:''}</div>
                                                        </div>
                                                    </div>
                                                )}
                                              </Field>
                                              <Field name="gender">
                                                {({ input, meta }) => (
                                                    <div className="form-group row text-left">
                                                        <label className="col-sm-2 col-form-label font-weight-bold">Gender</label>
                                                        <div className="col-sm col-lg-5 col-md-6">
                                                            <select {...input} className={"form-control "+(meta.touched&&meta.error?'is-invalid':'')}>
                                                            <option disabled value='' style={{display:"none"}}></option>
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
                                                            <div className="invalid-feedback">{meta.touched&&meta.error?meta.error:''}</div>
                                                        </div>
                                                    </div>
                                                )}
                                              </Field>
                                              <Field name="dateOfBirth">
                                                    {({ input, meta }) => (
                                                        <div className="form-group row text-left">
                                                           <label className="col-sm-2 col-form-label font-weight-bold">Date of Birth</label>
                                                           <div className="col-sm col-lg-5 col-md-6">
                                                               <input {...input} type="date" className={"form-control "+(meta.touched&&meta.error?'is-invalid':'')} />
                                                               <div className="invalid-feedback">{meta.touched&&meta.error?meta.error:''}</div>
                                                           </div>
                                                       </div>
                                                    )}
                                              </Field>
                                              <Field name="country">
                                                    {({ input, meta }) => (
                                                        <div className="form-group row text-left">
                                                           <label className="col-sm-2 col-form-label font-weight-bold">Country</label>
                                                           <div className="col-sm col-lg-5 col-md-6">
                                                               <input {...input} type="text" className={"form-control "+(meta.touched&&meta.error?'is-invalid':'')} />
                                                               <div className="invalid-feedback">{meta.touched&&meta.error?meta.error:''}</div>
                                                           </div>
                                                       </div>
                                                    )}
                                              </Field>
                                              <Field name="city">
                                                    {({ input, meta }) => (
                                                        <div className="form-group row text-left">
                                                           <label className="col-sm-2 col-form-label font-weight-bold">City</label>
                                                           <div className="col-sm col-lg-5 col-md-6">
                                                               <input {...input} type="text" className={"form-control "+(meta.touched&&meta.error?'is-invalid':'')} />
                                                               <div className="invalid-feedback">{meta.touched&&meta.error?meta.error:''}</div>
                                                           </div>
                                                       </div>
                                                    )}
                                              </Field>
                                            </form>
                                          )}
                                    >

                                    </Form> */}
                                   
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