/* eslint-disable import/first */
import * as React from "react";
// import Collector from '../../models/collector';
import { Form, Input, Button, Select, Tooltip, Icon } from 'antd';
import { FormComponentProps } from "antd/lib/form";
const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

interface Props extends FormComponentProps{
  collectorType: string;
  listProjects: any;
  // collectorTypeId: string;
  onFieldValueChange: (fieldName: any, value: any) => void;
  onSave: () => void;
}
interface IState{
  // collectorType: string;
  // collectorTypeId: string;
}

class CreateForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);

      // console.log('constructor', props);

      // this.state = {
      //     // collectors: {
      //     //     name: '',
      //     //     template_id: '',
      //     // },
      //     collectorType: this.props.collectorType,
      //     collectorTypeId: this.props.collectorTypeId
      // }
    }

    componentDidMount() { 

    // console.log('CreateForm componentDidMount');
      // console.log(this.props);
      // console.log(this.props.collectorType);
      // console.log(this.props.collectorTypeId);
      // this.setState({
      //     collectorType: this.props.collectorType,
      //     collectorTypeId: this.props.collectorTypeId
      // });

      // console.log(this.state.collectorType);
      // console.log(this.state.collectorTypeId);
      // this.props.form.setFieldsValue({
      //   name: this.props.collectors.name,
      //   template_id: this.state.collectorType
      // }, () => console.log('after'));
      // console.log('before');

    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    //     // console.log(this.state);
    //     // this.setState({
    //     //     collectorType: props.collectorType,
    //     //     collectorTypeId: props.collectorTypeId
    //     // });
    //     // this.props.form.setFieldsValue({
    //     //   // name: this.props.collectors.name,
    //     //   template_id: this.props.collectorType
    //     // }, () => console.log('after'));
    //     // console.log('before');
    // }
    
    // state = {
    //   checkNick: false,
    // };
  
    check = () => {
      this.props.form.validateFields(err => {
        if (!err) {
          console.info('success');
          this.props.onSave();
        }
      });
    };
  
    // handleChange = (e: { target: { checked: any; }; }) => {
    //   this.setState(
    //     {
    //       checkNick: e.target.checked,
    //     },
    //     () => {onSave
    //       this.props.form.validateFields(['nickname'], { force: true });
    //     },
    //   );
    // };

    onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      this.props.onFieldValueChange(e.target.id, e.target.value)
    }

    onSelectChange = (projectId: any)=> {
      // console.log('onSelectChange projectId', projectId);
      // console.log('onSelectChange projectId.toString()', projectId.toString());
      // console.log('e', e);
      // console.log('e.target', e.target);
      // console.log('e.target.id', e.target.id);
      // console.log('e.target.value', e.target);
      this.props.onFieldValueChange('project_id', projectId);
    }

    // onChangeNum = (e: React.ChangeEvent<HTMLInputElement>)=> {
    //   this.props.onChange(e.target.id, parseInt(e.target.value))
    // }
  
    // handleSelectChange = (status: any) => {
    // // console.log(`handleSelectChange`, status);

    //   this.props.onChange('template_id', status, status);
    //   // this.props.onChange('template_id', parseInt(status));
    //   this.setState({
    //       collectorTypeId: status
    //     }
    // );
  // };

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <div>
          {/* <Form.Item label="Collector Name:">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the collector name',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Collector name" />)}
          </Form.Item> */}

          <Form.Item  style={{ paddingBottom: 0 }} >
            <label className="label-create">Nickname: </label><Tooltip title={'ผู้ใช้งานระบบเท่านั้นที่จะเห็นชื่อที่ต้ังนี้'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip>
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }}>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: 'Please input the collector nickname',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Collector nickname" />)}
          </Form.Item>

          <Form.Item style={{ paddingBottom: 0 }} >
            <label className="label-create">Display name: </label><Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อที่ต้ังนี้ (ถ้าผู้ใช้เปิดใหัผู้ทำแบบสอบถามสามารถเห็นชื่อที่ตั้งนี้ได้ ในหน้าออกแบบแบบอสอบถาม)'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip>
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }} >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the collector display name',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Collector display name" />)}
          </Form.Item>

          <Form.Item label="Project:">
            {getFieldDecorator("project_id", {
                rules: [
                  { required: false, type: "number", message: 'Please select a Project', whitespace: true },
                ],
            })(
              <Select onChange={this.onSelectChange} placeholder="Please select a Project">
                { this.props.listProjects.map((project: any) => <Select.Option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}</Select.Option> )}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Collector Type:">
            {/* <Input className="wds-input wds-input--md wds-input--stretched" disabled={true} value={this.props.collectorType} /> */}
            {/* <label style={{ fontWeight: 500, fontSize: 16 }}>Type :</label> */}
            <label>{this.props.collectorType}</label>
          </Form.Item>

          <footer className="wds-modal__foot">
            <div className="wds-modal__actions-right">
              <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newCollector" onClick={this.check}>
                CREATE COLLECTOR
              </Button>
            </div>
          </footer>
        </div>
      );
    }
  }
  
const CollectorCreateForm = Form.create<Props>()(CreateForm);
export default CollectorCreateForm;
