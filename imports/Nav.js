import AccountsUI from '/imports/ui/AccountsUI.js';
import React, { Component } from 'react';
import { Menu, Icon,Badge } from 'antd';
import { Cart } from '/imports/api/Collections.js'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import '/client/main.css'


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Nav extends TrackerReact(Component) {
  constructor(props){
    super(props)
    this.state = {
      current: null,
    }
  }

  componentWillUnmount(){
    this.state.cartSub.stop();
  }
  componentDidMount(){
    this.state.cartSub = Meteor.subscribe('cart')
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
    if(!Roles.userIsInRole(Meteor.userId(),'admin'))
      return

    return(
        <SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />Admin</span>}>
          <MenuItemGroup title="Actions">
            <Menu.Item key="setting:1"><a href="/retour" ><Icon type="rollback" />Retour</a></Menu.Item>
            <Menu.Item key="setting:2"><a href="/emprunt" ><Icon type="edit" />Emprunt</a></Menu.Item>
          </MenuItemGroup>
          <Menu.Divider title="----"/>
            <Menu.Item key="setting:3"><a href="/gestion" ><Icon type="dashboard" />Gestion / Inventaire</a></Menu.Item>
        </SubMenu>  
    )
  }

  renderOverview(){
    if(!Meteor.userId())
      return(<Menu.Item disabled>Please Sign-in</Menu.Item>)

    return(<Menu.Item key="overview">
            <a href="/overview" ><Icon type="eye" />Overview</a>
          </Menu.Item>)
    
  }

  renderReservation(){
    if(!Meteor.userId())
      return
  return(<Menu.Item key="reservation">
              <a href="/reservation" ><Icon type="form" />Reservation</a>
            {/* <a href="/reservation" ><Icon type="form" /><Badge count={Cart.find(Meteor.userId()).fetch()[0] ? Cart.find(Meteor.userId()).fetch()[0].carted.length:0} >Reservation</Badge></a> */}
          
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
        {this.renderOverview()}
        
        {this.renderReservation()}
        
        {this.renderAdminMenu()}

        <Menu.Item id="account" disabled key="utt" >
          <Icon type="user" />
          <AccountsUI/>
        </Menu.Item>
      </Menu>
    
  )
  }
    
  
    

}
