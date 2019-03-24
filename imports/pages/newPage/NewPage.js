import React, { Component } from 'react'
import {Table, message, Icon, Input, Button} from 'antd';
import { Items } from '/imports/collections/Collections.js'


import TrackerReact from 'meteor/ultimatejs:tracker-react';

import ModalCreateReservation from '/imports/pages/newPage/ModalCreateReservation.js'

  

export default class NewPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
        this.state = {
            searchText: '',
            visible: false,
            selectedItem:null
        }
    }

    showModal = (id) => {
        
        this.setState({ visible: true,
                        selectedItem:id 
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
          
          form.resetFields();
          this.setState({ visible: false });
          Meteor.call('createReservation',values._idItem, values.dates[0].format('DD/MM/YYYY'),values.dates[1].format('DD/MM/YYYY'),(error,result)=>{
            if(error)
              message.error(error.reason)
            else{
              message.success('Objet ajouté')
            }
          })
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
            { title: 'Caution', dataIndex: 'suretyBond', key: 'suretyBond' },
            { title: 'Action', key: 'operation', render: (record) => <Button type="primary" onClick={() => this.showModal(record.key)}>Reserver</Button> },
          ];
          
        return (
            <>
                <ModalCreateReservation
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    _idItem = {this.state.selectedItem}
                />
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={Items.find({}).fetch().map(item => { item.key = item._id ; return item})}
                />
            </>
        );
    }
}