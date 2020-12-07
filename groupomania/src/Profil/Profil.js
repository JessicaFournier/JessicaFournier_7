import React, { Component } from 'react'
import './Profil.css'
import photoprofil from './bonhomme.png'
import { Link, Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu.js'

class Profil extends Component {
    constructor(props){
        super(props);
        this.state = { 
          user: [],
          selectedFile:null,
          redirection: false,
        };
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUploadFileClick = this.handleUploadFileClick.bind(this);
        this.handleDeleteProfileClick = this.handleDeleteProfileClick.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/user/profil', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        })
        .then(response => response.json())     
        .then(json => this.setState({user : json}));    
    }

    handleFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
        })
        
    }

    handleUploadFileClick = () => {
        const id = localStorage.getItem("userId")
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        fetch('http://localhost:5000/api/user/profil/' + id, {
        method: 'PUT',
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
    handleDeleteProfileClick(e) {
        e.preventDefault();
        const id = localStorage.getItem("userId")
        let objetPost = {
            id: id
        }
        fetch('http://localhost:5000/api/user/profil/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(objetPost)
        }).then(function() {
            localStorage.clear();
            this.setState({ redirection: true })
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/'/>
        }
        return (
            <div className="Page-bloc">
                < Menu />
                <div className="Profil">
                    <h2>Mon profil</h2>
                    <div className="Profil-bloc">
                        <div className="Profil-img">
                            <img src={this.state.user.photo} className="Photo-profil" alt="profil"/>
                            <div>
                                <input className="Profil-modif" type="file" accept="image/png, image/jpeg" onChange={this.handleFileChange}/>
                                <button onClick={this.handleUploadFileClick}>Upload</button>
                            </div>
                        </div>
                        <div className="Profil-text">
                            <p className="Profil-p">Nom : {this.state.user.name}</p>
                            <p className="Profil-p">Prénom : {this.state.user.firstName}</p>
                        </div>
                    </div>
                </div>
                <button onClick={this.handleDeleteProfileClick}>Supprimer mon compte</button>
            </div>
        );
    }
}

export default Profil;