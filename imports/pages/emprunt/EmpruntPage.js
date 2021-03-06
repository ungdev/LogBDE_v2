import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Table, message, Icon, Input, Button,Popconfirm} from 'antd';
import { Items } from '/imports/collections/Collections.js'

import moment from 'moment'

export default class EmpruntPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
        this.state = {
            
            searchText: '',
        }
    }



    confirm = (record) => {
        console.log(record);
        Meteor.call('validerEmprunt',record._idItem,record._idEtudiant,record.startDate,record.endDate, (error,result)=>{
            if(error)
                message.error(error.reason);
            else message.success('Click on Yes');
        })
        
    }

    cancel = (reservation) => {
        Meteor.call('deleteReservation',reservation._idItem,reservation.startDate,reservation._idEtudiant,(error)=>{
          if(error){
            message.error(error.reason);
          }else{
            message.success('Reservation annule');
          }
          
        })
        
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
            { title: 'Action', key: 'operation', render: (record) => <Popconfirm title="Valider cet emprunt ?" onConfirm={() => {this.confirm(record)}} onCancel={() => {this.cancel(record)}} okText="Oui" cancelText="Non">
            <Button>Valider Emprunt</Button>
          </Popconfirm> },
          ];
          
          const items = Items.find({ asso: this.props.asso }).fetch().map(item => { item.key = item._id ;return item})
          let reservations = []
          let key = 0
          for(const item of items){
            
            for(let reservation of item.reservedBy){
                let days = moment(reservation.startDate,'DD/MM/YYYY').diff(moment(),'days')
                if( days <= 7 && days > -1 && !reservation.isValide){
                  console.log(reservation);
                    reservation.name = item.name
                    reservation.key = key
                    reservation._idItem = item._id
                    reservation.suretyBond = item.suretyBond
                    reservation.description = item.description
                    reservation.imageName = item.imageName
                    reservations.push(reservation)
                    key++
                }
                  
            }
          }
          reservations.sort((a,b)=>{return moment(a.startDate,'DD/MM/YYYY').diff(moment(b.startDate,'DD/MM/YYYY'))})
          console.log(reservations);
        return (
            
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={reservations}
                />
            
        );
    }
}