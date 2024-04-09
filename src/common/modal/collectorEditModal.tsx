import React from 'react';
import { Modal } from 'antd';
import Collector from '../../models/collector';
import { History } from 'history';
import CollectorEditForm from '../form/collectorEditForm';

interface IProps {
    collector: Collector,
    listProjects: any,
    history: History,
    visible: boolean,
    collectorType: string,
    // collectorTypeId: string,
    // onFieldValueChange: (fieldName: any, value: any) => void,
    // onSave: () => void
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

class collectorEditModal extends React.Component<IProps, IState> { 

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
                    title="Name Your Collector"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                
                <CollectorEditForm 
                    history={this.props.history} match={this.props.match}
                    collector={this.props.collector}
                    collectorType={this.props.collectorType}
                    listProjects={this.props.listProjects}
                    // collectorTypeId={this.props.collectorTypeId}
                    // onFieldValueChange={this.props.onFieldValueChange}
                    // onSave={this.props.onSave}
                />

                </Modal>

            </div>
        );
    }
};
export default collectorEditModal;