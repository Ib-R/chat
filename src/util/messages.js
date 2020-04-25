import React from "react";

export class Messages extends React.Component {
    render(){
        return(
            <div>
                <p className='alert alert-danger'>{this.props.message}</p>
            </div>
        )
    }
}