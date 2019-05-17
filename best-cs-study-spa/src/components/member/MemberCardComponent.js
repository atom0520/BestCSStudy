import React, { Component } from 'react'
import styles from './MemberCardComponent.module.scss';
import { Link } from 'react-router-dom';
import ImgUser from '../../shared/img/user.png';
// import { connect } from 'react-redux';
// import { sendLike } from '../../redux/ActionCreators';

// const mapDispatchToProps = dispatch => ({
//     sendLike: (id, recipientId, onSuccess, onError) => { dispatch(sendLike(id, recipientId, onSuccess, onError)); }
// });

class MemberCard extends Component {
    constructor(props) {
        super(props);
       
    }

    handleClickLikeButton(){

    }

    render() { 
        return(
            <div className={"card mb-4 "+styles.card}>
                <div className={styles.cardImgWrapper}>
                    <img className="card-img-top" src={this.props.user.photoUrl || ImgUser} alt={this.props.user.knownAs}/>
                    <ul className={"list-inline text-center " + styles.memberIcons + " " + styles.animate}>
                    
                        <li className="list-inline-item">
                            <Link to={`/members/${this.props.user.id}`}><button className="btn btn-primary"><i className="fa fa-user"></i></button></Link>
                        </li>
                        <li className="list-inline-item">
                            <button className="btn btn-primary"
                                onClick={this.props.handleClickLikeButton}
                            ><i className="fa fa-heart"></i>
                            </button>
                        </li>
                        <li className="list-inline-item">
                            <Link to={`/members/${this.props.user.id}?tab=messages`}><button className="btn btn-primary"><i className="fa fa-envelope"></i></button></Link>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-1">
                    <h6 className="card-title text-center mb-1">
                        <i className="fa fa-user"></i> {this.props.user.knownAs}, {this.props.user.age}
                    </h6>
                    <p className="card-text text-muted text-center">{this.props.user.city}</p>
                </div>
            </div>
        )
    }
}

export default MemberCard;
// export default connect(null, mapDispatchToProps)(MemberCard);