import { Component } from "react"
import { TiTick } from "react-icons/ti"
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import { Redirect } from "react-router-dom"

import './index.css'
import { Switch } from "react-router-dom/cjs/react-router-dom.min"

const statusConstant = {
    signup: 'SIGN',
    inProgress: 'INPROGRESS',
    success: 'SUCCESS'
}

class SignUp extends Component {
   state = {
    userName: '',
    password: '',
    errorMsg: '',
    userCreated: false,
    viewStatus: statusConstant.signup
   }

   goLogin = () => {
    const {history} = this.props
    history.replace('/login')
   }

   submitSignupForm = async event => {
    event.preventDefault()
    this.setState({viewStatus: statusConstant.inProgress})
    const {userName, password} = this.state
    if(userName === '' || password === ''){
        this.setState({errorMsg: "*Invalid Inputs", viewStatus: statusConstant.signup})
    }
    else {
        this.setState({viewStatus: statusConstant.inProgress})
        const userDetails = {
            userName,
            password
        }
        const response = await fetch('http://localhost:9999/createuser', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        })
        const responseData = await response.json()
        if(responseData.error_msg){
            this.setState({errorMsg: responseData.error_msg, viewStatus: statusConstant.signup})
        }
        else {
            this.setState({errorMsg: '', userName: '', password:'', viewStatus: statusConstant.success})
            console.log(responseData.success)
        }
    }
   }

   updateUserName = event => {
    this.setState({userName: event.target.value})
   }

   updatePassword = event => {
    this.setState({password: event.target.value})
   }

   renderCreateUserNameField = () => {
    const {userName} = this.state
    return (
        <div className="input-container">
            <label className="input-label">Enter User Name</label>
            <input value={userName} onChange={this.updateUserName} type="text" className="input-box" placeholder="user_name"/>
        </div>
    )
   }

   renderCreatePasswordField = () => {
    const {errorMsg, password} = this.state
    return (
        <div className="input-container">
            <label className="input-label">Enter Password</label>
            <input value={password} onChange={this.updatePassword} type="password" className="input-box" placeholder="password"/>
            <p className="error-msg">{errorMsg}</p>
        </div>
    )
}


   renderSignUpView = () => {
    return (
        <div className="sign-up-container">
            <h1 className="sign-up-quote">The Journey of a thousand miles begins with one step</h1>
            <p className="sign-up-text">so, just create a account, and battle with yourself</p>
            <form className="login-form" onSubmit={this.submitSignupForm}>
                <h1 className="sign-up">Sign Up</h1>
                {this.renderCreateUserNameField()}
                {this.renderCreatePasswordField()}
                <button className="sign-up-btn" type="submit">Create</button>
            </form>
        </div>
    )
   }
   
   renderSuccessView = () => {
    return (
        <div className="sign-up-container">
        <div className="login-form">
            <div className="success-bg"><TiTick className="tick"/></div>
            <h1 className="sucess-heading">User Created SuccessFully</h1>
            <button type="button" className="sign-up-btn" onClick={this.goLogin}>Login</button>
        </div>
        </div>
    )
   }

   renderLoaderView = () => {
    return (
        <div className="sign-up-container">
            <Loader type="TailSpin" height={80} width={80} color="#306caf"/>
        </div>
    )
   }

    render() {
        const jwtToken = Cookies.get('jwtToken')
        if(jwtToken !== undefined){
            return <Redirect to="/"/>
        }
        const {viewStatus} = this.state
        switch(viewStatus) {
            case statusConstant.signup :
                return this.renderSignUpView()
            case statusConstant.inProgress :
                return this.renderLoaderView()
            case statusConstant.success : 
                 return this.renderSuccessView()
            default :
                 return null
        }
    }
}

export default SignUp