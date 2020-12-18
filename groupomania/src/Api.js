import Cookies from 'universal-cookie';

const cookies = new Cookies();

const api = 'http://localhost:5000/api';

/**
 * 
 * @param {*} discussionId 
 * @param {*} data 
 */
export function postMessage(discussionId, data) {
    return fetch(api + '/discussion/' + discussionId + '/message', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: data
    });
}

/**
 * 
 * @param {*} discussionId 
 * @param {*} id 
 * @param {*} data 
 */
export function deleteMessage(discussionId, id, data) {
    return fetch(api + '/discussion/' + discussionId + '/message/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify(data)
    });
}

/**
 * 
 * @param {*} discussionId 
 * @param {*} messageId 
 * @param {*} data 
 */
export function addLike(discussionId, messageId, data) {
    return fetch(api + '/discussion/' + discussionId + '/message/' + messageId + '/like', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify(data)
    });
}

/**
 * 
 * @param {*} discussionId 
 * @param {*} messageId 
 * @param {*} data 
 */
export function postComment(discussionId, messageId, data) {
    return fetch(api + '/discussion/' + discussionId + '/message/' + messageId + '/comment', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify(data)
    });
}

/**
 * 
 * @param {*} discussionId 
 * @param {*} messageId 
 */
export function getComments(discussionId, messageId) {
    return fetch(api + '/discussion/' + discussionId + '/message/' + messageId + '/comment', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.get('token')
            },
        });
}

/**
 * 
 * @param {*} discussionId 
 * @param {*} messageId 
 * @param {*} commentId 
 * @param {*} data 
 */
export function deleteComment(discussionId, messageId, commentId, data) {
    return fetch(api + '/discussion/' + discussionId + '/message/' + messageId + '/comment/' + commentId, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify(data)
    })
}

/**
 * 
 * @param {*} discussionId 
 */
export function getDiscussion(discussionId) {
    return fetch(api + '/discussion/' + discussionId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
    });
}

/**
 * 
 * @param {*} discussionId 
 */
export function getMessages(discussionId) {
    return fetch(api + '/discussion/' + discussionId + '/message', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
    })
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 */
export function deleteProfile(id, data) {
    return fetch(api + '/user/profil/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify(data)
    })
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 */
export function putProfile(id, data) {
    return fetch(api + '/user/profil/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + cookies.get('token')
            },
            body: data
        })
}

/**
 * 
 */
export function getProfile() {
    return fetch(api + '/user/profil', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
        },
    })
}

export default {}