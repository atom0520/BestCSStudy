import React from 'react';

export const Loading = (props) => {
    return(
        <div className="col-12">
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>{props.text?props.text:"Loading . . ."}</p>
        </div>
    );
};