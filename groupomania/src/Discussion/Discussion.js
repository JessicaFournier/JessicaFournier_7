import React, { Component } from 'react'
import './Discussion.css'
import { Link, useParams } from 'react-router-dom'
import Message from '../Message/Message.js'
import Menu from '../Menu/Menu.js'

class Discussion extends Component {
    constructor(props){
      super(props);
      this.state = { 
        value:'',
        discussions: [] 
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      fetch('http://localhost:5000/api/discussion', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
      })
      .then(response => response.json())     
      .then(json => this.setState({discussions : json}));
    } 

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(e) {
      let objetPost = {
        title: this.state.value,
      }
      console.log(objetPost);
      e.preventDefault();
      fetch('http://localhost:5000/api/discussion', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(objetPost)
        }).then(function(response) {
            return response.json();
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

  render() {
    return (
        <div className="Page-bloc">
            <Menu/>
            <div>
              <h2>Les discussions en cours</h2>
              <div className="Discussion-bloc">
                  <div className="Discussion-text">
                      {this.state.discussions.map(discussion => (
                        <Link className="Discussion-link" to={"/Discussion/" + discussion.id + '/' }>{discussion.title}</Link>
                      ))}
                      <div className="Discussion-create-bloc">
                        <p className="Discussion-create-title">Créer une nouvelle discussion</p>
                        <form className="Create-discussion" onSubmit={this.handleSubmit}>
                          <label className="Create-label" for="title">Titre de la discussion : </label>
                          <input className="Create-input" type="text" id="title" value={this.state.value} onChange={this.handleChange}/>
                          <input className="Inscription-input Submit-form" type="submit" value="Envoyer"/>
                        </form>
                      </div>
                  </div>
              </div>
            </div>
        </div>
    );
  }
}

export default Discussion;