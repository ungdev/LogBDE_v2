import React, { Component } from 'react'
import {Table,message, Badge, Menu, Dropdown, Icon,Button,Popconfirm,Pagination} from 'antd';
import { Items } from '/imports/collections/Collections.js'

import AddAdmin from '/imports/pages/admin/AddAdmin.js'

import TrackerReact from 'meteor/ultimatejs:tracker-react';



export default class AdminPage extends TrackerReact(Component) {

    constructor(props){
        super(props)

    }


  render(){
        return (
            <AddAdmin/>
        );
    }
}