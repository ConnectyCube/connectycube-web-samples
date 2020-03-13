import React, { Component } from 'react'
import AuthService from '../../services/auth-service'
import logo from '../../assets/logo_with_text.png'
import swal from 'sweetalert'
import './auth.css'
import Loader from '../../helpers/loader/loader'
import { Redirect } from "react-router-dom"


export default class Auth extends Component {
  state = {
    isLogin: true,
    isLoader: false,
    login: '',
    password: '',
    isAuthorization: false
  }

  handleStateModal = () => {
    return this.setState(
      { isLogin: !this.state.isLogin }
    )
  }

  changeLogin = (event) => (this.setState({ login: event.target.value }))

  changePassword = (event) => (this.setState({ password: event.target.value }))

  login = (e) => {
    e.preventDefault()
    const { login, password, isLogin } = this.state
    const dataUser = { login, password }

    if (!login.trim() || !password.trim()) {
      const endMessage = isLogin ? 'login.' : 'sign up'
      swal('Warning', `Fill the fields to ${endMessage}`)
      return
    }

    this.setState({ isLoader: true })

    if (isLogin) {
      AuthService.signIn(dataUser)
        .then(() => {
          this.setState({ isLoader: false, isAuthorization: true })
        })
        .catch(error => {
          this.setState({ isLoader: false })
          swal(`Error.\n\n${JSON.stringify(error)}`, "", "error")
        })
    } else {
      AuthService.signUp(dataUser)
        .then(() => {
          this.setState({ isLoader: false, isAuthorization: true })
          swal("Account successfully registered!", "", "success")
        })
        .catch(error => {
          this.setState({ isLoader: false })
          swal(`Error.\n\n${JSON.stringify(error)}`, "", "error")
        }
        )
    }

  }

  render() {
    const { isLogin, login, password, isLoader, isAuthorization } = this.state
    const authText = isLogin ? "Don't have an account?" : 'Already have an account?'
    const authLink = isLogin ? 'Sign up' : 'Sign in'

    return (
      <div className="auth-main-сontainer" style={this.props.isSmallDevice && { backgroundColor: '#27ae60' }}>
        <div className="auth-modal-container">
          {isLoader &&
            <div className="auth-wrapp-loader">
              <Loader />
            </div>
          }
          {isAuthorization &&
            <Redirect to="/home" />
          }
          <div className="auth-logo">
            <img src={logo} alt="Logo" />
          </div>
          <form onSubmit={this.login} className="auth-form auth-wrapper">
            <input
              type="text"
              value={login}
              onChange={this.changeLogin}
              required
              placeholder="Login"
              name="login" />
            <input
              type="password"
              value={password}
              onChange={this.changePassword}
              required
              placeholder="Password"
              name="Password" />
            <button type="submit" value="Submit">{isLogin ? 'Log in' : 'Sign up'}</button>
          </form>
          <div className="auth-footer">
            <span>{authText}</span>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={this.handleStateModal}>{authLink}</a>
          </div>
        </div>
      </div >
    )
  }
}

