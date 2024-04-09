import React from 'react';
import { Modal } from 'antd';
import Collector from '../../models/collector';
import { History } from 'history';
import MessageEditForm from '../form/smsMessageEditForm';

interface IProps {
    collector: Collector,
    history: History,
    visible: boolean,
    match:{ 
        isExact: boolean
        params: {
            xSite: string
        },
        path: string,
        url: string,
    }
}

interface IState {
    visible: boolean
}

class MessageEditModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('collectorEditModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('collectorEditModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('collectorEditModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('collectorEditModal handleCancel', this.state.visible);
    };

    render() {
        return (

            <div>
                
                <Modal 
                    className="create-collector-modal"
                    title="Edit Compose Message"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                
                <MessageEditForm 
                    history={this.props.history} match={this.props.match}
                    collector={this.props.collector}
                />

                </Modal>

            </div>
        );
    }
};
export default MessageEditModal;