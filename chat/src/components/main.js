import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom"
import ChatService from '../services/chat-service'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import store from '../store'
import AuthService from '../services/auth-service'
import Auth from './auth/auth'
import Home from './home/home'
import Loader from '../helpers/loader/loader'


export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      routName: false,
      isLoader: true
    }
    this.initUser()
  }

  initUser = async () => {
    const routLink = await AuthService.init()
    this.setState({ routName: routLink, isLoader: false })
  }

  render() {
    const { routName, isLoader } = this.state
    return (

      <Router>
        <Provider store={store}>
          {isLoader ?
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
              <Loader />
            </div>
            : <>
              <Route path="/home" component={Home} />
              <Route path="/auth" component={Auth} />
              <Redirect to={routName} />
            </>
          }
        </Provider>
      </Router>
    )
  }
}