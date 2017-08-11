import React from 'react';

const style = {
    color: 'red',
    paddingLeft: 17,
};

export function errorMsg(msg, show){
    return show ? (<p style={style}> {msg} </p>) : null
}