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
        };

        this.handleClickEditProfileLink = this.handleClickEditProfileLink.bind(this);
        this.handleClickLogoutLink = this.handleClickLogoutLink.bind(this);

    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.fetchAuthUser(this.props.auth.user.id,
                (user)=>{
                    // alertifyService.success('Fetched auth user successfully!');
                },
                error=>{
                    alertifyService.error(error.message);
                });
        }
    }

    handleClickLogoutLink(event){
        this.props.logoutUser(
            ()=>{
                // alertifyService.message('Logged out successfully!');
            }
        );
    }

    handleClickEditProfileLink(event){
        this.props.history.push("/member/edit");
    }

    render() {

        return(
            <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                <div className="container">
                    <Link to="/home" className="navbar-brand">Best CS Study</Link>
  
                    
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" >                                
                                <NavLink to="/search" className="nav-link" activeClassName="active">Search</NavLink>
                            </li>
                            {/* {
                                this.props.auth.isAuthenticated?
                                <li className="nav-item" >
                                    <NavLink to="/likedPosts" className="nav-link" activeClassName="active">Liked</NavLink>
                                </li>
                                : null
                            } */}
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
            </nav>
        );
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));