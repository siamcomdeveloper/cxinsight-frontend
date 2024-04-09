import React from 'react';
import { History } from 'history';
// import qs from 'querystring';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string,
            // surveyId:string,
            // collectorId:string,
            token:string
        },
        path: string,
        url: string,
    }
}

interface IState {}

export default class RedirectClientSurvey extends React.Component<IProps, IState> {
    
    componentDidMount() {
        // const query = qs.parse(this.props.history.location.search.replace('?', ''));
        // // console.log('query', query);
        // // const token = this.props.match.params.token;
        // const token = query.token as any;
        // // console.log('DemoClientSurvey componentDidMount token', token);
        // // console.log('DemoClientSurvey componentDidMount this.props.match', this.props.match);
        // // console.log('DemoClientSurvey componentDidMount this.props.match.params', this.props.match.params);
        // // console.log('DemoClientSurvey componentDidMount this.props.match.params.xSite', this.props.match.params.xSite);

        // const xSite = this.props.match.params.xSite;
        
        // if(!token) return;
        
        // setTimeout(function(this: any){ 
        //         // const completionRedirect = `http://localhost:3002/cxm/platform/client/${this.props.match.params.xSite}/sv?token=${token}`;
        //         const completionRedirect = `${process.env.REACT_APP_BASE_FRONTEND}/client/${xSite}/sv?token=${token}`;
        //         // const completionRedirect = `https://www.cxthailand.com/cxm/platform/client/${this.props.match.params.xSite}/sv?token=${token}`;
        //         // console.log('completion redirect', completionRedirect);
        //         window.location.href = completionRedirect;
        // }, 0);
    }

    render() {
        return <div></div>
    }
}