import React, { Component } from "react";
import "../styles/main.css";
import firebase from "firebase";
import axios from "axios";
import { API } from "../backend";
import { NavLink, Redirect } from "react-router-dom";
import {message} from "antd";

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser: "",
            user: "",
            docs: []
        }
    }

    componentDidMount = () => {
        this.setState({
            currentUser: firebase.auth().currentUser
        })
        axios.post(`${API}/getdocs`)
        .then((response) => {
            console.log(response.data)
            this.setState({
                docs: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentWillMount = () => {
        axios.post(`${API}/getuser`, {
            userkey: firebase.auth().currentUser.uid
        })
        .then((response) => {
            console.log(response)
            this.setState({
                user: response.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    upvoteUser = (key) => {
        axios.put(`${API}/upvoteuser`, {
            userkey: key.userkey
        })
        .then((response) => {
            console.log(response)
            message.success(`You just upvoted ${key.developer}!`)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    readMore = (key) => {
        console.log("Routing!")
    }

    render(){
        return (
            <div className="main container">
                <div className="row">
                    <div className="column right">
                        <img className="profile-image" src={this.state.currentUser.photoURL} />
                        <h5 className="pt-3">👋 Hi, {this.state.currentUser.displayName}! ({this.state.currentUser.email} ✉️)</h5>
                        <p>You got <span className="font-weight-bold">{this.state.user.upvote} upvotes</span> 😀 by some awesome devs.</p>
                        <div className="pt-3">
                        <button className="write-btn"><NavLink className="text-dark" to="/write">Write 🖊️</NavLink></button>
                        <button className="out-btn" onClick={() => firebase.auth().signOut()}>Log Out 😱</button>
                        </div>
                        <div className="pt-3" style={{listStyleType: "none"}}> 
                            <li>💬 Telegram</li>
                            <li>📱 Instagram</li>
                            <li>📺 Youtube</li>
                            <li>🎙️ Podcast</li>                 
                        </div>
                    </div>
                    <div className="column left">
                    <h2 className="posts">POSTS</h2>
                    {this.state.docs.map((item, index) => {
                        return (
                            <div className="">
                                <img src={item.image} width="200" className="pt-3" alt="" />
                                <h5>{item.title}</h5>
                                <p><NavLink to={"/doc/" + item.dockey}>🔖 READ</NavLink></p>
                                {/* <p><a className="font-weight-bold" onClick={() => this.readMore(item.dockey)}>🔖 Read</a></p> */}
                                <p><a className="font-weight-bold" onClick={() => this.upvoteUser(item)}>💚 UPVOTE</a></p>
                                <p>{item.developer}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }
};

export default Main;