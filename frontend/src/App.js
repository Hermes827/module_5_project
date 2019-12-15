import React from 'react';
import Login from './components/login';
import Banner from './components/Banner'
import NewUserForm from './components/NewUserForm'
import { Route } from 'react-router-dom';
import {withRouter} from 'react-router';
import Dashboard from './containers/Dashboard'
import EditUserContainer from './containers/EditUserContainer'
import './App.css';
import UserCryptosContainer from './containers/UserCryptosContainer'
import UserCryptoDetailedView from './components/UserCryptoDetailedView'
import NewsContainer from './containers/newsContainer'
import ArticleView from './components/articleView'
import {NEWS_API} from './constants'
import {USER_URL} from './constants'
import {LOGIN_URL} from './constants'
import {PROFILE} from './constants'

class App extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      current_user: {},
      error: "",
      feedback: "",
      userCryptos: [],
      // hasClickedMyCryptos: false,
      currentCrypto: {},
      lookingAtSingleCrypto: false,
      cryptosAreLoading: false,
      news: [],
      currentNewsArticle: {},
      lookingAtSingleNewsArticle: false,
      hasClickedSettings: false
    }

    this.createNewUser = this.createNewUser.bind(this)
    this.attemptLogin = this.attemptLogin.bind(this)
    this.setActiveUser = this.setActiveUser.bind(this)
    this.logout = this.logout.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    // this.toggleMyCryptos = this.toggleMyCryptos.bind(this)
    this.setError = this.setError.bind(this)
    this.setFeedback = this.setFeedback.bind(this)


    this.renewState();
  }

  setFeedback(str){
    this.setState({
      feedback: str
    })
    setTimeout(() => this.setState({feedback: ""}), 1500)
  }

  setError(str){
    this.setState({
      error: str
    })
    setTimeout(() => this.setState({error: ""}), 1500)
  }

  createNewUser(user){
    fetch(USER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({user})
    })
    .then(res => res.json())
    .then(data => {
      this.setActiveUser(data)
      this.props.history.push('/dashboard')
    })
  }

  attemptLogin(user){
    fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({user})
    })
    .then(res => res.json())
    .then(data => {
      this.setActiveUser(data)
      if(!data.message){
        this.props.history.push('/dashboard')
      }
    })
  }

  setActiveUser(data, mode="hard"){
    if(data.message && mode === "soft"){
      return
    } else if(data.message){
      this.setState({error: data.message})
    } else {
      this.setState({
        current_user: data.user,
        error: ""
      })
      if(data.jwt){localStorage.token = data.jwt}
    }
  }

  logout(){
    this.setState({
      current_user: {},
      // hasClickedMyCryptos: false,
      currentCrypto: {},
      lookingAtSingleCrypto: false
    })
    delete localStorage.token
    this.props.history.push('/login')
  }

  renewState(){
  if(!localStorage.token){return}
  fetch("http://localhost:3000/api/v1/profile", {
    method: "GET",
    headers: {
      'Authorization': "Bearer " + localStorage.token
    }
  })
  .then(res => res.json())
  .then(data => this.setActiveUser(data, "soft"))
}

///////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////

  updateUser(user){
    fetch(USER_URL + `/${user.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.token,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setActiveUser(data)
      this.props.history.push('/dashboard')
    })
  }

  deleteUser(id){
    fetch(USER_URL + `/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': "Bearer " + localStorage.token
      }
    })
    .then( () => this.logout())
  }

  ////////////////////////////////////////////////////////////////////////////

  // Usercrypto

  displayUserCryptos = () => {
    if(!localStorage.token){return}
    fetch("http://localhost:3000/api/v1/profile", {
      method: "GET",
      headers: {
        'Authorization': "Bearer " + localStorage.token,
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        userCryptos: data.user.cryptos,
        // hasClickedMyCryptos: !this.state.hasClickedMyCryptos,
        cryptosAreLoading: false
      })
    })
  }


  // toggleMyCryptos() {
  //   this.setState({
  //     // hasClickedMyCryptos: !this.state.hasClickedMyCryptos
  //   })
  // }

  setCurrentCrypto = (crypto) => {
    this.setState({
      currentCrypto: crypto,
      lookingAtSingleCrypto: true
    })
    this.props.history.push('/my-crypto/' + crypto.id)
  }

  setCurrentCrypto1 = (crypto) => {
    this.setState({
      currentCrypto: crypto,
      lookingAtSingleCrypto: true
    })
    // this.props.history.push('/my-crypto/' + crypto.id)
  }

  // renderUserCryptos = () => {
  //   const {userCryptos} = this.state
  //   if(this.state.hasClickedMyCryptos === true && !this.state.cryptosAreLoading) {
  //     return <UserCryptosContainer
  //             returnHome={this.returnHome}
  //             toggleCryptos={this.toggleMyCryptos}
  //             userCryptos={userCryptos}
  //             setCurrentCrypto={this.setCurrentCrypto}
  //             />
  //   }
  // }

  countCrypto = (cc) => {
    const cryptos = []
    this.state.userCryptos.map((crypto) => {
      if(cc.name === crypto.name) {
        cryptos.push(crypto)
        console.log(crypto)
      }
    })
    return cryptos.length
  }


  renderDetailedUserCryptoView = () => {
    const {userCryptos, currentCrypto, lookingAtSingleCrypto} = this.state
    if(lookingAtSingleCrypto === true) {
      return(
        <div>
              <UserCryptoDetailedView
              countCrypto={this.countCrypto}
              currentCrypto={currentCrypto}
              returnToUserCryptosContainer={this.returnToUserCryptosContainer}
              deleteCrypto={this.deleteCrypto}
              error={this.state.error}
              />
        </div>
          )
    }
  }

  // <UserCryptosContainer
  // returnHome={this.returnHome}
  // toggleCryptos={this.toggleMyCryptos}
  // userCryptos={userCryptos}
  // setCurrentCrypto={this.setCurrentCrypto}
  // />

  returnToUserCryptosContainer = () => {
    this.setState({
      currentCrypto: null,
      lookingAtSingleCrypto: false,
      // hasClickedMyCryptos: true
    })
  }

  // returnMainMenu = () => {
  //   this.setState({
  //     // hasClickedMyCryptos: false,
  //     lookingAtSingleCrypto: false
  //   })
  //   this.props.history.push('/dashboard')
  // }

  returnHome = () => {
    this.setState({
      // cryptosAreLoading: true,
      currentCrypto: null,
      lookingAtSingleCrypto: false,
      // hasClickedMyCryptos: true
    })
    this.props.history.push('/dashboard')
  }


  deleteCrypto = (crypto) => {
    fetch("http://localhost:3000/api/v1/remove_crypto/"+ crypto.id, {
      method: "DELETE",
      headers: {
        'Authorization': "Bearer " + localStorage.token
      },
      body: JSON.stringify({crypto_id: crypto.id})
    })
    .then(res => res.json())
    .then(data => {
      let cryptoNames = data.user.cryptos.map((crypto) => {
        return crypto.name
      })
      if(!cryptoNames.includes(crypto.name)){
        setTimeout(() => this.setState({
          currentCrypto: null,
          lookingAtSingleCrypto: false,
        }), 2000)
      }
      this.setError(`Deleted ${crypto.name} from Cryptos`)
      this.displayUserCryptos()
    })
  }

