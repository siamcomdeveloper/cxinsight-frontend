import React from 'react';
import { History } from 'history';

interface IProps { 
    history: History;
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            token:string
        },
        path: string,
        url: string,
    }
}

interface IState {}

export default class RedirectClientSurvey extends React.Component<IProps, IState> {
    
    componentDidMount() {
    }

    render() {
        return <div></div>
    }
}