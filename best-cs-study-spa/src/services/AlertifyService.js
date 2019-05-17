import alertify from 'alertifyjs';

class AlertifyService {
    constructor(){
        
    }

    confirm(message, okCallback){
        alertify.confirm(message, function(e){
            if(e){
                okCallback();
            }else{

            }
        });
    }

    success(message){
        alertify.success(message);
    }

    error(message){
        alertify.error(message);
    }

    warning(message){
        alertify.warning(message);
    }

    message(message){
        alertify.message(message);
    }
}

export const alertifyService = new AlertifyService();