import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signupUser } from '../redux/ActionCreators';
import { Loading } from './LoadingComponent';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Lists from './ListsComponent';
import MemberList from './member/MemberListComponent';
import MemberDetails from './member/MemberDetailsComponent';
import MemberEdit from './member/MemberEditComponent';
import Messages from './MessagesComponent';
import CreatePost from './CreatePostComponent';
import Posts from './PostsComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
// import { Modal } from 'react-bootstrap';
// import Register from './RegisterComponent';
// import Login from './LoginComponent';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
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
     
       
        // this.state = {
        //     modal: {
        //         show: false,
        //         type: ''
        //     }
           
        // };
        // this.showModal = this.showModal.bind(this);
        // this.hideModal = this.hideModal.bind(this);
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

                    <Route exact path="/posts" render={(props) => <Posts/>} />
                    <AuthGuardedRoute exact path="/members" render={(props) => <MemberList/>} />
                    <AuthGuardedRoute path="/members/:id" render={(props) => <MemberDetails />} />
                    <AuthGuardedRoute path="/member/edit" render={(props) => <MemberEdit/>} />
                    <AuthGuardedRoute path="/messages" render={(props) => <Messages/>} />            
                    <AuthGuardedRoute path="/lists" render={(props) => <Lists/>} />
                    <AuthGuardedRoute path="/createPost" render={(props) => <CreatePost/>} />

                    <Redirect to="/home" />
                </Switch>
                
   
                {/* <div className="container">
                    <h1 className="my-4">Dating App</h1>

                    <RenderValues
                        values={this.props.values.values}
                        isLoading={this.props.values.isLoading}
                        errMess={this.props.values.errMess}
                    />     
                </div> */}
              
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));