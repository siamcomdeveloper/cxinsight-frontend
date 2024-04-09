import React from 'react';
import { Modal, Divider, Icon, Tooltip } from 'antd';
import { History } from 'history';
import SurveyCreateForm from '../form/surveyCreateForm';

interface IProps {
    history: History,
    visible: boolean,
    surveyProjects: any,
    // surveys: Surveys,
    surveyTouchpoint: string,
    surveyTouchpointId: string,
    onFieldValueChange: (fieldName: any, value: any) => void,
    onSave: () => void
}

interface IState {
    // surveys: Surveys
    // surveyTouchpoint: string,
    // surveyTouchpointId: string
    visible: boolean
}

class surveyCreateModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            // surveys: {
            //     name: '',
            //     template_id: ''
            // },
            // surveyTouchpoint: props.surveyTouchpoint,
            // surveyTouchpointId: props.surveyTouchpointId
            visible: props.visible
        };
      // console.log('surveyCreateModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('surveyCreateModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('surveyCreateModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
            // surveyTouchpoint: props.surveyTouchpoint,
            // surveyTouchpointId: props.surveyTouchpointId
        });
    }

    // handleOk = (e: any) => {
    //   // console.log('surveyCreateModal handleOk', e);
    //     this.props.history.push(`/${this.props.match.params.xSite}`);
    //     // this.setState({
    //     //   visible: false,
    //     // });
    // };

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('surveyCreateModal handleCancel', this.state.visible);
    };

    // showModal = (templateName: any, templateId: any) => {
    //   // console.log('surveyCreateModal showModal Name', templateName)
    //   // console.log('surveyCreateModal showModal ID', templateId)
    //     this.setState({
    //         visible: true,
    //         // surveyTouchpoint: templateName,
    //         // surveyTouchpointId: templateId
    //     });
    //   // console.log('surveyCreateModal showModal', this.state);
    //     // ReactDOM.render(<SurveyCreateModal history={this.props.history} visible={true}/>, document.getElementById('survey-create-modal'));
    // };

    // showModal = () => {
    //     this.setState({
    //         visible: true,
    //     });
    // };

    // handleOk = (e: any) => {
    //   // console.log(e);
    //     // this.setState({
    //     //   visible: false,
    //     // });
    // };

    // handleCancel = (e: any) => {
    //     this.setState({
    //         visible: false,
    //     });
    //   // console.log(this.props.visible);
    //   // console.log(this.state.visible);
    // };
    
    render() {
        // if(!this.props.visible){
        //     return null;
        // }
        return (

            <div>
                
                <Modal 
                    className="create-survey-modal"
                    // title="Name Your survey"
                    
                    title={<div>Name Your survey</div>}
                    // title={<div><Divider style={{ fontSize: '18px', color: 'black', fontStyle: 'italic', textAlign: 'center' }} >{this.props.surveyTouchpoint} Touchpoint</Divider>Name Your survey</div>}
                    visible={this.state.visible}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                {/* {this.state.surveyTouchpoint}
                {this.state.surveyTouchpointId} */}
                
                <SurveyCreateForm 
                    // surveys={this.props.surveys}
                    surveyProjects={this.props.surveyProjects}
                    surveyTouchpoint={this.props.surveyTouchpoint}
                    surveyTouchpointId={this.props.surveyTouchpointId}
                    onFieldValueChange={this.props.onFieldValueChange}
                    onSave={this.props.onSave}
                />

                </Modal>

            </div>
        );
    }
};
export default surveyCreateModal;