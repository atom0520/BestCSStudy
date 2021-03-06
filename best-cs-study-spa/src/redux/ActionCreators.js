import * as ActionTypes from './ActionTypes';
import { VALUES } from '../shared/values';
import { baseUrl } from '../shared/baseUrl';

import { handleFetchResponseNotOkError } from '../shared/global';

import JwtDecode from 'jwt-decode';

export const fetchValues = (onSuccess, onError) => (dispatch) => {
    console.log('fetchValues');

    dispatch(valuesLoading(true));

    // setTimeout(() => {
    //     dispatch(addValues(VALUES));
    // }, 2000);
    return fetch(baseUrl + 'values')
    .then(response => {
        console.log(response);
        if(response.ok){
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(values => {
        dispatch(addValues(values));
        if(onSuccess){
            onSuccess(values);
        }
    })
    .catch(error => {
        dispatch(valuesFailed(error.message));
        if(onError){
            onSuccess(onError);
        }
    });
}

export const valuesLoading = () => ({
    type: ActionTypes.VALUES_LOADING
});

export const valuesFailed = (errmess) => ({
    type: ActionTypes.VALUES_FAILED,
    payload: errmess
});

export const addValues = (values) => ({
    type: ActionTypes.ADD_VALUES,
    payload: values
});

export const requestLogin = () => {
    return {
        type: ActionTypes.LOGIN_REQUEST
    }
}

export const loginSuccess = (token, user) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: token,
        user: user
    }
}

export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

// export const loadLocalToken = (onSuccess) => (dispatch) => {
//     const token = localStorage.getItem('token');
//     if(token != null){
//         const decodedToken = JwtDecode(token);
//         if (typeof decodedToken.exp === 'undefined' || decodedToken.exp > Date.now().valueOf() / 1000) {
//             dispatch(receiveLogin(token, decodedToken));
//             if(onSuccess){
//                 onSuccess(token);
//             }
//         }
//         else{
//             localStorage.removeItem('token');
//             if(onSuccess){
//                 onSuccess(null);
//             }
//         }
//     }else{
//         if(onSuccess){
//             onSuccess(null);
//         }
//     }
// };

export const loginUser = (creds, onSuccess, onError) => (dispatch) => {

    dispatch(requestLogin());

    return fetch(baseUrl + 'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{

            if(response.ok){

                response.json()
                .then(responseBodyJson=>{
                    console.log(responseBodyJson);
                    if(responseBodyJson.token){
                        localStorage.setItem('token', responseBodyJson.token);
                        localStorage.setItem('user', JSON.stringify(responseBodyJson.user));
                        dispatch(loginSuccess(responseBodyJson.token, responseBodyJson.user));

                        if(onSuccess){
                            onSuccess();
                        }
                        
                    }else{
          
                        throw new Error('Error ' + response.status + ': ' + response.statusText);
                    }
                })
                .catch(error=>{

                    dispatch(loginError(error.message));
                    if(onError){
                        onError(error);
                    }
                });

            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
           
                    dispatch(loginError(error.message));
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{          
            throw error;
    })
    .catch(error=>{

        dispatch(loginError(error.message));
        if(onError){
            onError(error);
        }
    });
};

export const requestLogout = () => {
    return {
        type: ActionTypes.LOGOUT_REQUEST
    }
}

export const logoutSuccess = () => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    }
}

export const logoutUser = (onSuccess, onError) => (dispatch) => {

    dispatch(requestLogout());

    localStorage.removeItem('token');

    dispatch(logoutSuccess());

    if(onSuccess){
        onSuccess();
    }
}

// export const requestSignup = (creds) => {
//     return {
//         type: ActionTypes.SIGNUP_REQUEST
//     }
// }

// export const signupSuccess = (response) => {
//     return {
//         type: ActionTypes.SIGNUP_SUCCESS
//     }
// }

// export const signupError = (message) => {
//     return {
//         type: ActionTypes.SIGNUP_FAILURE,
//         message
//     }
// }

