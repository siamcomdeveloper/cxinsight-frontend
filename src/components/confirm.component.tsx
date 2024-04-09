import React from 'react';
import { Result, Spin } from 'antd';
import { History } from 'history';
import BaseService from '../service/base.service';
import * as toastr from 'toastr';

interface IProps { 
    history: History;
    //Map properties match
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

interface IState {
    isLoading: boolean;
}

export default class Confirm extends React.Component<IProps, IState>{

    constructor(props:IProps) {
        super(props);

        this.state = {
            isLoading: true,
        }
    }

    public async componentDidMount() { 
        const token = { token: this.props.match.params.token} ;

      // console.log('Confirm componentDidMount token', token);

        BaseService.post(this.props.match.params.xSite, "/auth/confirm/", token).then(
            (rp) => {
                try{
                  // console.log('rp', rp);
                    if (rp.Status) {
                      // console.log('rp.Data', rp.Data);
                        toastr.success(rp.Messages);
                        // localStorage.setItem('iconcxmuser', rp.Data.userToken);
                        this.setState({ isLoading: false });
                        setTimeout(function(this: any){ this.props.history.push(`/${this.props.match.params.xSite}/login`); }.bind(this), 500);
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        setTimeout(function(this: any){ this.props.history.push(`/${this.props.match.params.xSite}/register`); }.bind(this), 500);
                        console.log("Messages: " + rp.Messages);
                        console.log("Exception: " + rp.Exception);
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    console.log("Exception: " + error); 
                }
            }
        );
    }

    render() {
        if (this.state.isLoading) {
            return <div id="overlay"> <Spin size="large" tip="Loading..."></Spin> </div>
        }
        return (
            <Result
                status="success"
                title="Register Successfully!"
            />
        );
    }
}