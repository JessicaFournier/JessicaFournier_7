import React, { Component } from 'react'
import './Discussion.css'
import { Link } from 'react-router-dom'
import Menu from '../Menu/Menu.js'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Discussion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            discussions: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    loadDiscussions() {
        fetch('http://localhost:5000/api/discussion', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.get('token')
            },
        })
        .then(response => response.json())
        .then(json => this.setState({ discussions: json }))
        .catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    componentDidMount() {
        this.loadDiscussions();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(e) {
        let objetPost = {
            title: this.state.value,
        }
        e.preventDefault();
        fetch('http://localhost:5000/api/discussion', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.get('token')
            },
            body: JSON.stringify(objetPost)
        }).then(function (response) {
            return response.json();
        }).then(() => {
            window.location.reload();
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    handleDeleteClick(id, e) {
        e.preventDefault();
        let discussionId = id
        let objetPost = {
            id: discussionId
        }
        
        fetch('http://localhost:5000/api/discussion/' + discussionId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.get('token')
            },
            body: JSON.stringify(objetPost)
        }).then(() => {
            this.loadDiscussions();
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    render() {
        return (
            <div className="Page-bloc">
                <Menu />
                <div>
                    <h2>Les discussions en cours</h2>
                    <div className="Discussion-bloc">
                        <div className="Discussion-text">
                            {this.state.discussions.map((discussion, i) => (
                                <div key={i} className="Discussion-bloc-link">
                                    <Link className="Discussion-link" to={"/Discussion/" + discussion.id + '/'}>{discussion.title}</Link>
                                    <FontAwesomeIcon className="Discussion-icon" onClick={(e) => this.handleDeleteClick(discussion.id, e)} icon={faTrash} />
                                </div>

                            ))}
                            <div className="Discussion-create-bloc">
                                <p className="Discussion-create-title">Créer une nouvelle discussion</p>
                                <form className="Create-discussion" onSubmit={this.handleSubmit}>
                                    <label className="Create-label" htmlFor="title">Titre de la discussion : </label>
                                    <input className="Create-input" type="text" id="title" value={this.state.value} onChange={this.handleChange} />
                                    <input className="Inscription-input Submit-form Submit-discussion" type="submit" value="Envoyer" />
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