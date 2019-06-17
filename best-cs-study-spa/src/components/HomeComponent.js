import React, { Component } from 'react';
import { postCategoryOptions, defaultTags } from "../shared/global";
import styles from "./HomeComponent.module.scss";
import { withRouter } from 'react-router-dom';
import { fetchTags } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { alertifyService } from '../services/AlertifyService';

const mapStateToProps = state => {
    return {
    
    }
}

const mapDispatchToProps = dispatch => ({
    fetchTags: (tagParams, onSuccess, onError) => { dispatch(fetchTags(tagParams, onSuccess, onError)) }
});


class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            postParams:{
                category: "",
                search: ""
            },

            trendingTags:defaultTags
        };

        this.onClickTagButton = this.onClickTagButton.bind(this);
        this.handleInputChangePostParamsForm = this.handleInputChangePostParamsForm.bind(this);

        this.handleSubmitPostParamsForm = this.handleSubmitPostParamsForm.bind(this);
    }

    // registerToggle(){
    //     this.setState({
    //         registerMode: true 
    //     });
    // }

    // cancelRegisterMode(){
    //     console.log('HomeComponent.cancelRegisterMode');
    //     this.setState({
    //         registerMode: false 
    //     });
    // }
    componentDidMount(){
        setTimeout(this.props.fetchTags(
            {
                orderBy:"count",
                maxReturnNumber: 20,
                minCount: 2
            },
            (tags)=>{                    
                alertifyService.success('Fetched trending tags successfully!'); 
                console.log(tags);
                tags = tags.map(tag=>{ return tag.value});

                let trendingTags = this.state.trendingTags;
                for(let i=0; i<tags.length; i++){
                    let tag = tags[i];
                    if(trendingTags.indexOf(tag)==-1){
                        trendingTags.push(tag);

                        if(trendingTags.length>=20){
                            break;
                        }
                    }
                }

                this.setState({
                    trendingTags: trendingTags
                });
            },
            (error)=>{

                alertifyService.error(error.message);
            }
        ),1);
    }

    handleInputChangePostParamsForm(event){

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            postParams: {...this.state.postParams, 
                [name]: value
            }
        });
    }

    onClickTagButton(tag){
        console.log('HomeComponent.onClickTagButton', tag);
        this.props.history.push({
            pathname:'/search',
            state:{
                search: tag
            } 
        });
    }

    handleSubmitPostParamsForm(event){
        event.preventDefault();
        this.props.history.push({
            pathname:'/search',
            state:{
                search: this.state.postParams.search,
                category: this.state.postParams.category
            } 
        });
    }

    render(){
        console.log('registerMode: '+this.state.registerMode);

        return (
            <div className={styles.background}>
         
            <div className={styles.center} >
         
                <div className="container" >
                {/* <div className={"jumbotron jumbotron-fluid "+styles.jumbotron}>
                    <div className="container text-left" >
                        <h1 className="display-4 text-white">Best CS Study</h1>
                        <p className="lead text-white">Knowledge is infinite while time is limited. Here you can find the most efficient way to learn your desired skillset.</p>
                       
                    </div>
                </div> */}
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="px-2">
                                <h1 className="" >Best CS Study</h1>
                                <p >Knowledge is infinite while time is limited. Here you can find the most efficient way to learn your desired skillset.</p>
                             
                                <form noValidate>
                                    <div className="input-group">
                                        <input className="form-control input-sm" type="text" placeholder="Web Development"
                                            name="search"
                                            value={this.state.postParams.search}
                                            onChange={this.handleInputChangePostParamsForm}
                                        />
                                
                                        <div className="input-group-append">
                                            <select className="form-control" style={{borderRadius:'0'}}
                                                name="category"
                                                value={this.state.postParams.category}
                                                onChange={this.handleInputChangePostParamsForm}
                                            >
                                                <option key={"all"} value={""}>
                                                    { "All" }
                                                </option>
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
                                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmitPostParamsForm}>Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-10 offset-lg-1">
                            <div className="px-2">
                                <hr className="mt-5 mb-5"></hr>
                                <h3 >Popular Topics</h3>
                                <div className="row" >
                                    {
                                        this.state.trendingTags.map((tag,index)=>{
                                            return (
                                                <div key={index} className="col-4 col-lg-3 px-1 py-1">
                                                    <button className="btn btn-outline-primary btn-block"
                                                        onClick={(e)=>{this.onClickTagButton(tag);}}
                                                    >{tag}</button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                     
                    </div>
                </div>
            
              
              
            </div>
            </div>
        );
    }
  
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));