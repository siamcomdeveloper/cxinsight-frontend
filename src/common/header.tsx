import * as React from 'react'; 
// import { Link } from "react-router-dom";
// import { Layout, Menu, Button, Icon, Dropdown, Drawer } from 'antd';
import { Menu, Button, Icon, Dropdown, Drawer } from 'antd';
import 'antd/dist/antd.css';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import logo from '../logo.svg';

const { SubMenu } = Menu;
// const { Header } = Layout;

interface IProps { 
  history: History;
  menuKey: any;
  match:{ 
      isExact: boolean
      params: {
          xSite: string
      },
      path: string,
      url: string,
  }
}

// export const HeaderSurvey: React.FC = () => {
  
class HeaderSurvey extends React.Component<IProps> {

  constructor(props: IProps) {
      super(props);
  }

  state = {
    visible: false,
    userId: 0,
    userEmail: '',
    reportAuthorized: true,
    adminAuthorized: false,
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
      this.setState({
        visible: false,
      });
    };

  // handleClick = (e: { key: any; }) => {
  // // console.log('click ', e);
  //   this.setState({
  //     current: e.key,
  //   });
  // };

  showSurveyMenu = () => {
    if(this.props.menuKey === 'survey'){
      return (
          <li className={this.props.menuKey === 'survey' ? 'current' : ''} style={{ marginRight: '35px' }}>
            <a href={"# "} className="" style={{ marginRight: '0', fontWeight: 'bold' }}>
              Survey
            </a>
          </li>
      );
    }
  };

  // showMobileSurveyMenu = (reportAuthorized: any) => {
  //   if(this.props.menuKey === 'survey'){
  //     return (
  //         <Menu.Item key="survey" className={ reportAuthorized ? "dashboard-menu-drawer" : 'hidden' } style={{ marginTop: '0', paddingBottom: '45px' }}>
  //           <a href={"# "}>Executive Report</a>
  //         </Menu.Item>
  //     );
  //   }
  // };

  signOut = () => {
      // console.log("signOut click");
      localStorage.removeItem('iconcxmuser');
      this.props.history.push(`/${this.props.match.params.xSite}/login`);
  }

  public async componentDidMount() {
    
      const token = await refreshJwtToken(this.props.match.params.xSite, getJwtToken());
      if(!token) this.props.history.push(`/${this.props.match.params.xSite}/login`);

      const userData = jwt.decode(token) as any;
      if(userData){
          this.setState({
              userId: userData.id,
              userEmail: userData.email,
              reportAuthorized: (userData.ro === 3 && !userData.rs) ? false : true,
              adminAuthorized: userData.ro === 1 ? true : false
          });
      }

  } 

