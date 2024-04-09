import * as React from 'react'; 
import { Menu, Button, Icon, Dropdown, Drawer } from 'antd';
import 'antd/dist/antd.css';
import { History } from 'history';
import jwt from 'jsonwebtoken';
import { getJwtToken, refreshJwtToken } from '../helper/jwt.helper';
import logo from '../logo.svg';

const { SubMenu } = Menu;

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

  signOut = () => {
      localStorage.removeItem('cxmuser');
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
          { this.state.adminAuthorized &&
             (<Menu.Item key="admin">
                <a href={`/cxm/platform/${this.props.match.params.xSite}/admin`}><Icon type="user" /> Manage Account</a>
              </Menu.Item>)
          }
          
          <Menu.Item key="signout">
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
                <img id="png_logo" style={{ width: '70px' }} className="img" src={logo} alt="ICON"/>
              </a>
            </div>

            <Drawer
              className="header-drawer"
              placement="left"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
            >
              <Menu mode="inline" selectedKeys={[this.props.menuKey]}>
                <SubMenu title={this.state.userEmail}>
                  <Menu.Item key="signout">
                    <a  href="# " onClick={()=>this.signOut()}><Icon type="logout" /> Sign Out</a>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="dashboard" className="dashboard-menu-drawer" style={{ marginTop: '0', paddingBottom: '45px' }}>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/dashboard/`}>Dashboard</a>
                </Menu.Item>
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
            </ol>
          
            <div className="actions">
            
            <div>
              </div>
              <ol className="user-area">
                <li className="has-submenu" id="dd-my-account">
                  <Dropdown overlay={menu(1,this.props.menuKey)} trigger={['click']}>
                    <a href="# " id="userAcctTab_MainMenu" className="hd arrow-down ext notranslate">
                      {this.state.userEmail}
                    </a>
                  </Dropdown>
                </li>

                <li>
                  <a href={`/cxm/platform/${this.props.match.params.xSite}/create/`} className="create-survey alt btn SL_split">CREATE SURVEY</a>
                </li>
              </ol>
            
            </div>
            
          </div>
      </div>
    );
  }
}

export default HeaderSurvey;
