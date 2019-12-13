import React, { Component } from 'react'
import Article from '../components/article'

class NewsContainer extends Component {


// constructor(){
//   props()
//   this.state = {
//     news: []
//   }
// }
//


  render(){
    return (
      <div className="articles">
      <h1 className="ccHeader">News Stories</h1>
      <button className="CCbutton" onClick={this.props.returnToHomepageFromNewsContainer}>Return to homepage</button>
        <div>

        {
          this.props.news.map((article)=> {
            return <Article
                    className="article"
                    article={article}

                    setCurrentNewsArticle={this.props.setCurrentNewsArticle}
                    />
          })
        }

        </div>

      </div>
    )
  }
}

export default NewsContainer
