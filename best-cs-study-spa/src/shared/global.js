export const handleFetchResponseNotOkError = (response, onError) => {
    if(response.status == '401'){
        onError(new Error(response.statusText));
        return;
    }

    const applicationError = response.headers.get('Application-Error');
    if(applicationError){
        onError(new Error(applicationError));
        return;
    }

    response.clone().json()
    .then(responseBodyJson=>{

        const modalStateErrors = responseBodyJson.errors;

        var errMess = '';
        if(modalStateErrors && typeof(modalStateErrors) == 'object'){
            for(const key in modalStateErrors){
                if(modalStateErrors[key]){
                    errMess += modalStateErrors[key] + '\n';
                }
            }

            onError(new Error(errMess));
            return;
        }else{

            onError(new Error(modalStateErrors || 'Server Error'));
            return;
        }
    })
    .catch(error=>{

        response.clone().text()
        .then(responseBodyText=>{
            throw new Error(responseBodyText);
        })
        .catch(error=>{
            throw error;
        })
        .catch(error=>{
            onError(error);
            return;
        });
    });
};

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.findIndex = function (filter) {
    for(let index=0; index < this.length; index++){
        if(filter(this[index])){
            return index;
        }
    }

    return -1;
};

export const postCategoryOptions = [
    {value:'books', display:'Books'}, 
    {value:'mooc', display:'MOOC'},
    {value:'articles', display:'Articles'},
    {value:'videos', display:'Videos'},
    {value:'others', display:'Others'},
];

export const genderOptions = [
    {value:'male', display:'Male'}, 
    {value:'female', display:'Female'}
];

export const defaultDatetimeValue = -62135571604000;