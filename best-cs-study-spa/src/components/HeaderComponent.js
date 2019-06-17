import React, { Component } from 'react';
import { Dropdown, Button, Modal } from 'react-bootstrap';
import styles from './HeaderComponent.module.scss';
import { NavLink, Link } from 'react-router-dom';
import { alertifyService } from '../services/AlertifyService';
import { connect } from 'react-redux';
import { loginUser, logoutUser, fetchAuthUser } from '../redux/ActionCreators';
import { withRouter } from 'react-router-dom';
import ImgUser from '../shared/img/user.png';
// import Register from './RegisterComponent';
// import Login from './LoginComponent';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    loginUser: (creds, onSuccess, onError) => { dispatch(loginUser(creds, onSuccess, onError)) },
    fetchAuthUser: (id, onSuccess, onError) => { dispatch(fetchAuthUser(id, onSuccess, onError)) },
    logoutUser: (onSuccess, onError) => { dispatch(logoutUser(onSuccess, onError)) }
});

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // loginForm: {
            //     username: '',
            //     password: '',
            //     touched: {
            //         username: false,
            //         password: false
            //     }
            // },
            modal: {
                show: false,
                type: ''
            }
           
        };

        // this.handleInputChangeLoginForm = this.handleInputChangeLoginForm.bind(this);
        // this.handleSubmitLoginForm = this.handleSubmitLoginForm.bind(this);
        // this.handleBlurLoginForm = this.handleBlurLoginForm.bind(this);

        this.handleClickEditProfileLink = this.handleClickEditProfileLink.bind(this);
        this.handleClickLogoutLink = this.handleClickLogoutLink.bind(this);

        // this.showModal = this.showModal.bind(this);
        // this.hideModal = this.hideModal.bind(this);


    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.fetchAuthUser(this.props.auth.user.id,
                (user)=>{
                    alertifyService.message('Fetched auth user successfully!',user);
                },
                err=>{
                    alertifyService.message('Failed to fetch auth user!');
                });
        }
    }
    // handleInputChangeLoginForm(event){
    //     const target = event.target;
    //     const value = target.value;
    //     const name = target.name;

    //     this.setState({
    //         loginForm: {...this.state.loginForm, 
    //             [name]: value
    //         }
    //     });
    // }

    // handleSubmitLoginForm(event) {
    //     event.preventDefault();

    //     this.props.loginUser(
    //         {username:this.state.loginForm.username, password:this.state.loginForm.password},
    //         ()=>{
    //             alertifyService.success('Logged in successfully!');
    //             this.props.history.push('/members');
    //         },
    //         (error)=>{

    //             alertifyService.error(error.message);
    //         }
    //     );
    // }

    // handleBlurLoginForm = (field) => (evt) => {
    //     this.setState({
    //         loginForm: {...this.state.loginForm, touched: {...this.state.loginForm.touched, [field]: true} }
    //     });
    // }

    // validateLoginForm(){
    //     let errors = {
    //         username: '',
    //         password: ''
    //     };

    //     let validForm = true;

    //     if (this.state.loginForm.username == ''){
    //         validForm = false;
    //         if (this.state.loginForm.touched.username) {
    //             errors.username = 'Username is required.';
    //         }           
    //     }

    //     if (this.state.loginForm.password == ''){
    //         validForm = false;
    //         if (this.state.loginForm.touched.password) {
    //             errors.password = 'Password is required.';
    //         }
    //     }
        
    //     return {
    //         errorsLoginForm: errors, 
    //         validLoginForm: validForm
    //     };
    // }

    handleClickLogoutLink(event){
        this.props.logoutUser(
            ()=>{
                alertifyService.message('Logged out successfully!');
                // this.props.history.push('/home');
            }
        );
    }

    handleClickEditProfileLink(event){
        this.props.history.push("/member/edit");
    }

    // showModal(type){
    //     this.setState({
    //         modal: {...this.state.modal, show:true, type:type}
    //     });
    // }

    // hideModal(){
    //     console.log("HeaderComponent.hideModal");
    //     this.setState({
    //         modal: {...this.state.modal, show:false}
    //     });
    // }

    render() {

        // let {errorsLoginForm, validLoginForm} = this.validateLoginForm();

        return(
            <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                <div className="container">
                    <Link to="/home" className="navbar-brand">Best CS Study</Link>
  
                    
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" >                                
                                <NavLink to="/search" className="nav-link" activeClassName="active">Search</NavLink>
                            </li>
                            {
                                this.props.auth.isAuthenticated?
                                <li className="nav-item" >
                                    <NavLink to="/likedPosts" className="nav-link" activeClassName="active">Liked</NavLink>
                                </li>
                                : null
                            }
                            {
                                this.props.auth.isAuthenticated?
                                <li className="nav-item" >
                                    <NavLink to={`/userPosts/${this.props.auth.user.id}`} className="nav-link" activeClassName="active">My Posts</NavLink>
                                </li>
                                : null
                            }
                        </ul>
                       
                        {
                            this.props.auth.isAuthenticated?       
                            <Link to={`/createPost`}>
                                <button className="btn btn-success my-2 my-sm-0 mr-3">Create New Post</button>
                            </Link>
                            : null
                        }
                        {
                            this.props.auth.isAuthenticated?
                            <Dropdown>
                                <span className="mr-2">
                                    <img className={styles.imgUser} src={this.props.auth.user.mainPhotoUrl || ImgUser} alt=""/>
                                </span>
                                <Dropdown.Toggle as="a" className={styles.dropdownToggle + " text-light"}>
                                    Welcome {this.props.auth.decodedToken.unique_name}
                                </Dropdown.Toggle>

                                <Dropdown.Menu as="div" className="mt-3">
                                    <Dropdown.Item as="a" className={styles.dropdownItem} onClick={this.handleClickEditProfileLink }>
                                        <i className="fas fa-user mr-1"></i> Edit Profile                                 
                                    </Dropdown.Item>
                                    <Dropdown.Item as="a" className={styles.dropdownItem} onClick={this.handleClickLogoutLink}>
                                        <i className="fas fa-sign-out-alt mr-1"></i> Logout
                                    </Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                    
                            : null
                        }
                        {
                            !this.props.auth.isAuthenticated?
                            <button className="btn btn-info my-2 my-sm-0 mr-3" onClick={() => this.props.showModal('login')}>Log In</button>
                            : null
                        }
                        {
                            !this.props.auth.isAuthenticated?
                            <button className="btn btn-success my-2 my-sm-0" onClick={() => this.props.showModal('register')}>Sign Up</button>
                            : null
                        }
                </div>


                {/* <Modal
                    show={this.state.modal.show}
                    onHide={this.hideModal}
                    animation={true}
                    backdrop={'static'}
                    centered
                    scrollable={true}
                >
                    <Modal.Body className="mx-4">
                        {
                            this.state.modal.type=='login'?
                            <Login close={this.hideModal}/>
                            :null
                        }
                        {
                            this.state.modal.type=='register'?
                            <Register close={this.hideModal}/>
                            : null
                        }
                       
                    </Modal.Body>
                </Modal> */}
            </nav>
        );
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));