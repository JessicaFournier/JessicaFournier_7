import React, { Component } from 'react'
import './Message.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Menu from '../Menu/Menu.js'
import Moment from 'react-moment';
import photoProfil from '../Profil/bonhomme.png'

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
        selectedFile: null,
        liked: null
      };
      
      this.handleMessageChange = this.handleMessageChange.bind(this);
      this.handleCommentChange = this.handleCommentChange.bind(this);
      this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
      this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
      this.handleCommentClick = this.handleCommentClick.bind(this);
      this.handleCommentAffichClick = this.handleCommentAffichClick.bind(this);
      this.handleDeleteCommentClick = this.handleDeleteCommentClick.bind(this);
      this.handleLikeClick = this.handleLikeClick.bind(this);
      
    }

    loadMessages(discussionId) {
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
    
    //recupération des messages de la discussion
    componentDidMount() {
      let discussionId = this.props.match.params.id;
      this.loadMessages(discussionId);
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
      
      if (this.state.selectedFile != null) {
        data.append('file', this.state.selectedFile)
      }

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
        }).then(() => {
          let discussionId = this.props.match.params.id;
          this.loadMessages(discussionId);
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
        }).then(function(response) {
            alert(response);
        }).then(() => {
          let discussionId = this.props.match.params.id;
          this.loadMessages(discussionId);
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    //fonction pour compter le nombre de j'aime
    handleLikeClick(id, e) {
      e.preventDefault();
      let discussionId = this.props.match.params.id;
      let messageId = id;
      let objetPost = {
        message_id: id
      }
      fetch('http://localhost:5000/api/discussion/'+ discussionId +'/message/'+ messageId +'/like', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(objetPost)
        }).then(function(response) {
            return response.json();
        }).then(() => {
          let discussionId = this.props.match.params.id;
          this.loadMessages(discussionId);
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    //fonction pour appeler l'input de commentaire
    handleCommentClick(id, name, firstName) {
      this.setState({
        showCommentEntry: true,
        messageId: id,
        name : name,
        firstName: firstName
      });
    }

    ////fonction de changement d'état de l'input de commentaire
    handleCommentChange(event) {
      this.setState({commentaire: event.target.value});
    }

    //fonction pour soumettre le commentaire
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
        }).then(() => {
          let discussionId = this.props.match.params.id;
          this.loadMessages(discussionId);
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    //fonction pour afficher un commentaire
    handleCommentAffichClick(id) {
      let discussionId = this.props.match.params.id;
      let messageId = id;
      this.setState({
        showComment: true,
        messageId: id
      });

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
        }).then(function(response) {
            alert(response);
        }).then(() => {
          let discussionId = this.props.match.params.id;
          this.loadMessages(discussionId);
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
            <input className="Inscription-input Submit-form Submit-comment" type="submit" value="Envoyer"/>
          </form>
        </div>
      )
    }

    //affichage des commentaires
    let comment = null;
    if (this.state.showComment === true) {
      comment = (
        <div >
          {this.state.comments.map(comment => (
            <div className="Comment-bloc">
              <div className="Comment-text">
                <img src={comment.photo ? comment.photo : photoProfil} className="Photo-message" alt={"photo de " + comment.name}/>
                <p className="Message-autor">Auteur : {comment.name} {comment.firstName} - Date : <Moment format="DD/MM/YYYY hh:mm">{comment.date}</Moment> </p>
                <p>{comment.text_comment}</p>
                <FontAwesomeIcon className="Icon-bloc Icon4" onClick={(e) => this.handleDeleteCommentClick(comment.id, comment.message_id, e)} icon={faTrash} />
              </div>
            </div>
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
                  <div >
                    <div className="Message-text">
                      <img src={message.photo ? message.photo : photoProfil} className="Photo-message" alt ={"photo de " + message.name}/>
                      <div className="Message-autor">Auteur : {message.name} {message.firstName} - Date : <Moment format="DD/MM/YYYY hh:mm">{message.date}</Moment> </div>
                      <div className="Message-text-p">{message.text_message}</div>
                      <img src={message.file} className="Photo-profil" alt=""/>
                      <p className="Icon-bloc Icon2">{message.nbLike}</p><FontAwesomeIcon className="Icon-bloc Icon1"  onClick={(e) => this.handleLikeClick(message.id, e)} icon={faHeart} />
                      <FontAwesomeIcon className="Icon-bloc Icon3" onClick={() => this.handleCommentClick(message.id, message.name, message.firstName)} icon={faPen} />
                      <FontAwesomeIcon className="Icon-bloc Icon4" onClick={(e) => this.handleDeleteClick(message.id, e)} icon={faTrash} />
                      <div className="Comment-affich" onClick={()=> this.handleCommentAffichClick(message.id)}>Afficher les commentaires</div>
                    </div>
                    {message.id === this.state.messageId ? comment : null}
                  </div>
                ))}
                {commentEntry}
              </div>
              <div className="Message-create-bloc">
                <p className="Message-create-title">Créer un nouveau message</p>
                <form className="Create-discussion" onSubmit={this.handleMessageSubmit}>
                  <label className="Create-label" for="title">Votre message : </label>
                  <input className="Create-input" type="text" id="title" value={this.state.value} onChange={this.handleMessageChange}/>
                  <input className="Profil-modif" type="file" accept="image/png, image/jpeg, image/gif" onChange={this.handleFileChange}/>
                  <input className="Inscription-input Submit-form Submit-message" type="submit" value="Envoyer"/>
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