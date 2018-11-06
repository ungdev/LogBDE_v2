import React, { Component } from 'react'
import { Table, Input, Button, Icon, message,Popconfirm } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Reservations } from '/imports/api/Collections.js'


export default class EmpruntPage extends TrackerReact(Component) {

    constructor(props){
        super(props)
        this.state = {
          searchText: '',
        };   
      }
      componentWillUnmount(){
        this.state.reservationsSub.stop();
      }
      componentDidMount(){
        this.state.reservationsSub = Meteor.subscribe('reservations')
      }

      handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
      }
      handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
      }
      handleReservation = (id) =>{
        Meteor.call('createEmprunt',id,(error,result)=>{
          if(error){
            message.error(error.reason)
          }else{
            message.success('Emprunt créé')
          }
        })
      }

    render() {
      const columns = [{
        title: 'Nom - Prenom',
        dataIndex: 'etudiant',
        key: 'etudiant',
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
        onFilter: (value, record) => record.etudiant.toLowerCase().includes(value.toLowerCase()),
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
        },
      },{
        title: 'Liste des objets',
        dataIndex: 'objets',
        key: 'objets',
      }, {
        title: 'Caution à demander',
        dataIndex: 'caution',
        key: 'caution',
        //width:150
      },{
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            Reservations.find().count() >= 1
              ? (
                <Popconfirm title="Valider la réservation et la transformer en emprunt ?" onConfirm={() => this.handleReservation(record.key)}>
                  <a ><Icon type="printer"  />Valider la réservation</a>
                </Popconfirm>
              ) : null
          );
        },
      }];
        return <Table pagination = {{pageSize:5, pageSizeOptions: ['5', '10','50'], showSizeChanger: true, showTotal:(total, range) => `${range[0]}-${range[1]} des ${total} objets`}} 
            columns={columns} 
            dataSource={Reservations.find({}).fetch().map(item =>{
                return {
                    key:item._id,
                    etudiant:item.etudiant.fullName,
                    objets:item.objets.map(function(objet, index){
                        if(index == 0 || index == item.objets.length - 1){
                          return objet.nom
                        }else{
                          return objet.nom+"/ "
                        }}),
                    caution:item.caution
                }
            }
        )} />;
    }
}