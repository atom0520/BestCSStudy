import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signupUser } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Lists from './ListsComponent';
import MemberList from './member/MemberListComponent';
import MemberDetails from './MemberDetailsComponent';
import MemberEdit from './MemberEditComponent';
import Messages from './MessagesComponent';
import CreatePost from './CreatePostComponent';
import PostDetails from './PostDetailsComponent';
import Posts from './PostsComponent';
import EditPost from './EditPostComponent';
import LikedPosts from './LikedPostsComponent';
import UserPosts from './UserPostsComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Register from './RegisterComponent';
import Login from './LoginComponent';
// import { Modal } from 'react-bootstrap';
// import Register from './RegisterComponent';
// import Login from './LoginComponent';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
        // authUserId: state.auth.decodedToken.nameid
    }
}

const mapDispatchToProps = dispatch => ({
    
});

// const RenderValues = ({values, isLoading, errMess}) => {
//     if(isLoading){
//         return (
//             <div className="row">
//                 <Loading/>
//             </div>
//         );
//     }
//     else if(errMess){
//         return(
//             <div className="row">
//                 <h4>{errMess}</h4>
//             </div>
//         );
//     }
//     else {
       
//         const valueItems = values.map((value)=>{
//             console.log(value);
//             return (
//                 <div key={value.id} className="col-12">
//                     <p>Id: {value.id} Name: {value.name}</p>                
//                 </div>
//             );
//         });
//         return(
//             <div className="row">
//                 {valueItems}
//             </div>
//         );
//     }
// } 

class Main extends Component {
    constructor(props) {
        super(props);
     
       
        this.state = {
            modal: {
                show: false,
                type: ''
            }   
        };

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        console.log("MainComponent.componentDidMount");

        // window.addEventListener("beforeunload", this.keepOnPage);
    
    }

    componentWillUnmount() {
        console.log("MainComponent.componentWillUnmount");
        // window.removeEventListener('beforeunload', this.keepOnPage);
    }

    // componentDidUpdate(oldProps) {
    //     if (this.props.location !== oldProps.location) {
    //       this.onRouteChanged(oldProps.location, this.props.location);
    //     }
    // }

    // keepOnPage(e) {
    //     return (e || window.event).returnValue = 'Are you sure you want to close this page?';
    // }
    
    // onRouteChanged(oldLocation, newLocation) {
    // console.log("onRouteChanged!");
    // console.log(oldLocation);
    // console.log(newLocation);
    // }
    
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
    showModal(type){
        this.setState({
            modal: {...this.state.modal, show:true, type:type}
        });
    }

    hideModal(){
        console.log("MainComponent.hideModal");
        this.setState({
            modal: {...this.state.modal, show:false}
        });
    }

    render(){
        console.log("render main component");
        const AuthGuardedRoute = ({ render, ...rest }) => (
            <Route {...rest} render={
                this.props.isAuthenticated? render
                : (props)=><Redirect to={{ pathname: '/home', state: { from: props.location } }} />
            } />
          );

        return (
            <div className="Main">
                <Header showModal={this.showModal}/>
                {/* <Header history={this.props.history}/> */}
                <Switch>

                    <Route path="/home" component={() => <Home 
                            signupUser={this.props.signupUser} />}
                    />

                    <Route exact path="/search" render={(props) => <Posts showModal={this.showModal}/>}  />
                    <Route exact path="/posts/:id" render={(props) => <PostDetails showModal={this.showModal} />} />
                    <AuthGuardedRoute path="/posts/:id/edit" render={(props) => <EditPost />} />
                    {/* <AuthGuardedRoute path="/likedPosts" render={(props) => <LikedPosts/>} /> */}
                    <AuthGuardedRoute path="/userPosts/:id" render={(props) => <UserPosts/>} />
                    {/* <AuthGuardedRoute exact path="/members" render={(props) => <MemberList/>} /> */}
                    <Route path="/members/:id" render={(props) => <MemberDetails />} />
                    <AuthGuardedRoute path="/member/edit" render={(props) => <MemberEdit/>} />
                    <AuthGuardedRoute path="/messages" render={(props) => <Messages/>} />            
                    <AuthGuardedRoute path="/lists" render={(props) => <Lists/>} />
                    <AuthGuardedRoute path="/createPost" render={(props) => <CreatePost/>} />

                    <Redirect to="/home" />
                </Switch>
                {/* <Footer/> */}
   
                {/* <div className="container">
                    <h1 className="my-4">Dating App</h1>

                    <RenderValues
                        values={this.props.values.values}
                        isLoading={this.props.values.isLoading}
                        errMess={this.props.values.errMess}
                    />     
                </div> */}
                <Modal
                    show={this.state.modal.show}
                    onHide={this.hideModal}
                    animation={true}
                    backdrop={'static'}
                    centered
                    scrollable={true}
                >
                    {/* <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
                    </Modal.Title>
                    </Modal.Header> */}
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
                    {/* <Modal.Footer>
                    <Button onClick={() => this.setState({ showLoginModal: false })}>Close</Button>
                    </Modal.Footer> */}
                </Modal>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));