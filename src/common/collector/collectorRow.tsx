import React from 'react';
import Collector from "../../models/collector";  
// import Surveys from '../../models/surveys';  
import BaseService from '../../service/base.service';
import { getJwtToken } from '../../helper/jwt.helper';
import * as toastr from 'toastr';   
// import { Menu, Dropdown, Icon, Row, Col } from 'antd';
import { Menu, Select, Dropdown, Icon, Popconfirm, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import { History } from 'history';
// import Surveys from '../../models/surveys';

const { Option, OptGroup } = Select;
// const menu = (id: any) => (
//     <Menu>
//         <Menu.Item key="0">
//             {/* <Link to={"/edit/" + id}><Icon type="edit" />  Edit</Link> */}
//             <a href={`/cxm/platform/${props.match.params.xSite}/edit/${id}`} style={{ textDecoration: 'none' }}><Icon type="edit" /> Edit</a>
//         </Menu.Item>
//         <Menu.Item key="1">
//             {/* <Link to={"#"} onClick={()=>Del(Number(id))}><Icon type="delete" />  Delete</Link> */}
//             <a  href="# " onClick={()=>Del(Number(id))} style={{ textDecoration: 'none' }}><Icon type="delete" />  Delete</a>
//         </Menu.Item>
//     </Menu>
// );

interface IProps { 
    collector: Collector;  
    projectName: string;  
    employeeElement: any;  
    history: History;
    match:{ 
        isExact: boolean
        params: {
            xSite: string
        },
        path: string,
        url: string,
    }
}

const CollectorRow: React.StatelessComponent<IProps> = (props) => { 

    // const collectorURL = ( parseInt(props.collector.type) === 1 || parseInt(props.collector.type) === 4) ? "/collector-link/"+props.collector.id : "/collector-message/"+props.collector.id ;

    let collectorURL = Link();

    const menu = (id: any, typeId: any) => (
        <Menu>
            <Menu.Item key="edit">
                <a  href="# " onClick={()=>window.location.replace(Link())} style={{ textDecoration: 'none' }}><Icon type="edit" /> Edit collector</a>
            </Menu.Item>
            <Menu.Item key="close">
                {/* <Link to={"/edit/" + id}><Icon type="edit" />  Edit</Link> */}
                <Popconfirm
                        title={`Are you sure close this ${props.collector.nickname} collector?`}
                        onConfirm={Close}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a  href="# " style={{ textDecoration: 'none' }}><Icon type="close" /> Close collector</a>
                </Popconfirm>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                        title={`Are you sure delete this ${props.collector.name} collector?`}
                        onConfirm={Del}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                    <a  href="# " style={{ textDecoration: 'none' }}><Icon type="delete" />  Delete collector</a>
                </Popconfirm>
                {/* <Link to={"#"} onClick={()=>Del(Number(id))}><Icon type="delete" />  Delete</Link> */}
            </Menu.Item>
            {/* <Menu.Item key="rename">
                <a  href="# " onClick={()=>Rename(Number(id))} style={{ textDecoration: 'none' }}><Icon type="edit" />  Rename collector</a>
            </Menu.Item> */}
        </Menu>
    );

    const statusMenu = (id: any, typeId: any) => (
        <Menu>
            <Menu.Item key="close">
                <a  href="# " onClick={()=>updateStatus(3)} style={{ textDecoration: 'none' }}><Icon type="close" /> CLOSE </a>
            </Menu.Item>
            <Menu.Item key="open">
                <a  href="# " onClick={()=>updateStatus(2)} style={{ textDecoration: 'none' }}><Icon type="edit" /> OPEN </a>
            </Menu.Item>
            <Menu.Item key="not_configured">
                <a  href="# " onClick={()=>updateStatus(1)} style={{ textDecoration: 'none' }}><Icon type="stop" />  NOT CONFIGURED </a>
            </Menu.Item>
            {/* <Menu.Item key="delete">
                <a  href="# " onClick={()=>this.updateStatus(0, 'DELETED')} style={{ textDecoration: 'none' }}><Icon type="delete" />  DELETE </a>
            </Menu.Item> */}
        </Menu>
    );

    function updateStatus(status: any) {
        // console.log("Close click");
    
        // console.log('before delete params', props.collector);

        const jwt = getJwtToken();
        // BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, this.selectUpdate(props.collector, ['status'], [3]), jwt).then(
        BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, selectUpdate(props.collector, ['survey_id', 'status'], [props.collector.survey_id, status]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        // toastr.success(rp.Messages);
                        toastr.success('Collector updated');
                        setTimeout(function(){ window.location.reload(); }, 500);
                        // props.history.goBack();
                        // window.location.reload();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    
    }

    function Link() {
        // console.log("Link click", props.collector.id);

        let collectorURL = '';
        switch (parseInt(props.collector.type)) {
            case 1: //1 = Weblink
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/weblink/${props.collector.id}`;
                break;
            case 2: //2 = mail
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/email/${props.collector.id}`;
                break;
            default:
                collectorURL = `/cxm/platform/${props.match.params.xSite}/collect/weblink/${props.collector.id}`;
                break;
        }
        
        // console.log(collectorURL);
        return collectorURL;
        // window.location.replace(collectorURL);
    }
      
    function Del() {
        // console.log("Del click");
        const jwt = getJwtToken();
        BaseService.update(props.match.params.xSite, `/collector/delete/`, props.collector.id , selectUpdate(props.collector, ['survey_id', 'status'], [props.collector.survey_id, 3]), jwt).then(
        // BaseService.delete(`/collector/delete/${props.collector.survey_id}/`, ID, jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        toastr.success(rp.Messages);    
                        setTimeout(function(){ window.location.reload(); }, 500);
                    } else { 
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Del BaseService.update /collector/delete/${props.collector.id} catch`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Del BaseService.update /collector/delete/${props.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    }

    function cancel() {
        // console.log(e);
        // message.error('Cancel');
    }
    
    // function Rename(ID:number) {
    //   // console.log("Rename click", ID);
    // }
    
    function Close() {
        // console.log("Close click");
    
        // console.log('before delete params', props.collector);

        const jwt = getJwtToken();
        // BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, this.selectUpdate(props.collector, ['status'], [3]), jwt).then(
        BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, selectUpdate(props.collector, ['survey_id', 'status'], [props.collector.survey_id, 3]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        setTimeout(function(){ window.location.reload(); }, 500);
                        // props.history.goBack();
                        // window.location.reload();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );
    
    }

    function selectUpdate(obj: any, selectKeys: any, params: any) {
        const clone = Object.assign({}, obj);

        // Object.entries(obj).map((e,i) => {
        //   // console.log('e', e);
        //   // console.log('e name', e[0]);
        //   // console.log('e value', e[1]);
        //   // console.log('i', i);
        // })

        // console.log(selectKeys);

        for (const key in props.collector) {
            let matched = false;

            // obj.map((e, i) =>(<div key={i}>{e}</div>))

            selectKeys.forEach((selectKey: any, index: any) => {
                // console.log('index', index);
                if(selectKey === key){
                    matched = true;
                    clone[selectKey] = params[index];
                }
            });
            if(!matched) {
                delete clone[key];
                // console.log('delete!');
            }
        }

        return clone;
    }
      
    // function selectUpdate(){

    //     for (const key in props.collector) {
    //       // console.log(key);
    //         const field = key ? key : '';
    //         delete props.collector.field;
    //     }

    //     // delete props.collector['survey_id'];
    //     // delete props.collector['name'];
    //     // delete props.collector['type'];
        
    //     // props.collector['status'] = 3;//update date here to 3 'Closed'

    //     // delete props.collector['link'];
    //     // delete props.collector['responses'];
    //     // delete props.collector['cutoff'];
    //     // delete props.collector['cutoff_date'];
    //     // delete props.collector['anonymous'];

    //     // delete props.collector['active'];
    //     // delete props.collector['created_at'];
    //     // delete props.collector['modified_at'];
    //     // delete props.collector['deleted_at'];
        
        
    //     // delete props.collector['created_date'];
    //     // delete props.collector['modified_date'];
    // }

    function collectorType(type: any) {
        // console.log('collectorType', type);
        switch (type) {
            case 1: //1 = Web link
            return <Icon type="link" />
            case 2: //2 = mail
            return <Icon type="mail" />
            default:
            return <Icon type="link" />
        }
    }

    function collectorStatus(status: any) {
        // console.log('collectorStatus', status);
        switch (status) {
            case 1: //1 = NOT CONFIGURED
            return <div><span className="sm-badge sm-badge--sm sm-badge--bengal"><a sm-tooltip-side="bottom" href="# " style={{ textDecoration: 'none' }} title="not configured collector">NOT CONFIGURED </a></span> <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none', display: 'inline-block', fontSize: 'initial' }} ><div className="action-icon-holder more-options null" style={{ /*textAlign: 'center'*/ }}><span><Icon type="edit"/></span></div></a></div>
            case 2: //1 = OPEN
            return <div><span className="sm-badge sm-badge--sm "><a sm-tooltip-side="bottom" href="# " style={{ textDecoration: 'none' }} title="Open collector">OPEN</a></span> <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none', display: 'inline-block', fontSize: 'initial' }} ><div className="action-icon-holder more-options null" style={{ /*textAlign: 'center'*/ }}><span><Icon type="edit"/></span></div></a></div>
            case 3: //2 = CLOSED
            default:
            return <div><span className="sm-badge sm-badge--sm sm-badge--charcoal"><a sm-tooltip-side="bottom" href="# " style={{ textDecoration: 'none' }} title="Close collector">CLOSED</a></span> <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none', display: 'inline-block', fontSize: 'initial' }} ><div className="action-icon-holder more-options null" style={{ /*textAlign: 'center'*/ }}><span><Icon type="edit"/></span></div></a></div>
        }
    }
    
    function onChange(value: any) {
        // console.log(`selected ${value}`);

        const jwt = getJwtToken();
        // BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, this.selectUpdate(props.collector, ['status'], [3]), jwt).then(
        BaseService.update(props.match.params.xSite, "/collector/", props.collector.id, selectUpdate(props.collector, ['employee_id'], [value]), jwt).then(
            (rp) => {
                try{
                    if (rp.Status) {
                        // console.log(rp);
                        toastr.success(rp.Messages);
                        // setTimeout(function(){ window.location.reload(); }, 500);
                        // props.history.goBack();
                        // window.location.reload();
                    } else {
                        // toastr.error(rp.Messages);
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    }
                }catch(error){ 
                    toastr.error('Something went wrong!, please refresh the page or try again later.');
                    BaseService.post(props.match.params.xSite, "/frontendlog/", { method: `collectorRow Close BaseService.update /collector/${props.collector.id} catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                }
            }
        );

    }
      
    function onBlur() {
        // console.log('blur');
    }
      
    function onFocus() {
        // console.log('focus');
    }

    function onSearch(val: any) {
        // console.log('search:', val);
    }

    return (

        <tr className="collector-row">
            <td className="email collectorType">
                {collectorType(props.collector.type)}
                {/* <Icon type="mail" /> */}
                {/* <span className="email icon " data-icon="">email</span> */}
            </td>
            <td className="collector-name">
                <b>
                    <a sm-tooltip-side="bottom" className="notranslate" href={collectorURL}>
                        {props.collector.nickname}
                    </a>
                    {/* &nbsp;<Tooltip title={`Display name: ${props.collector.name} (ผู้ทำแบบสอบถามจะเป็นชื่อ Display name นี้)`}><Icon type="info-circle-o"  style={{ color: 'dodgerblue' }}/></Tooltip> */}
                </b>
                <div>
                    <span>Created</span> {props.collector.created_date}
                </div>
            </td>
            <td className="collector-project">
                {props.projectName}
            </td>
            
            { props.match.params.xSite === 'realasset' ?

            <td className="collector-project">
                {/* <Select style={{ width: '100%' }} defaultValue="All Surveys" onChange={handleSelectChange}>
                    <Option value="">All Surveys</Option>
                    <Option value="2">Open Surveys</Option>
                    <Option value="1">Draft Surveys</Option>
                    <Option value="3">Closed Surveys</Option>
                </Select> */}
                {/* <Select
                    showSearch
                    style={{ width: '100%' }}
                    defaultValue={props.collector.employee_id ? props.collector.employee_id : '1'}
                    placeholder="กรุณาเลือกพนักงาน"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input: any, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value="1">Jack</Option>
                    <Option value="2">Lucy</Option>
                    <Option value="3">Tom</Option>
                    <Option value="0552ced8-d500-41a3-8bd7-f669c144ef36">นายนิตินาถ หิรัญ</Option>
                    <Option value="0a16b946-a53a-4006-b62e-c31f2a31f421">นางสาวเสาวคนธ์ สนณรงค์</Option>
                </Select> */}

                {/* { console.log(props.employeeElement) } */}

                <Select
                    showSearch
                    style={{ width: '100%' }}
                    defaultValue={props.collector.employee_id ? props.collector.employee_id : 'กรุณาเลือกพนักงาน'}
                    placeholder="กรุณาเลือกพนักงาน"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input: any, option: any) =>
                        option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                    }
                >
                    { props.employeeElement }
                </Select>
            </td>
            :
                null
            }
            
            <td className="collector-status">
                {/* <Select defaultValue="1">
                    <Option value="1">NOT CONFIGURED</Option>
                    <Option value="2">OPEN</Option>
                    <Option value="3">CLOSED</Option>
                </Select> */}
                {/* {collectorStatus(props.collector.status)} */}
                <Dropdown overlay={statusMenu(props.collector.id, props.collector.type)} trigger={['click']}>
                    {collectorStatus(props.collector.status)}
                </Dropdown>
                {/* <span className="sm-badge sm-badge--sm "><a sm-tooltip-side="bottom" href="# " style={{ cursor: 'default', textDecoration: 'none' }} title="Close collector">{props.collector.status_name}</a></span> */}
            </td>
            <td className="response-count">{props.collector.responses}</td>
            {/* <td className="collector-checkgroup">A</td>
            <td className="collector-condition">
                <Select defaultValue="0">
                    <Option value="0">Redo disable</Option>
                    <Option value="1">Redo enable</Option>
                </Select>
            </td>
            <td className="collector-remlink">{props.collector.rem_lnk ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>}</td> */}
            <td className="datemodified">{props.collector.modified_date}</td>
            <td>
                {/* <a data-icon="." collector-action-menu-253629965="" href="# " data-actionmenu="253629965"></a> */}
                <Dropdown overlay={menu(props.collector.id, props.collector.type)} trigger={['click']}>
                    <a href="# " onClick={e => e.preventDefault()} style={{ textDecoration: 'none' }} >
                        <div className="action-icon-holder more-options null" style={{ textAlign: 'center' }}><span className="action-icon smf-icon" style={{ cursor: 'pointer' }}>.</span></div>
                    </a>
                </Dropdown>
            </td>
        </tr>
    );
};
export default CollectorRow;