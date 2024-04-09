/* eslint-disable import/first */
import * as React from "react";
// import Surveys from '../../models/surveys';
import { Form, Input, Button, Select, Radio, Tooltip, Icon } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { FormComponentProps } from "antd/lib/form";
// import ReactDOM from "react-dom";
// const { Option } = Select;

// const formItemLayout = {
//     labelCol: { span: 4 },
//     wrapperCol: { span: 24 },
// };
// const formTailLayout = {
//     labelCol: { span: 4 },
//     wrapperCol: { span: 8, offset: 4 },
// };

interface Props extends FormComponentProps{
  // surveys: Surveys;
  surveyProjects: any,
  surveyTouchpoint: string;
  surveyTouchpointId: string;
  onFieldValueChange: (fieldName: any, value: any) => void;
  onSave: () => void;
}
interface IState{
  surveyLang: any;
  // surveyTouchpoint: string;
  // surveyTouchpointId: string;
}

class CreateForm extends React.Component<Props, IState, any> {

    constructor(props: Props & FormComponentProps) {
      super(props);
      this.state = {
        surveyLang: "0"
      }
      // console.log('constructor', props);

      // this.state = {
      //     // surveys: {
      //     //     name: '',
      //     //     template_id: '',
      //     // },
      //     surveyTouchpoint: this.props.surveyTouchpoint,
      //     surveyTouchpointId: this.props.surveyTouchpointId
      // }
    }

    async componentDidMount() { 

      try{
        // console.log('CreateForm componentDidMount surveyProjects', this.props.surveyProjects);

        // let nodeProjectOption = new Array<any>(this.props.surveyProjects.length);
        // for(let i = 0; i < nodeProjectOption.length; i++) { nodeProjectOption[i] = ''; }
        
        // const nodeProjectOptionElement = nodeProjectOption.map((obj, i) => this.getPageOptionRow(this.props.surveyProjects[i]));
        // let allProjectElement = await Promise.all(nodeProjectOptionElement);

        // console.log('allProjectElement', allProjectElement);

        //render project dropdown page option
        // ReactDOM.render(allProjectElement, document.getElementById("projects-selection"));
        // console.log(this.props);
        // console.log(this.props.surveyTouchpoint);
        // console.log(this.props.surveyTouchpointId);
        // this.setState({
        //     surveyTouchpoint: this.props.surveyTouchpoint,
        //     surveyTouchpointId: this.props.surveyTouchpointId
        // });

        // console.log(this.state.surveyTouchpoint);
        // console.log(this.state.surveyTouchpointId);
        // this.props.form.setFieldsValue({
        //   name: this.props.surveys.name,
        //   template_id: this.state.surveyTouchpoint
        // }, () => console.log('after'));
        // console.log('before');

        // this.props.form.setFieldsValue({
        //   multi_lang: this.state.surveyLang,
        // }, () => console.log('after'));
      }
      catch(error){
        toastr.error('Something went wrong!, please refresh the page or try again later.');
      // console.log('error', error);
      }

    }

    getPageOptionRow = (project: any) => {
        // return (<option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}. </option>);
        return (<Select.Option key={'project-'+project.id} value={project.id} className="user-generated">{project.name}</Select.Option>);
    }

    // componentWillReceiveProps(props: any) {
    //   // console.log('CreateForm componentWillReceiveProps', props);
    //     // console.log(this.state);
    //     // this.setState({
    //     //     surveyTouchpoint: props.surveyTouchpoint,
    //     //     surveyTouchpointId: props.surveyTouchpointId
    //     // });
    //     // this.props.form.setFieldsValue({
    //     //   // name: this.props.surveys.name,
    //     //   template_id: this.props.surveyTouchpoint
    //     // }, () => console.log('after'));
    //     // console.log('before');
    // }
    
    // state = {
    //   checkNick: false,
    // };
  
