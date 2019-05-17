import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { alertifyService } from '../services/AlertifyService';
import { required, minLength, maxLength, validDate } from '../shared/validators';
import { connect } from 'react-redux';
import { signupUser, loginUser } from '../redux/ActionCreators';
import { withRouter } from 'react-router-dom';

const mapDispatchToProps = dispatch => ({
    signupUser: (creds, onSuccess, onError) => { dispatch(signupUser(creds, onSuccess, onError)) },
    loginUser: (creds, onSuccess, onError) => { dispatch(loginUser(creds, onSuccess, onError)) }
});

class Register extends Component {

    constructor(props){
        super(props);

        this.state = {
            form: {
                fields:{
                    username: {
                        value:''
                    },
                    dateOfBirth: {
                        value:''
                    },
                    city: {
                        value:''
                    },
                    country: {
                        value:''
                    },
                    password: {
                        value:'',
                        visible:''
                    },
                    confirmPassword: {
                        value:'',
                        visible:''
                    }
                },
                valid: false,
                touched: false
            }
        };
        
        this.handleInputChangeForm = this.handleInputChangeForm.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleBlurForm = this.handleBlurForm.bind(this);
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);

        console.log(window);
    }

    handleInputChangeForm(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let form = this.state.form;
        form.fields[name].value = value;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }
    
    handleBlurForm = (event) => {
        const target = event.target;
        const name = target.name;

        let form = this.state.form;
        form.fields[name].touched = true;
        form.touched = true;

        form = this.validateForm(form);

        this.setState({
            form: form
        });
    }

    togglePasswordVisibility(name){
        let form = this.state.form;
        form.fields[name].visible = !form.fields[name].visible;
        this.setState({
            form
        });
    }

    validateForm(form){

        for (let key in form.fields) {
            form.fields[key].error = null;
        }
        
        form.valid = true;

        if (!required(form.fields.username.value)){
            form.valid = false;      
            form.fields.username.error = 'Username is required.';
        }
    
        if (!required(form.fields.password.value)){
            form.valid = false;
            form.fields.password.error = 'Password is required.';      
        }

        if (!required(form.fields.confirmPassword.value)){
            form.valid = false;
            form.fields.confirmPassword.error = 'Please re-enter your password.';
        }
        else if (form.fields.password.value != form.fields.confirmPassword.value){
            form.valid = false;
            form.fields.confirmPassword.error = 'Password and confirmed password do not match.';
        }

        return form;
    }

    showFormFieldError(name){
        return this.state.form.fields[name].error && this.state.form.fields[name].touched
    }

    handleSubmitForm(event) {
        event.preventDefault();
        
        let form = this.state.form;

        if(form.touched){
            if(!form.valid){
               
                for (let key in form.fields) {
                    form.fields[key].touched = true;
                }
                form.touched = true;

                this.setState({
                    form
                });
    
                alertifyService.error('Please correct the errors on this form.');
                return;
            }
        }
        else{
            
            for (let key in form.fields) {
                form.fields[key].touched = true;
            }
            form.touched = true;

            form = this.validateForm(form);

            this.setState({
                form
            });

            if(!form.valid){
                alertifyService.error('Please correct the errors on this form.');
                return;
            }
        }
       
        let creds = {
            username:this.state.form.fields.username.value, 
            password:this.state.form.fields.password.value
        };
        this.props.signupUser(
            creds,
            (user)=>{
                alertifyService.success("Registered user successfully!");
                this.props.close();
                this.props.loginUser(creds,
                    ()=>{
                        alertifyService.success("Logged in successfully!");
                    },
                    (error)=>{
                        alertifyService.error(error.message);
                    }
                );
            },
            (error)=>{
                alertifyService.error(error.message);
            }
        );
    }

    componentDidMount(){
        console.log("RegisterComponent.componentDidMount",this.props);
    }

    render(){
        // let {formErrors, formValid} = this.validateForm();

        return(
            <form className="" noValidate onSubmit={this.handleSubmitForm}>
                <h2 className="text-center text-primary my-2">Sign Up</h2>
                <hr className="mb-4"/>

                <div className="form-group">
                    <input name='username' type="text" placeholder="Username"
                        className={"form-control "+(this.showFormFieldError('username')?'is-invalid':'')} 
                        autoComplete="new-username"                        
                        value={this.state.form.fields.username.value}
                        onChange={this.handleInputChangeForm}
                        onBlur={this.handleBlurForm}
                        />
                    <div className="invalid-feedback">{this.showFormFieldError('username')?this.state.form.fields.username.error:''}</div>
                </div>
                {/* <div className="form-group">
                    <input name='dateOfBirth' type="date" placeholder="Date of Birth"
                        className={"form-control "+(formErrors.dateOfBirth?'is-invalid':'')}                 
                        value={this.state.form.fields.dateOfBirth.value}
                        onChange={this.handleInputChangeForm}
                        onBlur={this.handleBlurForm}
                        />
                    <div className="invalid-feedback">{formErrors.dateOfBirth}</div>
                </div> */}

                {/* <div className="form-group">
                    <input name='city' type="text" placeholder="City"
                        className={"form-control "+(formErrors.city?'is-invalid':'')}                 
                        value={this.state.form.fields.city.value}
                        onChange={this.handleInputChangeForm}
                        onBlur={this.handleBlurForm}
                        />
                    <div className="invalid-feedback">{formErrors.city}</div>
                </div>
                
                <div className="form-group">
                    <input name='country' type="text" placeholder="Country"
                        className={"form-control "+(formErrors.country?'is-invalid':'')}                 
                        value={this.state.form.fields.country.value}
                        onChange={this.handleInputChangeForm}
                        onBlur={this.handleBlurForm}
                        />
                    <div className="invalid-feedback">{formErrors.country}</div>
                </div> */}
                <div className="form-group">
                    <div className="input-group">
                        <input name='password' type={this.state.form.fields.password.visible?"text":"password"} placeholder="Password"
                            className={"form-control "+(this.showFormFieldError('password')?'is-invalid':'')} 
                            autoComplete="new-password"                            
                            value={this.state.form.fields.password.value}
                            onChange={this.handleInputChangeForm}
                            onBlur={this.handleBlurForm}
                        />
                       
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <i className={this.state.form.fields.password.visible?"fa fa-eye-slash":"fa fa-eye"}
                                    style={{cursor: "pointer"}}
                                    onClick={()=>this.togglePasswordVisibility('password')}>
                                </i>
                            </span>
                        </div>
                        <div className="invalid-feedback">{this.showFormFieldError('password')?this.state.form.fields.password.error:''}</div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <input name='confirmPassword' type={this.state.form.fields.confirmPassword.visible?"text":"password"} placeholder="Confirm Password"
                            className={"form-control "+(this.showFormFieldError('confirmPassword')?'is-invalid':'')}
                            value={this.state.form.fields.confirmPassword.value}
                            onChange={this.handleInputChangeForm}
                            onBlur={this.handleBlurForm}
                        />
                        
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <i className={this.state.form.fields.confirmPassword.visible?"fa fa-eye-slash":"fa fa-eye"} 
                                    style={{cursor: "pointer"}} 
                                    onClick={()=>this.togglePasswordVisibility('confirmPassword')}>
                                </i>
                            </span>
                        </div>
                        <div className="invalid-feedback">{this.showFormFieldError('confirmPassword')?this.state.form.fields.confirmPassword.error:''}</div>
                    </div>     
                </div>
               
                <div className="form-group text-center mt-4">
                    <button className="btn btn-success mr-2" type="submit" >Register</button>
                    <button className="btn btn-secondary" type="button" onClick={this.props.close}>Cancel</button>
                </div>
            </form>

        );
    }
  
};

export default withRouter(connect(null, mapDispatchToProps)(Register));