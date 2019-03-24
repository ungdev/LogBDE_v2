import React,{Component} from 'react';
import 'antd/dist/antd.css';
import { Layout,Menu,Icon,Badge } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Items } from '/imports/collections/Collections.js'

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class MainLayout extends TrackerReact(Component){

  constructor(props){
    super(props)
  }

  renderAdmin(){
    if(!Roles.userIsInRole(Meteor.userId(),'admin','bde'))
      return null
    return(
      <SubMenu key = "admin" title={<span ><Icon type="setting" />Panel Admin</span>}>    
          <Menu.Item key="admin:1"><a href="/admin-users" ><Icon type="user" />Users</a></Menu.Item>
          <Menu.Item key="admin:2"><a href="/gestion-emprunt" ><Icon type="shop" />Assos</a></Menu.Item>     
      </SubMenu>
    )
  }



  renderAssos(){
    let assos = Roles.getGroupsForUser(Meteor.userId(),'admin')
    if(assos.length == 0)
      return null
    return assos.map(asso =>{
      let nbRetour = 0
      let nbEmprunt = 0
      let items = Items.find({ asso: asso }).fetch()
      for(let item of items){
        for(let reservation of item.reservedBy){
          if(reservation.isValide){
            nbRetour++
            continue
          }       
          let days = moment(reservation.startDate,'DD/MM/YYYY').diff(moment(),'days')
          if( days <= 7 && days > -1 && !reservation.isValide){
            nbEmprunt++
          }
        }
      }
      let showDot = (nbRetour+nbEmprunt) > 0 
      return(
        
        <SubMenu key = {asso} title={<span className="submenu-title-wrapper"><Icon type="shop" /><Badge key = {"badge"+asso} dot={showDot}>{asso}</Badge></span>}>
        <MenuItemGroup>
          <Menu.Item key={asso+":1"}>
            
              <a href={"/gestion-retour/"+asso} ><Badge count={nbRetour}><Icon type="rollback" />Retour</Badge></a>
            
          </Menu.Item>
          <Menu.Item key={asso+":2"}><a href={"/gestion-emprunt/"+asso} ><Badge count={nbEmprunt}><Icon type="edit" />Emprunt</Badge></a></Menu.Item>
        </MenuItemGroup>
        <Menu.Divider title="----"/>
          <Menu.Item key={asso+":3"}><a href={"/gestion-inventaire/"+asso} ><Icon type="dashboard" />Inventaire</a></Menu.Item>
          <Menu.Item key={asso+":4"}><a href={"/gestion-users/"+asso} ><Icon type="user" />Gestion</a></Menu.Item>
      </SubMenu>
      
      )
    })
  }

  render(){
    return(
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => { console.log(broken); }}
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          width = {250}
        >
    <div className="logo" />
    <Menu theme="dark" mode="inline"  >
      <Menu.Item key="homepage" >
          <a href="/" ><Icon type="eye" />Mes Emprunts et Reservations</a>
      </Menu.Item>
      <Menu.Item key="new">
              <a href="/new" ><Icon type="form" />Nouvelle demande</a>
      </Menu.Item>     
      {this.renderAssos()}
      {this.renderAdmin()}
      <Menu.Item style = {{float:"right"}} key="user">
          {Meteor.user() ?<a href="javascript:Meteor.logout()" ><Icon type="close" />Sign-Out</a>:<a href="javascript:Meteor.loginWithUtt()" ><Icon type="user" />Sign-In</a>}    
      </Menu.Item>
    </Menu>
  </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {
              Meteor.user() ? this.props.content : <h1><a href="javascript:Meteor.loginWithUtt();">Cliquez pour vous connecter</a></h1>
            }         
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
    )
  }
}
