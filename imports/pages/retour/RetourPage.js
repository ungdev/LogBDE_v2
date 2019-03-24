import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Table, message, Icon, Input, Button, Popconfirm} from 'antd';
import { Items } from '/imports/collections/Collections.js'

import ModalCreateRetour from '/imports/pages/retour/ModalCreateRetour.js'

export default class RetourPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
        this.state = {
            searchText: '',
            visible: false,
            selectedItem:null,
            description:null,
            location:null
        }
    }

    showModal = (idItem,endDate,description,location) => {
        
        this.setState({ visible: true,
                        selectedItem:idItem,
                        endDate:endDate, 
                        description:description,
                        location:location
                    });
    }

    handleCancel = () => {
        this.setState({ visible: false,
                        selectedItem:null
                     });
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
    
          console.log('Received values of form: ', values);
          Meteor.call('createRetour',values._idItem,values.description,values.caution,values.location,values.endDate,(error)=>{
            if(error)
              message.error(error.reason)
            else{
              message.success('Objet retourne')
            }
          })
          form.resetFields();
          this.setState({ visible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }
    
    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    }


    render(){
        const columns = [
            { title: 'Image', dataIndex: 'imageName', key: 'imageName', render:(text) => <img src={text} alt="Smiley face"/> },
            { title: 'Name', dataIndex: 'name', key: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="custom-filter-dropdown">
                  <Input
                    ref={ele => this.searchInput = ele}
                    placeholder="Search name"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={this.handleSearch(selectedKeys, confirm)}
                  />
                  <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
                  <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
                </div>
              ),
              filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
              onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                  setTimeout(() => {
                    this.searchInput.focus();
                  });
                }
              },
              render: (text) => {
                const { searchText } = this.state;
                return searchText ? (
                  <span>
                    {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                      fragment.toLowerCase() === searchText.toLowerCase()
                        ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                    ))}
                  </span>
                ) : text;
              }
            },
            { title: 'Etudiant', dataIndex: 'fullName', key: 'fullName' },
            { title: 'Caution', dataIndex: 'suretyBond', key: 'suretyBond' },
            { title: 'Debut', dataIndex: 'startDate', key: 'startDate' },
            { title: 'Fin', dataIndex: 'endDate', key: 'endDate' },
            { title: 'Action', key: 'operation', render: (record) => <Popconfirm title="Valider le retour ?" onConfirm={() => this.showModal(record._idItem,record.endDate,record.description,record.location)} onCancel={this.cancel} okText="Oui" cancelText="Non">
            <Button>Valider Retour</Button>
          </Popconfirm> }];
          
          const items = Items.find({ asso: this.props.asso }).fetch().map(item => { item.key = item._id ;return item})
          let reservations = []
          let key = 0
          for(const item of items){
            for(let reservation of item.reservedBy){
                let days = moment(reservation.startDate,'DD/MM/YYYY').diff(moment(),'days')
                if(reservation.isValide){
                    reservation.name = item.name
                    reservation.key = key
                    reservation._idItem = item._id
                    reservation.suretyBond = item.suretyBond
                    reservation.description = item.description
                    reservation.imageName = item.imageName
                    reservation.location = item.location
                    reservations.push(reservation)
                    key++
                }             
            }
          }
          reservations.sort((a,b)=>{return moment(a.startDate,'DD/MM/YYYY').diff(moment(b.startDate,'DD/MM/YYYY'))})
        return (
            <>
                 <ModalCreateRetour
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    _idItem = {this.state.selectedItem}
                    endDate = {this.state.endDate}
                    description = {this.state.description}
                    location = {this.state.location}
                /> 
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={reservations}
                />
            </>
        );
    }
}