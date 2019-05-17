import React, { Component } from 'react';
import { postCategoryOptions } from "../shared/global";


const styles = {
    jumbotron: {
      backgroundImage: `url(https://content-static.upwork.com/blog/uploads/sites/3/2019/04/03142133/How-Do-You-Hire-a-Programmer-feature-960x400.png)`,

      
    },
    container: {
        
        // position: "fixed",
        
        // height:"100%",
        // width:"100%"
    },
      
    center: {
        margin: "0",
        position: "absolute",
        top: "50%",
        left: "50%",
        msTransform: "translate(-50%, -50%)",
        transform: "translate(-50%, -50%)"
    }
  }

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            registerMode: false
        };

        this.registerToggle = this.registerToggle.bind(this);
        this.cancelRegisterMode = this.cancelRegisterMode.bind(this);
    }

    registerToggle(){
        this.setState({
            registerMode: true 
        });
    }

    cancelRegisterMode(){
        console.log('HomeComponent.cancelRegisterMode');
        this.setState({
            registerMode: false 
        });
    }

    render(){
        console.log('registerMode: '+this.state.registerMode);

        return (
            <div className="" style={styles.container}>
  
                <div className="" style={styles.center}>
                    <h1 className="" >Best CS Study</h1>
                    <p >Knowledge is infinite while time is limited. Here you can find the most efficient way to learn your desired skillset.</p>
                    {/* <p >
                        <a href="#" className="btn btn-lg btn-secondary">Learn more</a>
                    </p> */}
                    <form >
                        <div className="input-group">
                            <input className="form-control input-sm" type="text" placeholder="Web Development"
                                name="content"
                            
                            />
                       
                            <div className="input-group-append">
                                <select className="form-control" style={{borderRadius:'0'}}>
                                    {
                                        postCategoryOptions.map(category=>{
                                            return (
                                                <option key={category.value} value={category.value}>
                                                    { category.display }
                                                </option>
                                            );
                                        })
                                    }
                                </select>   
                                <button type="submit" className="btn btn-primary" >Search</button>
                            </div>
                        </div>
                    </form>
                  
                </div>
       
                {/* <div className="jumbotron jumbotron-fluid" style={styles.jumbotron}>
                    <div className="container text-left" >
                        <h1 className="display-4 text-white">Best CS Study</h1>
                        <p className="lead text-white">Knowledge is infinite while time is limited. Here you can find the most efficient way to learn your desired skillset.</p>
                       
                    </div>
                </div>
                <div className="container">
                {
                    !this.state.registerMode?
                    <div style={{textAlign: 'center'}}>
                        <h1>Find your match</h1>
                        <p className="lead">Come on in to view your matches... All you need to do is sign up!</p>
                        <div className="text-center">
                            <button className="btn btn-primary btn-lg mr-2" onClick={this.registerToggle}>Register</button>
                            <button className="btn btn-info btn-lg">Learn more</button>
                        </div>
                    </div>
                    :
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-4">
                                <Register 
                                    cancelRegister={this.cancelRegisterMode}
                                />
                            </div>
                        </div>
                    </div>
                }
                </div> */}
            </div>
        );
    }
  
};

export default Home;