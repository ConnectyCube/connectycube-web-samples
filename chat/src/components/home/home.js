import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Route, Redirect, BrowserRouter as Router } from "react-router-dom"
import ChatService from '../../services/chat-service'
import SideBar from './sideBar/sideBar'
import Chat from './chat/chat'
import SplashPage from './splashPage/splashPage'
import CreateDialog from './createDialog/createDialog'
import Auth from '../auth/auth'
import './home.css'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      routName: false,
      routerUrl: props.match.url
    }
    props.history.replace("/home")
    this.windowWidth = window.innerWidth
  }

  componentDidMount() {
    ChatService.setUpListeners()
  }

  changeRouter = (router) => {
    this.setState({ routerUrl: router })
  }

  render() {
    const { routerUrl } = this.state
    const { match } = this.props

    return (
      <div className="home-frame">
        <div className="home-active-container">
          {this.windowWidth >= 768 ?
            <Row className="default-row">
              <Col sm={12} md={5} lg={5} xl={3} className="default-grid">
                <SideBar router={this.changeRouter} />
              </Col>
              <Col sm={12} md={7} lg={7} xl={9} className="default-grid">
                <Router>
                  <Route
                    exact
                    path={`${match.url}`}
                    component={SplashPage}
                  />
                  <Route
                    path={`${match.url}/create-dialog`}
                    component={() => <CreateDialog router={this.changeRouter} />}
                  />
                  <Route
                    path={`${match.url}/chat`}
                    component={() => <Chat router={this.changeRouter} />}
                  />
                  <Redirect to={routerUrl} />
                </Router>
              </Col>
            </Row> :

            <Row>
              <Col sm={12} md={5} lg={5} xl={3} className="default-grid">
                <Router>
                  <Route
                    exact
                    path={`${match.url}`}
                    component={() => <SideBar router={this.changeRouter} />}
                  />
                  <Route
                    path={`${match.url}/create-dialog`}
                    component={() => <CreateDialog router={this.changeRouter} />}
                  />
                  <Route
                    path={`${match.url}/chat`}
                    component={() => <Chat router={this.changeRouter} />}
                  />
                  <Route
                    path={`/auth`}
                    component={() => <Auth isSmallDevice />}
                  />
                  <Redirect to={routerUrl} />
                </Router>
              </Col>
            </Row>
          }
        </div>
      </div>
    )
  }
}

