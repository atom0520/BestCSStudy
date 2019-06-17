import React, { Component } from 'react';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { alertifyService } from '../services/AlertifyService';
import { required, minLength, maxLength, validDate } from '../shared/validators';
import { connect } from 'react-redux';
import { loginUser } from '../redux/ActionCreators';
import { withRouter } from 'react-router-dom';

const mapDispatchToProps = dispatch => ({
    loginUser: (creds, onSuccess, onError) => { dispatch(loginUser(creds, onSuccess, onError)) }
});

class Login extends Component {

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
    }


    componentDidMount(){
        console.log("RegisterComponent.componentDidMount",this.props);
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

        this.props.loginUser(
            {
                username:this.state.form.fields.username.value, 
                password:this.state.form.fields.password.value
            },
            ()=>{
                alertifyService.success('Logged in successfully!');
                // this.props.history.push('/posts');
                this.props.close();                
            },
            (error)=>{

                alertifyService.error(error.message);
            }
        );
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

        return form;
    }

    showFormFieldError(name){
        return this.state.form.fields[name].error && this.state.form.fields[name].touched
    }

    render(){
        // let {formErrors, validForm} = this.validateForm();

        return(
            <form className="" noValidate onSubmit={this.handleSubmitForm}>
                <h2 className="text-center text-primary my-2">Log In</h2>
                <hr className="mb-4"/>

                <div className="form-group">
                    <label className="font-weight-bold">Username</label>
                    <input className={"form-control "+(this.showFormFieldError('username')?'is-invalid':'')} type="text" placeholder="Username"
                        name='username'
                        value={this.state.form.fields.username.value}
                        onChange={this.handleInputChangeForm}
                        onBlur={this.handleBlurForm}
                        />
                    <div className="invalid-feedback">{this.showFormFieldError('username')?this.state.form.fields.username.error:''}</div>
                </div>
                <div className="form-group">
                    <label className="font-weight-bold">Password</label>
                    <div className="input-group">
                        <input className={"form-control "+(this.showFormFieldError('password')?'is-invalid':'')} type={this.state.form.fields.password.visible?"text":"password"} placeholder="Password"
                            name='password'
                            value={this.state.form.fields.password.value}
                            onChange={this.handleInputChangeForm}
                            onBlur={this.handleBlurForm}
                            />
                       
                        <div className="input-group-append">
                            <span className="input-group-text"><i className={this.state.form.fields.password.visible?"fas fa-eye-slash":"fas fa-eye"} style={{cursor: "pointer"}} onClick={()=>this.togglePasswordVisibility('password')}></i></span>
                        </div>
                        <div className="invalid-feedback">{this.showFormFieldError('password')?this.state.form.fields.password.error:''}</div>
                    </div>
                </div>
               
                {/* <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1"/>
                    <label class="custom-control-label" for="customCheck1">Remember Me</label>
                    <div className="invalid-feedback">asdasda</div>
                </div> */}
               
                <div className="form-group text-center mt-4">
                    <button className="btn btn-info mr-2" type="submit" >Log In</button>
                    <button className="btn btn-secondary" type="button" onClick={this.props.close}>Cancel</button>
                </div>
            </form>
            
        );
    }
  
};

export default withRouter(connect(null, mapDispatchToProps)(Login));