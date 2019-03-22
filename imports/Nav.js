import React, { Component } from 'react';
import { Menu, Icon} from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';



const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Nav extends TrackerReact(Component) {
  constructor(props){
    super(props)
    this.state = {
      current: null,
    }
  }
  

  handleClick = (e) => {
    console.log('click ', e);
    if(!Meteor.userId())
    this.setState({
      current: null,
    });
    else
      this.setState({
        current: e.key,
      });
  } 


  renderAdminMenu(){
   
    if(Roles.getGroupsForUser(Meteor.userId(),'admin').length == 0)
      return null
    return(
            <SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />Admin</span>}>
              <MenuItemGroup title="Actions">
                <Menu.Item key="setting:1"><a href="/gestion-retour" ><Icon type="rollback" />Retour</a></Menu.Item>
                <Menu.Item key="setting:2"><a href="/gestion-emprunt" ><Icon type="edit" />Emprunt</a></Menu.Item>
              </MenuItemGroup>
              <Menu.Divider title="----"/>
                <Menu.Item key="setting:3"><a href="/gestion-inventaire" ><Icon type="dashboard" />Gestion / Inventaire</a></Menu.Item>
            </SubMenu>  
        )
  }

  renderHomePage(){
    if(!Meteor.userId())
      return null

    return(<Menu.Item key="homepage">
            <a href="/" ><Icon type="eye" />Mes Emprunts et Reservations</a>
          </Menu.Item>)
    
  }

  renderNew(){
    if(!Meteor.userId())
      return null
  return(<Menu.Item key="new">
              <a href="/new" ><Icon type="form" />Nouvelle demande</a>
        </Menu.Item>)
  }

  
  render(){
    return(
      
      <Menu
        theme="dark"
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        style={{ lineHeight: '64px' }}
      >
        {this.renderHomePage()}
        
        {this.renderNew()}
        
        {this.renderAdminMenu()}
         
        <Menu.Item style = {{float:"right"}} key="user">
              {Meteor.user() ?<a href="javascript:Meteor.logout()" ><Icon type="close" />Sign-Out</a>:<a href="javascript:Meteor.loginWithUtt()" ><Icon type="user" />Sign-In</a>}    
        </Menu.Item> 

      </Menu>
    
  )
  }
    
  
    

}
