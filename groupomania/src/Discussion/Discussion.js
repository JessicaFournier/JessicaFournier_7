import React, { Component } from 'react'
import './Discussion.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

class Discussion extends Component {
  render() {
    return (
        <div>
            <h2>Salon de Discussion</h2>
            <div className="Discussion-bloc">
                <div className="Discussion-text">
                    <p>Texte envoyé</p>
                    <FontAwesomeIcon icon={faHeart} />
                    <FontAwesomeIcon icon={faPen} />
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </div>
            
        </div>
    );
  }
}

export default Discussion;