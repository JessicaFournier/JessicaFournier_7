import React, { Component } from 'react'
import './Message.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'
import Menu from '../Menu/Menu.js'
import Moment from 'react-moment';

class Message extends Component {
    constructor(props){
      super(props);
      this.state = { 
        message:'',
        messages: [],
        messageId: '',
        discussion:{'title': null},
        showCommentEntry: false,
        showComment: false,
        commentaire:'',
        comments: [],
        name:'',
        firstName:'',
        selectedFile: null
      };
      
      this.handleMessageChange = this.handleMessageChange.bind(this);
      this.handleCommentChange = this.handleCommentChange.bind(this);
      this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
      this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
      this.handleCommentClick = this.handleCommentClick.bind(this);
      this.handleCommentAffichClick = this.handleCommentAffichClick.bind(this);
      this.handleDeleteCommentClick = this.handleDeleteCommentClick.bind(this);
      
    }
    
    //recupération des messages de la discussion
    componentDidMount() {
      let discussionId = this.props.match.params.id;
      fetch('http://localhost:5000/api/discussion/' + discussionId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
      })
      .then(response => response.json())     
      .then(json => this.setState({discussion : json[0]}))
      .then(() => {
        fetch('http://localhost:5000/api/discussion/' + discussionId + '/message', {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        })
        .then(response => response.json())     
        .then(json => this.setState({messages : json}));
      }).catch(err => {
          console.log('err', err);
          alert("Serveur non disponible");
      })
    } 

    //fonction de changement d'état de l'input de message
    handleMessageChange(event) {
      this.setState({message: event.target.value});
    }

    //fonction de changement d'état de l'input de fichier
    handleFileChange = event => {
      this.setState({
          selectedFile: event.target.files[0],
      })
    }

    // fonction pour envoyer un nouveau message dans la discussion
    handleMessageSubmit(e) {
      e.preventDefault();
      let discussionId = this.props.match.params.id;
      let data = new FormData();
      
      data.append('file', this.state.selectedFile)
      data.append('discussionId', this.props.match.params.id)
      data.append('text_message', this.state.message)
      fetch('http://localhost:5000/api/discussion/' + discussionId + '/message', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: data
        }).then(function(response) {
            return response.json();
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    //fonction pour supprimer un message
    handleDeleteClick(id, e) {
      e.preventDefault();
      let discussionId = this.props.match.params.id;
      let messageId = id;
      
      let objetPost = {
        id: messageId
      }
      fetch('http://localhost:5000/api/discussion/' + discussionId + '/message/' + id, {
        method: 'DELETE',
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

    //fonction pour compter le nombre de j'aime
    handleLikeClick() {

    }

    //fonction pour appeler l'input de commentaire
    handleCommentClick(id, name, firstName) {
      this.setState({showCommentEntry: true});
      this.setState({messageId: id});
      this.setState({name : name});
      this.setState({firstName: firstName});
    }

    ////fonction de changement d'état de l'input de commentaire
    handleCommentChange(event) {
      this.setState({commentaire: event.target.value});
    }

    //fonctioin pour soumettre le commentaire
    handleCommentSubmit(e){
      e.preventDefault();
      let discussionId = this.props.match.params.id;
      let messageId =this.state.messageId;
      let objetPost = {
        text_comment: this.state.commentaire,
        message_id: this.state.messageId
      }
      fetch('http://localhost:5000/api/discussion/'+ discussionId +'/message/'+ messageId +'/comment', {
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

    //fonction pour afficher un commentaire
    handleCommentAffichClick(id) {
      let discussionId = this.props.match.params.id;
      this.setState({showComment: true});
      let messageId = id;
      fetch('http://localhost:5000/api/discussion/' + discussionId + '/message/' + messageId +'/comment', {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("token")
          },
        })
        .then(response => response.json())     
        .then(json => this.setState({comments : json}));
    }

    //fonction pour supprimer un commentaire
    handleDeleteCommentClick(id, message_id, e) {
      e.preventDefault();
      let discussionId = this.props.match.params.id;
      let commentId = id;
      let messageId = message_id;

      let objetPost = {
        id: commentId
      }
      fetch('http://localhost:5000/api/discussion/' + discussionId + '/message/' + messageId +'/comment/' + commentId, {
        method: 'DELETE',
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
    //affichage de l'input de commentaire
    let commentEntry = null;
    if (this.state.showCommentEntry === true) {
      commentEntry = (
        <div className="Comment-create">
          <form className="Create-discussion" onSubmit={this.handleCommentSubmit}>
            <label className="Create-label" for="title">Vous répondez au message de : {this.state.name} {this.state.firstName}</label>
            <textarea rows={5} cols={30} className="Create-input" id="title" value={this.state.value} onChange={this.handleCommentChange}/>
            <input className="Inscription-input Submit-form" type="submit" value="Envoyer"/>
          </form>
        </div>
      )
    }

    //affichage des commentaires
    let comment = null;
    if (this.state.showComment === true) {
      comment = (
        <div className="Comment-bloc">
          {this.state.comments.map(comment => (
            <p className="Comment-text">
              <p className="Message-autor">Auteur : {comment.name} {comment.firstName} - Date : <Moment format="DD/MM/YYYY hh:mm:ss">{comment.date}</Moment> </p>
              <p>{comment.text_comment}</p>
              <FontAwesomeIcon className="Icon-bloc Icon1"  /*onClick={() => handleLikeClick(message.id)}*/ icon={faHeart} />
              <FontAwesomeIcon className="Icon-bloc Icon2" onClick={() => this.handleCommentClick(comment.id)} icon={faPen} />
              <FontAwesomeIcon className="Icon-bloc Icon3" onClick={(e) => this.handleDeleteCommentClick(comment.id, comment.message_id, e)} icon={faTrash} />
            </p>
          ))}
        </div>
      )
    }

    return (
      <div className="Page-bloc">
        <Menu/>
        <div>
         
          <h2>Discussion : {this.state.discussion.title}</h2>
         
          <div className="Message-bloc">
            <div>
              <div>
                {this.state.messages.map(message => (
                  <p >
                    <p className="Message-text">
                      <p className="Message-autor">Auteur : {message.name} {message.firstName} - Date : <Moment format="DD/MM/YYYY hh:mm:ss">{message.date}</Moment> </p>
                      <p>{message.text_message}</p>
                      <img src={message.file} className="Photo-profil"/>
                      <FontAwesomeIcon className="Icon-bloc Icon1"  /*onClick={() => handleLikeClick(message.id)}*/ icon={faHeart} />
                      <FontAwesomeIcon className="Icon-bloc Icon2" onClick={() => this.handleCommentClick(message.id, message.name, message.firstName)} icon={faPen} />
                      <FontAwesomeIcon className="Icon-bloc Icon3" onClick={(e) => this.handleDeleteClick(message.id, e)} icon={faTrash} />
                      <div onClick={()=> this.handleCommentAffichClick(message.id)}>Afficher les commentaires</div>
                    </p>
                    {comment}
                  </p>
                ))}
                {commentEntry}
              </div>
              <div className="Message-create-bloc">
                <p className="Message-create-title">Créer un nouveau message</p>
                <form className="Create-discussion" onSubmit={this.handleMessageSubmit}>
                  <label className="Create-label" for="title">Votre message : </label>
                  <input className="Create-input" type="text" id="title" value={this.state.value} onChange={this.handleMessageChange}/>
                  <input className="Profil-modif" type="file" accept="image/png, image/jpeg" onChange={this.handleFileChange}/>
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

export default Message;