//  news

getNews = () => {
  fetch(NEWS_API)
    .then(res => res.json())
    .then(data => {
      this.setState({
        news: data.articles
      })
    })
}

setCurrentNewsArticle = (article) => {
  this.setState({
    currentNewsArticle: article,
    lookingAtSingleNewsArticle: true
  })
}

renderDetailedNewsView = () => {
const {currentNewsArticle, lookingAtSingleNewsArticle} = this.state
if(lookingAtSingleNewsArticle === true) {
    return (
          <ArticleView
          currentNewsArticle={currentNewsArticle}
          returnToNewsContainer={this.returnToNewsContainer}
          />
        )
  }
}

returnToNewsContainer = () => {
  this.setState({
    currentNewsArticle: null,
    lookingAtSingleNewsArticle: false
  })
}

returnToHomepageFromNewsContainer = () => {
  this.setState({
    currentNewsArticle: null,
    lookingAtSingleNewsArticle: false
  })
  this.props.history.push('/dashboard')
}
///////////////////////////////////////////////////////////////////////////////

renderEditUser = () => {
if(this.state.hasClickedSettings === true) {
  return <EditUserContainer
            current_user={this.state.current_user}
            updateUser={this.updateUser}
            deleteUser={this.deleteUser}
            setEdit={this.setEdit}
          />
}
}

setEdit = () => {
  console.log("hello")
  this.setState({
    hasClickedSettings: !this.state.hasClickedSettings
  })
  this.props.history.push('/dashboard')

}

/////////////////////////////////////////////////////////////////////////////////

  render(){

    return (
      <div className="App">
        <Route path='/' render={() => <Banner
                                          current_user={this.state.current_user}
                                          logout={this.logout}
                                          displayUserCryptos={this.displayUserCryptos}
                                          getNews={this.getNews}
                                          setEdit={this.setEdit}
                                      />}/>

          <Route exact path="/news" render={() => <NewsContainer
                                                      returnToHomepageFromNewsContainer={this.returnToHomepageFromNewsContainer}
                                                      setCurrentNewsArticle={this.setCurrentNewsArticle}
                                                      news={this.state.news}
                                                      currentNewsArticle={this.state.currentNewsArticle}
                                                      lookingAtSingleNewsArticle={this.state.lookingAtSingleNewsArticle}
                                                  />}/>
                                                {this.renderDetailedNewsView()}
          <Route exact path="/login" render={() => <Login attemptLogin={this.attemptLogin}/>}/>
          <Route exact path="/user_signup" render={() => <NewUserForm createNewUser={this.createNewUser}/>}/>
          <Route path='/my-crypto' render={() => <UserCryptosContainer
                                                      returnHome={this.returnHome}

                                                      userCryptos={this.state.userCryptos}
                                                      setCurrentCrypto={this.setCurrentCrypto}
                                                      />}/>
                                                      {this.renderDetailedUserCryptoView()}
          <Route exact path="/dashboard" render={() =>  <Dashboard
                                                         setFeedback={this.setFeedback}
                                                         feedback={this.state.feedback}
                                                         />}
                                                         />
                                                       <Route exact path="/update_profile" render={() => this.renderEditUser()}/>

      </div>
    );
  }
}

export default withRouter(App);
