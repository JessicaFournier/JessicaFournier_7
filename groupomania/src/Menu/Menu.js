import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import { Link, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'

import './Menu.css'

const cookies = new Cookies();

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirection: false
        }

        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    handleLogoutClick() {
        cookies.remove('token');
        cookies.remove('userId');
        this.setState({ redirection: true });
    }

    render() {
        const { redirection } = this.state;
        if (redirection) {
            return <Redirect to='/' />;
        }
        return (
            <div className="Page-bloc">
                <div className="Menu-bloc">
                    <p className="Menu-title">Menu</p>
                    <div className="Menu-iconLink">
                        <FontAwesomeIcon className="" icon={faComments} />
                        <Link className="Menu-link" to="/Discussion">Salon de discussion</Link>
                    </div>
                    <div className="Menu-iconLink">
                        <FontAwesomeIcon className="" icon={faUser} />
                        <Link className="Menu-link" to="/Profil/">Mon profil</Link>
                    </div>
                    <div className="Menu-button">
                        <button className="Menu-logout" onClick={this.handleLogoutClick} >Deconnexion</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default Menu;