import React from 'react';
import { Icon, Modal, Tooltip } from 'antd';
// import Collector from '../../models/collector';
// import BaseService from '../../service/base.service';
import { History } from 'history';
import CollectorCreateForm from '../form/collectorCreateForm';

interface IProps {
    history: History,
    visible: boolean,
    collectorType: string,
    listProjects: any,
    // collectorTypeId: string,
    onFieldValueChange: (fieldName: any, value: any) => void,
    onSave: () => void
}

interface IState {
    visible: boolean
}

class collectorCreateModal extends React.Component<IProps, IState> { 

    constructor(props: IProps) {
        super(props);
        this.state = { 
            visible: props.visible
        };
      // console.log('collectorCreateModal constructor', props);
    }

    public componentDidMount() { 
      // console.log('collectorCreateModal componentDidMount');
    }

    componentWillReceiveProps(props: any) {
      // console.log('collectorCreateModal componentWillReceiveProps', props);
        this.setState({
            visible: props.visible
        });
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
        });
      // console.log('collectorCreateModal handleCancel', this.state.visible);
    };

    
    render() {
        return (

            <div>
                
                <Modal 
                    className="create-collector-modal"
                    // title="Name Your Collector"
                    title={<div>Name Your Collector <Tooltip title={'โดยผู้ใช้งานจะเห็นชื่อที่ต้ังนี้ในหน้าต่างๆ โดยเฉพาะในการใช้งานฟังก์ชันตัวกรอง แนะนำให้ตั้งชื่อให้สอดคล้องกับชนิดของตัวจัดเก็บ และโครงการที่จะให้ลูกค้าทำแบบสอบถาม ตัวอย่างเช่น ถ้าเป็นแบบสอบถามชนิด Web Link QR ของโครงการ A ก็ตั้งควรตั้งชื่อ "Web Link QR - โครงการ A"'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> </div>}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                >
                
                <CollectorCreateForm 
                    collectorType={this.props.collectorType}
                    listProjects={this.props.listProjects}
                    // collectorTypeId={this.props.collectorTypeId}
                    onFieldValueChange={this.props.onFieldValueChange}
                    onSave={this.props.onSave}
                />

                </Modal>

            </div>
        );
    }
};
export default collectorCreateModal;