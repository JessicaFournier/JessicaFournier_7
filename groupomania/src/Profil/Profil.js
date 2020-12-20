import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import './Profil.css'
import photoProfil from './bonhomme.png'
import { Redirect } from 'react-router-dom'
import Menu from '../Menu/Menu.js'

import { getProfile, deleteProfile, putProfile } from '../Api.js'

const cookies = new Cookies();

class Profil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            selectedFile: null,
            redirection: false,
        };
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUploadFileClick = this.handleUploadFileClick.bind(this);
        this.handleDeleteProfileClick = this.handleDeleteProfileClick.bind(this);
    }

    resetForm() {
        this.fileInput.value = "";
    }

    loadProfil() {
        getProfile()
            .then(response => response.json())
            .then(json => this.setState({ user: json }));
    }

    componentDidMount() {
        this.loadProfil();
    }

    /**
     * 
     * @param {*} event 
     */
    handleFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
        })

    }

    handleUploadFileClick = () => {
        const id = cookies.get('userId');
        const data = new FormData();

        data.append('file', this.state.selectedFile);

        putProfile(id, data).then(() => {
            this.loadProfil();
            this.resetForm();
        }).catch(err => {
            console.log('err', err);
            alert("Serveur non disponible");
        })
    }

    /**
     * 
     * @param {*} e 
     */
    handleDeleteProfileClick(e) {
        e.preventDefault();
        const id = cookies.get('userId')

        let data = {
            id: id
        }

        deleteProfile(id, data)
            .then(() => {
                cookies.remove('token');
                cookies.remove('userId');
                this.setState({ redirection: true })
                alert('Profil supprimé')
            }).catch(err => {
                console.log('err', err);
                alert("Serveur non disponible");
            })
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/' />
        }
        let photo = photoProfil;
        if (this.state.user.photo != null) {
            photo = this.state.user.photo;
        }
        return (
            <div className="Page-bloc">
                < Menu />
                <div className="Profil">
                    <h2>Mon profil</h2>
                    <div className="Profil-bloc">
                        <div className="Profil-img">
                            <img src={photo} className="Photo-profil" alt="profil" />
                            <div>
                                <input className="Profil-modif" type="file" accept="image/png, image/jpeg" ref={ref => this.fileInput = ref} onChange={this.handleFileChange} />
                                <button className="Profil-upload" onClick={this.handleUploadFileClick}>Upload</button>
                            </div>
                        </div>
                        <div className="Profil-text">
                            <p className="Profil-p">Nom : {this.state.user.name}</p>
                            <p className="Profil-p">Prénom : {this.state.user.firstName}</p>
                        </div>
                    </div>
                    <button className="Profil-delete" onClick={this.handleDeleteProfileClick}>Supprimer mon compte</button>
                </div>
            </div>
        );
    }
}

export default Profil;