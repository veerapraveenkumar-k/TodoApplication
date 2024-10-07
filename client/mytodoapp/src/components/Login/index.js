import { Component } from "react"
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
   state = {
    userName: '',
    password: '',
    errorMsg: '',
   }

   submitLoginForm = async event => {
      event.preventDefault()
      const {userName, password, errorMsg} = this.state
      if(userName === '' || password === ''){
        this.setState({errorMsg: "*Invalid Inputs"})
      }
      else {
        const userDetails = {
            userName,
            password
        }
        const response = await fetch('http://localhost:9999/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        })
        const responseData = await response.json()
        if(responseData.error_msg){
            this.setState({errorMsg: responseData.error_msg})
        } else {
            this.setState({userName: '', password: '', errorMsg: ''})
            Cookies.set('jwtToken', responseData.jwt_token, {expires: 30})
        }
      }
   }

   updateUserName = event => {
    this.setState({userName: event.target.value})
   }

   updatePassword = event => {
    this.setState({password: event.target.value})
   }

    renderUserNameField = () => {
        const {userName} = this.state
        return (
            <div className="input-container">
                <label className="input-label">Enter User Name</label>
                <input value={userName} onChange={this.updateUserName} type="text" className="input-box" placeholder="user_name"/>
            </div>
        )
    }

    renderPasswordField = () => {
        const {password, errorMsg} = this.state
        return (
            <div className="input-container">
                <label className="input-label">Enter Password</label>
                <input value={password} onChange={this.updatePassword} type="password" className="input-box" placeholder="password"/>
                <p className="error-msg">{errorMsg}</p>
            </div>
        )
    }

    render() {
        const jwtToken = Cookies.get('jwtToken')
        if(jwtToken !== undefined){
            return <Redirect to="/"/>
        }
        return (
            <div className="login-container">
                <nav className="header-container">
                    <h1 className="logo">MyTodo</h1>
                    <Link to="/signup" className="link-style"><button className="sign-up-btn">Sign Up</button></Link> 
                </nav>
                <div className="login-form-container">
                    <h1 className="welcome-text">Welcome to MyTodo App !!!</h1>
                    <form className="login-form" onSubmit={this.submitLoginForm}>
                        {this.renderUserNameField()}
                        {this.renderPasswordField()}
                        <button className="sign-up-btn" type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login