  render() {
    
    const menu = (id: any, selectKey: any) => (
      <Menu selectedKeys={[selectKey]}>
          {/* <Menu.Item key="account">
              <Link to={"/edit/" + id}><Icon type="edit" />  Edit</Link>
              <a href={`/cxm/platform/${this.props.match.params.xSite}/account/${id}`}><Icon type="user" /> My Account</a>
          </Menu.Item> */}
          { this.state.adminAuthorized &&
             (<Menu.Item key="admin">
                <a href={`/cxm/platform/${this.props.match.params.xSite}/admin`}><Icon type="user" /> Manage Account</a>
              </Menu.Item>)
          }
          
          <Menu.Item key="signout">
              {/* <Link to={"#"} onClick={()=>Del(Number(id))}><Icon type="delete" />  Delete</Link> */}
              {/* <a href={`/cxm/platform/${this.props.match.params.xSite}/signout/${id}`}><Icon type="logout" /> Sign Out</a> */}
              <a  href="# " onClick={()=>this.signOut()}><Icon type="logout" /> Sign Out</a>
          </Menu.Item>
      </Menu>
    );

    return (
      
        <div className="base-header auth-header language-en" id="hd">
          <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
            <span className="barsBtn"></span>
          </Button>
          <div className="inner-header clearfix">

            <div className="responsive-logo" style={{ marginTop: '0' }}>
              <a href={`/cxm/platform/${this.props.match.params.xSite}/`}>
                {/* <img id="png_logo" style={{ width: '50px' }} className="img" src="https://dl.dropboxusercontent.com/s/7igyt4ubkmibqp9/60x60bb.png?dl=0" alt="ICONSURVEY"/> */}
                {/* <img id="png_logo" style={{ width: '65px', marginTop: '-8px' }} className="img" src="https://dl.dropboxusercontent.com/s/0vgfa8a06s06aaj/icon.png?dl=0" alt="ICONSURVEY"/> */}
                {/* <img id="png_logo" style={{ width: '85px', marginTop: '-15px' }} className="img" src="https://dl.dropboxusercontent.com/s/nmt9tk5mox7a5nj/ICON%20ANALYTICS_New.png?dl=0" alt="ICONSURVEY"/> */}
                <img id="png_logo" style={{ width: '70px' }} className="img" src={logo} alt="ICONSURVEY"/>
              </a>
            </div>

            <Drawer
              // title={this.state.userEmail}
              className="header-drawer"
              placement="left"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
            >
              <Menu mode="inline" selectedKeys={[this.props.menuKey]}>
                <SubMenu title={this.state.userEmail}>
                  {/* <Menu.Item key="account">
                    <a href={`/cxm/platform/${this.props.match.params.xSite}/account/${this.state.userId}`}><Icon type="user" /></a>
                  </Menu.Item> */}
                  <Menu.Item key="signout">
                    <a  href="# " onClick={()=>this.signOut()}><Icon type="logout" /> Sign Out</a>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="dashboard" className="dashboard-menu-drawer" style={{ marginTop: '0', paddingBottom: '45px' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/dashboard/`}>Dashboard</a>
                </Menu.Item>
                {/* {this.showMobileSurveyMenu(this.state.reportAuthorized)} */}
                {/* <Menu.Item key="executive-report" className={this.state.reportAuthorized ? "dashboard-menu-drawer" : 'hidden'} style={{ marginTop: '0', paddingBottom: '45px' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/executive-report/`}>Executive Report</a>
                </Menu.Item> */}
                {/* <Menu.Item key="project-summary-report" className={this.state.reportAuthorized ? "dashboard-menu-drawer" : 'hidden'} style={{ marginTop: '0', paddingBottom: '45px' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/project-summary-report/`}>Project Summary Report</a>
                </Menu.Item>
                <Menu.Item key="trend-report" className={this.state.reportAuthorized ? "dashboard-menu-drawer" : 'hidden'} style={{ marginTop: '0', paddingBottom: '45px' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/trend-report/`}>Trend Report</a>
                </Menu.Item> */}
                <Menu.Item key="create" className="dashboard-menu-drawer" style={{ marginTop: '0', paddingBottom: '45px', borderBottom: '0  ' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/create/`} className="create-survey alt btn SL_split" style={{ fontSize: '12px' }}>CREATE SURVEY</a>
                </Menu.Item>
              </Menu>
            </Drawer>

            <ol className="nav clearfix">
              <li className={this.props.menuKey === 'dashboard' ? 'current' : ''} style={{ marginRight: '35px' }}>
                <a href={`/cxm/platform/${this.props.match.params.xSite}/dashboard/`} className="first-item" style={{ marginRight: '0', fontWeight: 'bold' }}>
                  Dashboard
                </a>
              </li>
              {this.showSurveyMenu()}
              {/* <li className={ this.state.reportAuthorized ? (this.props.menuKey === 'executive-report' ? 'current' : '') : 'hidden'} style={{ marginRight: '35px' }}>
                <a href={`/cxm/platform/${this.props.match.params.xSite}/executive-report/`} className="" style={{ marginRight: '0', fontWeight: 'bold' }}>
                  Executive Report
                </a>
              </li> */}
              {/* <li className={ this.state.reportAuthorized ? (this.props.menuKey === 'project-summary-report' ? 'current' : '') : 'hidden'} style={{ marginRight: '35px' }}>
                <a href={`/cxm/platform/${this.props.match.params.xSite}/project-summary-report/`} className="" style={{ marginRight: '0', fontWeight: 'bold' }}>
                  Project Summary Report
                </a>
              </li>
              <li className={ this.state.reportAuthorized ? (this.props.menuKey === 'trend-report' ? 'current' : '') : 'hidden'} style={{ marginRight: '35px' }}>
                <a href={`/cxm/platform/${this.props.match.params.xSite}/trend-report/`} className="" style={{ marginRight: '0', fontWeight: 'bold' }}>
                  Trend Report
                </a>
              </li> */}
              
            </ol>
          
            <div className="actions">
            
            <div>
              {/* <a href={`/cxm/platform/${this.props.match.params.xSite}/create/`} className="create-survey alt btn SL_split">CREATE SURVEY</a> */}
              </div>
              <ol className="user-area">
                <li className="has-submenu" id="dd-my-account">
                  <Dropdown overlay={menu(1,this.props.menuKey)} trigger={['click']}>
                    <a href="# " id="userAcctTab_MainMenu" className="hd arrow-down ext notranslate">
                      {this.state.userEmail}
                    </a>
                  </Dropdown>
                  {/* <ul className="nav-submenu">
                    <li><a href="/user/account/">My Account</a></li>
                    <li className="last"><a href="/user/sign-out/">Sign Out</a></li>
                  </ul> */}
                </li>

                <li>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/create/`} className="create-survey alt btn SL_split">CREATE SURVEY</a>
                </li>
              </ol>
            
            </div>
            
          </div>
      </div>

      /*
      <Header>
        <a href={`/cxm/platform/${this.props.match.params.xSite}/`} className="logo">
          <img className="img" src="https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/10/82/f5/1082f5e8-63b4-159a-01fe-504a2f575352/source/60x60bb.jpg" alt="ICONCRM"/>
        </a>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['dashboard']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="dashboard">
            <Link to={'/'} className="nav-link">Dashboard</Link>
          </Menu.Item>

          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="user" />
                User : Siam
              </span>
            }
            style={{ float: 'right' }}
          >
            <Menu.Item key="setting:1">My Account</Menu.Item>
            <Menu.Item key="setting:2">Library</Menu.Item>
            <Menu.Item key="setting:3">Contacts</Menu.Item>
            <Menu.Item key="setting:4">Sign Out</Menu.Item>
          </SubMenu>

          <Menu.Item style={{ float: 'right' }}>
            <Button type="primary">
                CREATE SURVEY
            </Button>
          </Menu.Item>

        </Menu>
      </Header>
      */
    
    );
  }
}

export default HeaderSurvey;
