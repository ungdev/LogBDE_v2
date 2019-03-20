import React, { Component } from 'react'
import {Table,message, Badge, Menu, Dropdown, Icon,Button,Popconfirm} from 'antd';
import { Items } from '/imports/collections/Collections.js'
import CreeItem from '/imports/pages/gestion/CreeItem.js'
import AddAdmin from '/imports/pages/gestion/AddAdmin.js'

import TrackerReact from 'meteor/ultimatejs:tracker-react';



export default class GestionPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
        this.state = {
            itemSub:null
        }
    }

    showModal = (id) => {
        
      this.setState({ visible: true,
                      
                  });
  }
  handleDelete = (itemId) =>{
    Meteor.call('deleteItem',itemId,(error)=>{
      if(error){
        message.error(error.reason)
      }else{
        message.success('Objet supprime')
      }
    })
  }

  handleCancel = () => {
      this.setState({ visible: false,
                      
                      visible: false,
                   });
  }
  handleSubmit(){

  }

  handleCreate = () => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
  
        console.log('Received values of form: ', values);
        Meteor.call('createItem',values.name,values.description,values.location,values.suretyBond,(error)=>{
          if(error){
            return;
          }
          message.success('item creer');
        })
        form.resetFields();
        this.setState({ visible: false });
      });
  }
  AddAdmin(){
    if(Roles.userIsInRole(Meteor.userId(),'admin','bde'))
      return <AddAdmin/>
    return null
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
    }
    componentWillUnmount(){
        this.state.itemsSub.stop();
    }
    componentDidMount(){
        this.state.itemsSub = Meteor.subscribe('items')
    }
    renderNestedTable(record){
      console.log(record);
        const columns = [
            { title: 'Description', dataIndex: 'description', key: 'description' },
            { title: 'Caution prise', dataIndex: 'suretyBondTaken', key: 'suretyBondTaken' },
            { title: 'Debut de pret', dataIndex: 'startDate', key: 'startDate' },
            { title: 'Fin de pret', dataIndex: 'endDate', key: 'endDate' },
            { title: 'Etudiant', key: '_idEtudiant',dataIndex:'_idEtudiant',render: (text) => <a href={"/users/"+text}>Voir Profil</a> },
            { title: 'Logeur', dataIndex: '_idLogeur', key: '_idLogeur', render: (text) => <a href={"/users/"+text}>Voir Profil</a> },
        ];

    return (
            <Table
              columns={columns}
              dataSource={record.history}
              pagination={false}
            />
        );
    }
    render(){
      const columns = [
        { title: 'Image', dataIndex: 'imageName', key: 'imageName', render: (text) => <img src={text}/>},
        { title: 'Nom', dataIndex: 'name', key: 'name' },
        { title: 'Lieu', dataIndex: 'location', key: 'location' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Etat', dataIndex: 'isBorrowed', key: 'isBorrowed',render: (text) => <span><Badge status={text?"warning":"success"} />{text?"En cours":"Libre"}</span> },
        { title: 'Action', key: 'operation', render: (record) => <Popconfirm title="Supprimer l'objet ?" onConfirm={() => this.handleDelete(record._id)} okText="Oui" cancelText="Non">
        <Button>Supprimer</Button>
      </Popconfirm>
       },
      ];
      let groups = Roles.getGroupsForUser(Meteor.userId(),'admin')
      let data = Items.find({ asso: { $in: groups } }).fetch().map(el=>{el.key = el._id;return el})
        return (
          <>
          <Button type="primary" onClick={this.showModal}>Cree Item</Button>
          {this.AddAdmin()}
          <CreeItem
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
          />
            <Table
                className="components-table-demo-nested"
                columns={columns}
                expandedRowRender={(record)=>this.renderNestedTable(record)}
                dataSource={data}
            />
            </>
        );
    }
}