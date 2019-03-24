import React, { Component } from 'react'


import TrackerReact from 'meteor/ultimatejs:tracker-react';


export default class GestionPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
    }

    render(){
      let data = Roles.getUsersInRole('admin',this.props.asso).fetch()
      console.log(data);
        return (
          <h1>Users in role</h1>
        );
    }
}