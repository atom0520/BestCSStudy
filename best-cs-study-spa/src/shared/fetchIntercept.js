import fetchIntercept from 'fetch-intercept';
import { store } from '../redux/store';
import { serverIP, serverPort } from './config';

export const jwtWhiteListedDomains = [
    `${serverIP}:${serverPort}`
];
export const jwtBlackListedDomains = [
    `${serverIP}:${serverPort}/api/auth`
];

export const unregisterFetchIntercept = fetchIntercept.register({
    request: function (url, config) {
        // console.log("fetchIntercept.request");
        // console.log(url,config);
        
        const domain = url.replace(/(^\w+:|^)\/\//, '');

        if (store.getState().auth.isAuthenticated == true){
            var jwtRequired = false;
            for(let jwtWhiteListedDomain of jwtWhiteListedDomains){
                if(domain.indexOf(jwtWhiteListedDomain)!=-1){
                    jwtRequired = true;
                    break;
                }
            }

            if(jwtRequired){
                for(let jwtBlackListedDomain of jwtBlackListedDomains){
                    if(domain.indexOf(jwtBlackListedDomain)!=-1){
                        jwtRequired = false;
                        break;
                    }
                }
            }
       
            if(jwtRequired){
                if(config == null){
                    config = {};
                }

                if(config.headers == null){
                    config.headers = {};
                }

                config.headers['Authorization'] = 'bearer ' + store.getState().auth.token;
            }
        }
    
        // Modify the url or config here
        return [url, config];
    },

    requestError: function (error) {
        // console.log("fetchIntercept.error");
        // console.log(error);
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // console.log("fetchIntercept.response");
        // console.log(response);

        // if(!response.ok){
        //     const applicationError = response.headers.get('Application-Error');
        //     if(applicationError){
        //         throw new Error(applicationError);
        //     }

        //     response.clone().json()
        //     .then(responseBodyJson=>{
        //         console.log(responseBodyJson);
        //     })
        //     .catch(error=>{
        //         console.log(error);
        //         throw error;
                
        //         response.clone().text()
        //         .then(responseBodyText=>{
        //             throw new Error(responseBodyText);
        //         })
        //         .catch(error=>{
        //             throw error;
        //         })
                
        //     });
     
        // }
        // Modify the reponse object
        return response;
    },


    responseError: function (error) {
        // console.log("fetchIntercept.responseError");
        // console.log(error);
        // Handle an fetch error
        return Promise.reject(error);
    }
});



// // Call fetch to see your interceptors in action.
// fetch('http://google.com');

// // Unregister your interceptor
// unregister();