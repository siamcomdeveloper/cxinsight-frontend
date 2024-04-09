import React from 'react';
import * as toastr from 'toastr';
import { Row, Col, Icon, Table, Button } from "antd";
import { History } from 'history';
import { ColumnProps } from 'antd/lib/table';
import BaseService from '../service/base.service';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import HeaderSurvey from '../common/header';

interface IProps { 
    history: History;
    //Map properties match
    match:{ 
        isExact: boolean
        params: {
            xSite: string
            // id:string
        },
        path: string,
        url: string,
    }
}

interface IState {
    isLoading: boolean,
    data: [],
    totalData: number,
    pagination: {},
    loading: boolean,
}

export default class Admin extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            totalData: 0,
            pagination: {},
            loading: false,
        }
    }

    public async componentDidMount() {

        try{
            // console.log('Admin componentDidMount');

            const jwtToken = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
            if(!jwtToken) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            let authorized = false;
            const userData = jwt.decode(jwtToken) as any;
            if(!userData) this.props.history.push(`/${this.props.match.params.xSite}/login`);

            if( [1].includes(userData.ro) ) authorized = true;
            
            if(!authorized){ this.props.history.push(`/${this.props.match.params.xSite}`); return; }

            BaseService.get(this.props.match.params.xSite ,"/user/", 'list', jwtToken).then(
                (rp) => {
                    try{
                        if (rp.Status) {
                        // console.log('getJSON', rp.Data.result.recordset);
                        // console.log('getJSON', rp.Data.result.recordset.length);
                            // this.setState({ collectorStatus: rp.Data.result.recordset[0].name });
                            // const pagination = { total: rp.Data.result.recordset.length, ...this.state.pagination };
                            const pagination = { total: rp.Data.result.recordset.length, pageSize: rp.Data.result.recordset.length, hideOnSinglePage: true };
                            // console.log('pagination', pagination);
                            // Read total count from server
                            // pagination.total = data.totalCount;
                            // pagination.total = 200;

                            this.setState({
                                loading: false,
                                data: rp.Data.result.recordset,
                                pagination,
                                totalData: rp.Data.result.recordset.length,
                            });
                            // toastr.success('Loadding Completed!');
                            // this.setState({ loading: false });
                            // this.history.push('/collectors/'+this.state.survey.id);
                            // window.location.reload();
                        } else {
                            // toastr.error(rp.Messages);
                            toastr.error('Something went wrong!, please refresh the page or try again later.');
                            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `admin componentDidMount BaseService.get /user/list else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                            this.setState({ loading: false });
                        }
                    } catch(error){
                        // toastr.error(rp.Messages + ' - something went wrong!');
                        this.setState({ loading: false });
                        toastr.error('Something went wrong!, please refresh the page or try again later.');
                        BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `admin componentDidMount BaseService.get /user/list catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
                    }
                }
            );
        }catch(error){
            toastr.error('Something went wrong!, please refresh the page or try again later.');
            BaseService.post(this.props.match.params.xSite, "/frontendlog/", { method: `admin componentDidMount catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
        }
    }

    handleUser = (id: any) => {
      // console.log(`handleUser id ${id}`);
        this.props.history.push(`/${this.props.match.params.xSite}/user/${id}`);
        // this.setState({ 
        //     isLoadingSubmit: true,
        //     visibleMessageModal: false,
        //     visibleCollectorModal: false,
        // });
        // const jwt = getJwtToken();
        // const obj = { 
        //     survey_id: this.state.survey.id,
        //     collector_id: this.state.collector.id,
        //     type_id: this.state.collector.type,
        //     id: id
        // }
    };

    render() {

        const columns: ColumnProps<never>[] = [
            {
                title: 'EMAIL',
                dataIndex: 'email',
                // sorter: true,
                sorter: (a: { email: string }, b: { email: string }) => a.email.length - b.email.length,
                width: '45%',
            },
            {
                title: 'FIRST NAME',
                dataIndex: 'first_name',
                width: '15%',
                sorter: (a: { first_name: string }, b: { first_name: string }) => a.first_name.length - b.first_name.length,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'LAST NAME',
                dataIndex: 'last_name',
                sorter: (a: { last_name: string }, b: { last_name: string }) => a.last_name.length - b.last_name.length,
                // sorter: true,
                width: '15%',
            },
            {
                title: 'ROLE',
                dataIndex: 'role_id',
                width: '15%',
                render: (role_id: any) => role_id === 1 ? 'Admin' : (role_id === 2 ? 'Creator' : (role_id === 3 ? 'Subscriber' : (role_id === 4 ? 'Superuser' : 'No role') ) ),
                filters: [
                    { value: '0', text: 'No role' },
                    { value: '1', text: 'Admin' },
                    { value: '2', text: 'Creator' },
                    // { value: '3', text: 'Subscriber' },
                    // { value: '4', text: 'Superuser' },
                ],
                onFilter: (value: any, record: { role_id: any }) => record.role_id === parseInt(value),
            },
            {
                title: 'CONFIRMED',
                dataIndex: 'confirmed',
                //   width: '10%',
                render: (confirmed: any) => confirmed === 1 ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>,
                filters: [
                    { value: '0', text: 'NO' },
                    { value: '1', text: 'YES' },
                ],
                onFilter: (value: any, record: { confirmed: any }) => record.confirmed === parseInt(value),
            },
            {
                title: 'APPROVED',
                dataIndex: 'approved',
                //   width: '10%',
                render: (approved: any) => approved === 1 ? <Icon type="check-circle" style={{ fontSize: '16px', color: 'green' }}/> : <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }}/>,
                filters: [
                    { value: '0', text: 'NO' },
                    { value: '1', text: 'YES' },
                ],
                onFilter: (value: any, record: { approved: any }) => record.approved === parseInt(value),
            },
            // {
            //     title: 'CUSTOM GROUP',
            //     dataIndex: 'custom_group',
            //     sorter: (a: { custom_group: string }, b: { custom_group: string }) => a.custom_group.length - b.custom_group.length,
            //     // sorter: true,
            //     // width: '5%',
            // },
            // {
            //     title: 'SENT',
            //     dataIndex: 'sent',
            //     // width: '5%',
            //     render: (sent: any) => sent ? 'YES' : 'NO',
            //     filters: [
            //         { text: 'YES', value: '1' },
            //         { text: 'NO', value: '0' }
            //     ],
            //     onFilter: (value: any, record: { sent: any }) => record.sent === parseInt(value),
            // },
            // {
            //   title: 'RESPONDED',
            //   dataIndex: 'responded_name',
            // //   width: '10%',
            //   filters: [
            //     { text: 'No', value: 'No' },
            //     { text: 'Complete', value: 'Complete' },
            //     { text: 'Partial', value: 'Partial' },
            //   ],
            //   onFilter: (value: any, record: { responded_name: any }) => record.responded_name.indexOf(value) === 0,
            // },
            {
                title: 'ACTION',
                key: 'action',
                // width: '10%',
                render: (text, record: any) => (
                    <span style={{ textAlign: 'center' }}>
                        {/* <Popconfirm title="Sure to send invite?" onConfirm={() => this.handleUser(record.id)}> */}
                            {/* <Button>Invite</Button> */}
                            <Button type="primary" icon="edit" size={'small'} onClick={() => this.handleUser(record.id)}/>
                            {/* <a>Invite</a> */}
                        {/* </Popconfirm> */}
                        {/* &nbsp; */}
                        {/* <Divider type="horizontal" /> */}
                        {/* <Divider type="vertical" /> */}
                        {/* <br></br> */}
                        {/* <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                            <Button>Delete</Button>
                            <Button type="danger" icon="delete" size={'small'} />
                            <a>Delete</a>
                        </Popconfirm> */}
                    </span>
                ),
            },
        ];

        return (

            <div>

                <HeaderSurvey menuKey={''} history={this.props.history} match={this.props.match}/>
                
                <Row type="flex" justify="center" align="middle" style={{ padding: 20 }}>
                    <Col span={24} xs={24} md={24} lg={24}>
                        {/* <div className="site-card-border-less-wrapper">
                            <Card bordered={true} style={{ width: 350, marginTop: 50, marginBottom: 50}}>
                                <div style={{ textAlign: 'center' }}>
                                    <img style={{ width: '150px' }} src="https://dl.dropboxusercontent.com/s/nmt9tk5mox7a5nj/ICON%20ANALYTICS_New.png?dl=0" alt="ICONSURVEY"/>
                                </div>
                                <RegisterForm handleHistoryPush={this.handleHistoryPush}></RegisterForm>
                            </Card>
                        </div> */}
                        <div className="accordion options">
                            <div className="key open" style={{ maxHeight: '100%', borderTop: '1px solid lightgray' }}>
                                <header>
                                    <h3>
                                        <a style={{cursor: 'default'}} className="keyOpener">
                                            <b>ALL USERS</b>
                                        </a>
                                    </h3>
                                </header>

                                <section id="panel-all-recipients" style={{ height: 'auto' }}>
                                    <Table
                                        style={{ marginTop: '40px' }}
                                        columns={columns}
                                        // locale={{ emptyText: <Empty description={<span> No Users </span>}/> }}
                                        // size="middle"
                                        // rowKey={record => record.login.uuid}
                                        rowKey="id"
                                        dataSource={this.state.data}
                                        pagination={this.state.pagination}
                                        loading={this.state.loading}
                                        // onChange={this.handleTableChange}
                                        footer={() => 'USERS: '+ this.state.totalData}
                                    />
                                </section>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}