export const signupUser = (creds, onSuccess, onError) => (dispatch, getState) => {

    return fetch(baseUrl + 'auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
    .then(response=>{

            if(response.ok){

                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
}

// unregister();


export const fetchUsers = (pageNumber, pageSize, userParams, 
    onSuccess, onError) => (dispatch, getState) => {
    console.log('fetchUsers');

    dispatch(usersLoading());

    let params = {};

    if(pageNumber!=null) params['pageNumber']=pageNumber;

    if(pageSize!=null) params['pageSize']=pageSize;

    if(userParams!=null){
        if(userParams.minAge != null) params['minAge']=userParams.minAge;
        if(userParams.maxAge != null) params['maxAge']=userParams.maxAge;
        if(userParams.gender != null) params['gender']=userParams.gender;
        if(userParams.orderBy != null) params['orderBy']=userParams.orderBy;
        if(userParams.likers != null) params['likers']=userParams.likers;
        if(userParams.likees != null) params['likees']=userParams.likees;
    }

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    return fetch(baseUrl + 'users?' + query)
    .then(response => {

        if(response.ok){
            response.json()
            .then(users => {
                dispatch(addUsers(users));

                let paginationHeader = response.headers.get('Pagination');
                let pagination = null;
                if(paginationHeader){
                    pagination = JSON.parse(paginationHeader);
                }

                if(onSuccess){
                    onSuccess(users, pagination);
                }
            })
            .catch(error=>{
                dispatch(usersFailed(error.message));
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                dispatch(usersFailed(error.message));
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        dispatch(usersFailed(error.message));
        if(onError){
            onError(error);
        }
    });
}

export const fetchPosts = (pageNumber, pageSize, postParams, 
    onSuccess, onError) => (dispatch, getState) => {
    console.log('fetchPosts');

    // dispatch(postsLoading());

    let params = {};

    if(pageNumber!=null) params['pageNumber']=pageNumber;

    if(pageSize!=null) params['pageSize']=pageSize;

    if(postParams!=null){
        if(postParams.category != null) params['category']=postParams.category;
        if(postParams.search != null) params['search']=postParams.search;
        if(postParams.orderBy != null) params['orderBy']=postParams.orderBy;
    }

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    return fetch(baseUrl + 'posts?' + query)
    .then(response => {

        if(response.ok){
            response.json()
            .then(posts => {
                // dispatch(addPosts(posts));

                let paginationHeader = response.headers.get('Pagination');
                let pagination = null;
                if(paginationHeader){
                    pagination = JSON.parse(paginationHeader);
                }

                if(onSuccess){
                    onSuccess(posts, pagination);
                }
            })
            .catch(error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        // dispatch(postsFailed(error.message));
        if(onError){
            onError(error);
        }
    });
}

export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
});

// export const postsLoading = () => ({
//     type: ActionTypes.POSTS_LOADING
// });

export const usersFailed = (errmess) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
});

// export const postsFailed = (errmess) => ({
//     type: ActionTypes.POSTS_FAILED,
//     payload: errmess
// });

export const addUsers = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
});

// export const addPosts = (posts) => ({
//     type: ActionTypes.ADD_POSTS,
//     payload: posts
// });

export const fetchUser = (id, onSuccess, onError) => (dispatch, getState) => {

    return fetch(baseUrl + 'users/' + id)
    .then(response => {
        
        if(response.ok){
            response.json()
            .then(user => {
                dispatch(addUser(user));
                if(onSuccess){
                    onSuccess(user);
                }
            })
            .catch(error=>{
                
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        
        if(onError){
            onError(onError);
        }
    });
}

export const fetchPost = (id, onSuccess, onError) => (dispatch, getState) => {

    return fetch(baseUrl + 'posts/' + id)
    .then(response => {
        if(response.ok){
            response.json()
            .then(post => {
                // dispatch(addUser(user));
                if(onSuccess){
                    onSuccess(post);
                }
            })
            .catch(error=>{
                
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        
        if(onError){
            onError(onError);
        }
    });
}

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    user
});

export const updateUser = (id, user, onSuccess, onError) => (dispatch) => {
    return fetch(baseUrl + 'users/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response=>{
            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const uploadUserPhoto = (userId, file, onSuccess, onError) => (dispatch) => {
    let formData = new FormData();
    formData.append('File', file);

    return fetch(baseUrl + `users/${userId}/photos`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData
    })
    .then(response=>{
            if(response.ok){
                response.json()
                .then(responseBodyJson=>{
                    if(onSuccess){
                        onSuccess(responseBodyJson);
                    }
                })
                .catch(error=>{
                    if(onError){
                        onError(error);
                    }
                });
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const setUserMainPhotoUrl = (url) => (dispatch, getState) =>{
    dispatch ({
        type: ActionTypes.SET_USER_MAIN_PHOTO_URL,
        url,
    });

    localStorage.setItem('user', JSON.stringify(getState().auth.user));
}

export const setUserMainPhoto = (userId, photoId, onSuccess, onError) => (dispatch, getState) => {

    return fetch(baseUrl + `users/${userId}/photos/${photoId}/setMain`, {
        method: 'POST'
    })
    .then(response=>{
            if(response.ok){
                response.json()
                .then(photo=>{

                    dispatch(setUserMainPhotoUrl(photo.url));
              

                    if(onSuccess){
                        onSuccess();
                    }
                })
                .catch(error=>{
                    if(onError){
                        onError(error);
                    }
                });

            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const deleteUserPhoto = (userId, photoId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${userId}/photos/${photoId}`, {
        method: 'DELETE'
    })
    .then(response=>{
            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const sendLike = (id, recipientId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${id}/like/${recipientId}`, {
        method: 'POST',
    })
    .then(response=>{

            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
};

export const fetchMessages = (id, pageNumber, pageSize, messageContainer, onSuccess, onError) => (dispatch) => {

    let params = {};

    if(pageNumber!=null) params['pageNumber']=pageNumber;

    if(pageSize!=null) params['pageSize']=pageSize;

    if(messageContainer!=null) params['messageContainer']=messageContainer;

    let query = Object.keys(params)
    .map(k => k + '=' + params[k])
    .join('&');

    return fetch(baseUrl + `users/${id}/messages?${query}`)
    .then(response => {

        if(response.ok){
            response.json()
            .then(messages => {
                let paginationHeader = response.headers.get('Pagination');
                let pagination = null;
                if(paginationHeader){
                    pagination = JSON.parse(paginationHeader);
                }

                if(onSuccess){
                    onSuccess(messages, pagination);
                }
            })
            .catch(error=>{
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
        },
        error => {
            throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
};

export const fetchMessageThread = (id, recipientId, onSuccess, onError) => (dispatch) =>{
    return fetch(baseUrl + `users/${id}/messages/thread/${recipientId}`)
    .then(response => {
        if(response.ok){
            response.json()
            .then(messages => {
                if(onSuccess){
                    onSuccess(messages);
                }
            })
            .catch(error=>{
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
        },
        error => {
            throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
}

export const sendMessage = (id, message, onSuccess, onError) => (dispatch) => {
    return fetch(baseUrl + `users/${id}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => {
        if(response.ok){

            response.json()
            .then(message => {
                if(onSuccess){
                    onSuccess(message);
                }
            })
            .catch(error=>{
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
        },
        error => {
            throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
}

export const deleteMessage = (id, userId, onSuccess, onError) => (dispatch) => {
    return fetch(baseUrl + `users/${userId}/messages/${id}/delete`, {
        method: 'POST'
    })
    .then(response => {
        if(response.ok){
            if(onSuccess){
                onSuccess();
            }
        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
        },
        error => {
            throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
}

export const markMessageAsRead = (userId, messageId, onSuccess, onError) => (dispatch) => {
    return fetch(baseUrl + `users/${userId}/messages/${messageId}/read`, {
        method: 'POST'
    })
    .then(response => {
        if(response.ok){
            if(onSuccess){
                onSuccess();
            }
        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
        },
        error => {
            throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
}

export const uploadPostImage = (file, onSuccess, onError) => (dispatch) => {
    let formData = new FormData();
    formData.append('File', file);

    return fetch(baseUrl + `postsImages`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData
    })
    .then(response=>{
            if(response.ok){
                response.json()
                .then(responseBodyJson=>{
                    if(onSuccess){
                        onSuccess(responseBodyJson);
                    }
                })
                .catch(error=>{
                    if(onError){
                        onError(error);
                    }
                });
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const createPost = (title, description, category, tags, links, images, mainImage, onSuccess, onError) => (dispatch, getState) => {
    console.log(mainImage);
    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('links', links);
    for(let i=0; i<images.length; i++){
        formData.append(`image${i+1}`, images[i]);
    }
    formData.append('mainImage', mainImage);
    // formData.append(`images`, images);

    return fetch(baseUrl + `posts`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData
    })
    .then(response=>{
            if(response.ok){
                response.json()
                .then(responseBodyJson=>{

                    if(onSuccess){
                        onSuccess(responseBodyJson);
                    }
                })
                .catch(error=>{
                    if(onError){
                        onError(error);
                    }
                });
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const updatePost = (postId, title, description, category, tags, links, deletedImages, addedImages, mainImage, onSuccess, onError) => (dispatch, getState) => {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('links', links);
    formData.append('deletedImages', deletedImages);
    for(let i=0; i<addedImages.length; i++){
        formData.append(`addedImage${i+1}`, addedImages[i]);
    }
    formData.append('mainImage', mainImage);
    // formData.append(`images`, images);

    return fetch(baseUrl + `posts/${postId}`, {
        method: 'PUT',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: formData
    })
    .then(response=>{
            if(response.ok){
                response.json()
                .then(responseBodyJson=>{
                    if(onSuccess){
                        onSuccess(responseBodyJson);
                    }
                })
                .catch(error=>{
                    if(onError){
                        onError(error);
                    }
                });
            } else {     
                handleFetchResponseNotOkError(response,
                error=>{
                    if(onError){
                        onError(error);
                    }
                });
            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{
        if(onError){
            onError(error);
        }
    })
};

export const likePost = (userId, postId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${userId}/likePost/${postId}`, {
        method: 'POST',
    })
    .then(response=>{

            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
};

export const cancelLikedPost = (userId, postId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${userId}/cancelLikedPost/${postId}`, {
        method: 'POST',
    })
    .then(response=>{

            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
};

export const dislikePost = (userId, postId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${userId}/dislikePost/${postId}`, {
        method: 'POST',
    })
    .then(response=>{

            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
};

export const cancelDislikedPost = (userId, postId, onSuccess, onError) => (dispatch) => {

    return fetch(baseUrl + `users/${userId}/cancelDislikedPost/${postId}`, {
        method: 'POST',
    })
    .then(response=>{

            if(response.ok){
                if(onSuccess){
                    onSuccess();
                }
            } else {
                
                handleFetchResponseNotOkError(response,
                error=>{
       
                    if(onError){
                        onError(error);
                    }
                });

            }
        },
        error=>{
            throw error;
        })
    .catch(error=>{

        if(onError){
            onError(error);
        }
    })
};

export const fetchAuthUser = (id, onSuccess, onError) => (dispatch, getState) => {

    return fetch(baseUrl + 'users/auth/' + id)
    .then(response => {
        
        if(response.ok){
            response.json()
            .then(user => {
                dispatch(addAuthUser(user));
                localStorage.setItem('user', JSON.stringify(getState().auth.user));
                if(onSuccess){
                    onSuccess(user);
                }
            })
            .catch(error=>{
                
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        
        if(onError){
            onError(onError);
        }
    });
}

export const addAuthUser = (user) => ({
    type: ActionTypes.ADD_AUTH_USER,
    user
});

// export const authUserLikePost = (postId) => (dispatch, getState) =>{
//     dispatch ({
//         type: ActionTypes.AUTH_USER_LIKE_POST,
//         postId,
//     });

//     localStorage.setItem('user', JSON.stringify(getState().auth.user));
// }

// export const authUserCancelLikedPost = (postId) => (dispatch, getState) =>{
//     dispatch ({
//         type: ActionTypes.AUTH_USER_CANCEL_LIKED_POST,
//         postId,
//     });

//     localStorage.setItem('user', JSON.stringify(getState().auth.user));
// }

// export const authUserDislikePost = (postId) => (dispatch, getState) =>{
//     dispatch ({
//         type: ActionTypes.AUTH_USER_DISLIKE_POST,
//         postId,
//     });

//     localStorage.setItem('user', JSON.stringify(getState().auth.user));
// }

// export const authUserCancelDislikedPost = (postId) => (dispatch, getState) =>{
//     dispatch ({
//         type: ActionTypes.AUTH_USER_CANCEL_DISLIKED_POST,
//         postId,
//     });

//     localStorage.setItem('user', JSON.stringify(getState().auth.user));
// }

export const fetchLikedPosts = (
    userId,
    pageNumber, pageSize, postParams, 
    onSuccess, onError) => (dispatch, getState) => {
    console.log('fetchLikedPosts');

    let params = {};

    params['liked'] = true;

    if(pageNumber!=null) params['pageNumber']=pageNumber;

    if(pageSize!=null) params['pageSize']=pageSize;

    if(postParams!=null){
        if(postParams.category != null) params['category']=postParams.category;
        if(postParams.orderBy != null) params['orderBy']=postParams.orderBy;
    }

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    return fetch(baseUrl + `posts/liked/${userId}?` + query)
    .then(response => {

        if(response.ok){
            response.json()
            .then(posts => {
                // dispatch(addPosts(posts));

                let paginationHeader = response.headers.get('Pagination');
                let pagination = null;
                if(paginationHeader){
                    pagination = JSON.parse(paginationHeader);
                }

                if(onSuccess){
                    onSuccess(posts, pagination);
                }
            })
            .catch(error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        // dispatch(postsFailed(error.message));
        if(onError){
            onError(error);
        }
    });
}

export const fetchUserPosts = (userId, pageNumber, pageSize, postParams, 
    onSuccess, onError) => (dispatch, getState) => {

    let params = {};

    params['userPosts'] = true;

    if(pageNumber!=null) params['pageNumber']=pageNumber;

    if(pageSize!=null) params['pageSize']=pageSize;

    if(postParams!=null){
        if(postParams.category != null) params['category']=postParams.category;
        if(postParams.orderBy != null) params['orderBy']=postParams.orderBy;
    }

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    return fetch(baseUrl + `posts/userPosts/${userId}?` + query)
    .then(response => {

        if(response.ok){
            response.json()
            .then(posts => {
                // dispatch(addPosts(posts));

                let paginationHeader = response.headers.get('Pagination');
                let pagination = null;
                if(paginationHeader){
                    pagination = JSON.parse(paginationHeader);
                }

                if(onSuccess){
                    onSuccess(posts, pagination);
                }
            })
            .catch(error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                // dispatch(postsFailed(error.message));
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        // dispatch(postsFailed(error.message));
        if(onError){
            onError(error);
        }
    });
}

export const fetchTags = (tagParams, onSuccess, onError) => (dispatch) => {
    let params = {};

    if(tagParams!=null){
        if(tagParams.orderBy != null) params['orderBy']=tagParams.orderBy;
        if(tagParams.maxReturnNumber != null) params['maxReturnNumber']=tagParams.maxReturnNumber;
        if(tagParams.minCount != null) params['minCount']=tagParams.minCount;
    }

    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');

    return fetch(baseUrl + 'tags?' + query)
    .then(response => {

        if(response.ok){
            response.json()
            .then(tags => {
                if(onSuccess){
                    onSuccess(tags);
                }
            })
            .catch(error=>{
                if(onError){
                    onError(error);
                }
            });

        } else {
            handleFetchResponseNotOkError(response,
            error=>{
                if(onError){
                    onError(error);
                }
            });
        }
    },
    error => {
        throw error;
    })
    .catch(error => {
        if(onError){
            onError(error);
        }
    });
}