    check = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
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
      this.props.onFieldValueChange(e.target.id, e.target.value);
    }
    
    // onSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    //     const element = event.target as HTMLSelectElement;
    //   // console.log('element', element);
    // }
    onSelectChange = (projectId: any)=> {
      // console.log('e', e);
      // console.log('e.target', e.target);
      // console.log('e.target.id', e.target.id);
      // console.log('e.target.value', e.target);
      this.props.onFieldValueChange('project_id', projectId);
    }

    // onSelectSurveyLangChange = (lang: any)=> {
    //   // console.log('e', e);
    //   // console.log('e.target', e.target);
    //   // console.log('e.target.id', e.target.id);
    //   // console.log('e.target.value', e.target);
    //   this.props.onFieldValueChange('multi_lang', lang);
    // }
    // onChangeNum = (e: React.ChangeEvent<HTMLInputElement>)=> {
    //   this.props.onChange(e.target.id, parseInt(e.target.value))
    // }
  
    // handleSelectChange = (status: any) => {
    // // console.log(`handleSelectChange`, status);

    //   this.props.onChange('template_id', status, status);
    //   // this.props.onChange('template_id', parseInt(status));
    //   this.setState({
    //       surveyTouchpointId: status
    //     }
    // );
  // };

    // onChangeSurveyLang = (e: RadioChangeEvent) => {
    //     // console.log('onChangeSurveyLang checked', e.target.value);
    //     this.setState({
    //         surveyLang: e.target.value,
    //     }, () => {
    //       // console.log('after this.state.surveyLang', this.state.surveyLang);
    //       this.props.onFieldValueChange('multi_lang', this.state.surveyLang);
    //     });
    // };

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <Form.Item style={{ paddingBottom: 0 }} >
            <label className="label-create">Display name: </label>
            
            {/* <Tooltip title={'ผู้ทำแบบสอบถามจะเห็นชื่อที่ต้ังนี้'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}

            {/* <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} 
                title={`ผู้ทำแบบสอบถามจะเห็นชื่อที่ต้ังนี้

                + ผู้ใช้งานระบบสามารถใส่ ตัวแปร สำหรับแสดงผลข้อมูลได้ดังนี้
                - ชื่อโครงการ : \${ProjectName}
                - ชื่อช่องทางจัดเก็บ : \${CollectorName}
                - ชื่อ (ผู้ทำแบบสอบถาม) : \${FirstName}
                - นามสกุล (ผู้ทำแบบสอบถาม) : \${LastName}

                * โดยระบบจะดึงข้อมูลจากช่องทางการจัดเก็บ (Collector)
                ตามที่ผู้ใช้งานระบบได้ตั้งค่าไว้แทน ตัวแปร ข้างต้น`}>
                <Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/>
            </Tooltip>  */}
            
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }} >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input the survey display name',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey display name" />)}
          </Form.Item>

          <Form.Item  style={{ paddingBottom: 0 }} >
            {/* <label className="label-create">Nickname: </label><Tooltip title={'ผู้ใช้งานระบบเท่านั้นที่จะเห็นชื่อที่ต้ังนี้'}><Icon type="question-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
            <label className="label-create">Nickname: </label>
          </Form.Item>
          <Form.Item style={{ paddingTop: 0 }}>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: 'Please input the survey nickname',
                },
              ],
            })(<Input className="wds-input wds-input--md wds-input--stretched" onChange={this.onChange} placeholder="Survey nickname" />)}
          </Form.Item>

          {/* <Form.Item label="Location:">
            {getFieldDecorator("project_id", {
                rules: [
                  { required: true, message: 'Please select a location', whitespace: true,},
                ],
            })(
              <Select onChange={this.onSelectChange} placeholder="Please select a location">
                { this.props.surveyProjects.map((item: any) => <Select.Option key={item.id} value={`${item.id}`}>{item.name}</Select.Option> )}
              </Select>
            )}
          </Form.Item> */}

          {/* <Form.Item label="Survey Language:">
            {getFieldDecorator("multi_lang", {
                rules: [
                  { required: true, message: 'Please select the survey language', whitespace: true,},
                ],
            })(
              <Radio.Group buttonStyle="solid" onChange={this.onChangeSurveyLang}>
                <Radio.Button value="0">Single Language</Radio.Button>
                <Radio.Button value="1">Multiple Languages</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item> */}

          {/* <Form.Item label="Survey Language:">
            {getFieldDecorator("multi_lang", {
                rules: [
                  { required: true, message: 'Please select the survey language', whitespace: true,},
                ],
            })(
              <Select onChange={this.onSelectSurveyLangChange} placeholder="Please select the survey language">
                  <Select.Option value={0}>Single Language</Select.Option>
                  <Select.Option value={1}>Multiple Languages</Select.Option>
              </Select>
            )}
          </Form.Item> */}
          
          {/*           
          <Form.Item label="Touchpoint" {...formItemLayout} >
            <Input className="wds-input wds-input--md wds-input--stretched" disabled={true} value={this.props.surveyTouchpoint} />
          </Form.Item> */}

          <Form.Item  >
            {/* <Input className="wds-input wds-input--md wds-input--stretched" disabled={true} value={this.props.collectorType} /> */}
            <label style={{ fontWeight: 500, fontSize: 16 }}>Template :</label><label style={{ fontSize: 16 }}> {this.props.surveyTouchpoint}</label>
          </Form.Item>

          {/* 
          <div className="thePage">
              <label>Page</label>
              <div className="sm-input sm-input--select sm-input--sm">
                  <select value={this.state.moveToPageOption} id={"question-"+this.state.question.order_no+"-dropdown-move-page-option"} className="movePage no-touch" onChange={ (e) => this.setMoveToPageHandler(e) }></select>
              </div>
          </div> */}

          {/* <Form.Item {...formItemLayout} >
            {
              <Select disabled={true} id="template_id" defaultValue={this.state.surveyTouchpoint} onChange={this.handleSelectChange}>
                <Option value="0">Start from scratch</Option>
                <Option value="1">Standard Questions Survey Template</Option>
                <Option value="2">Customer Satisfaction Survey Template</Option>
                <Option value="3">Net Promoter® Score (NPS) Survey Template</Option>
                <Option value="4">Customer Service Survey Template</Option>
              </Select>
            }
          </Form.Item> */}

          

          {/* <Form.Item {...formItemLayout} label="Description">
            {getFieldDecorator('template_id', {
              rules: [
                {
                  required: this.state.checkNick,
                  message: 'Please input the description',
                },
              ],
            })(<Input onChange={this.onChange} placeholder="Please input the description" />)}
          </Form.Item> */}
          {/* <Form.Item {...formTailLayout}>
            <Checkbox checked={this.state.checkNick} onChange={this.handleChange}>
            Description is required
            </Checkbox>
          </Form.Item> */}
          {/* <Form.Item {...formTailLayout}>
            <Button type="primary" onClick={this.check}>
              Submit
            </Button>
          </Form.Item> */}
          <footer className="wds-modal__foot">
            <div className="wds-modal__actions-right">
              <Button type="primary" className="wds-button wds-button--primary wds-button--solid wds-button--md" id="newSurvey" onClick={this.check}>
                CREATE SURVEY
              </Button>
            </div>
          </footer>
        </div>
      );
    }
  }
  
const SurveyCreateForm = Form.create<Props>()(CreateForm);
export default SurveyCreateForm;
