import React from 'react'

import { Table, Input, Button, Icon, message, Popconfirm } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Items } from '/imports/api/Collections.js'
import { Cart } from '/imports/api/Collections.js'
AAA = Cart
  export default class ApercuItems extends TrackerReact(React.Component) {

    constructor(props){
      super(props)
      this.state = {
        searchText: '',
      };   
    }

    handleSearch = (selectedKeys, confirm) => () => {
      confirm();
      this.setState({ searchText: selectedKeys[0] });
    }
  
    handleReset = clearFilters => () => {
      clearFilters();
      this.setState({ searchText: '' });
    }

    handleAddToCart = (id) =>{
      Meteor.call('addToCart',id,(error,result)=>{
        if(error)
          message.error(error.reason)
        else{
          message.success('Objet ajouté')
        }
      })
    }

    // handleDeleteFromCart = (id) =>{
    //     Meteor.call('deleteFromCart',id,(error,result)=>{
    //         if(error)
    //           message.error(error.reason)
    //         else{
    //           message.success('Objet supprimé')
    //         }
    //       })
    // }

    // showCart = () =>{
    //     const cart = [{
    //         title: 'Nom',
    //         dataIndex: 'nom',
    //         key: 'nom',
    //       },{
    //         title: 'Caution',
    //         dataIndex: 'caution',
    //         key: 'caution',
    //       },{
    //         title: 'Operation',
    //         dataIndex: 'operation',
    //         render: (text, record) => {
    //           return (
    //             Cart.find(Meteor.userId()).fetch().carted.length >= 1
    //               ? (
    //                 <Popconfirm title="êtes vous sûr de supprimer cet objet a votre panier ?" onConfirm={() => this.handleDeleteFromCart(record.key)}>
    //                   <a ><Icon type="delete"  />Ajouté</a>
    //                 </Popconfirm>
    //               ) : null
    //           );
    //         },
    //       }];
    //     if(!Cart.find(Meteor.userId()) || Cart.find(Meteor.userId()).fetch().carted)
    //         return
    //     else return(<Table 
    //         pagination = {{pageSize:5, pageSizeOptions: ['5', '10','50'], showSizeChanger: true, showTotal:(total, range) => `${range[0]}-${range[1]} des ${total} objets`}} 
    //         columns={cart} 
    //         dataSource={Cart.findOne(Meteor.userId()).carted.map(item =>{return {key:item._id,caution:item.caution,nom:item.nom}})} />
    //     )
    // }
  
    render() {
      const allItems = [{
        title: 'Nom',
        dataIndex: 'nom',
        key: 'nom',
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
        onFilter: (value, record) => record.nom.toLowerCase().includes(value.toLowerCase()),
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
        title: 'Caution',
        dataIndex: 'caution',
        key: 'caution',
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        //width:150
      },{
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            Items.find().count() >= 1
              ? (
                <Popconfirm title="êtes vous sûr d'ajouter cet objet a votre panier ?" onConfirm={() => this.handleAddToCart(record.key)}>
                  <a ><Icon type="plus"  />Ajouté</a>
                </Popconfirm>
              ) : null
          );
        },
      }]; // ALL ITEMS


      


      return (
          <div>
          {/* {this.showCart()} */}
        <Table 
        pagination = {{pageSize:5, pageSizeOptions: ['5', '10','50'], showSizeChanger: true, showTotal:(total, range) => `${range[0]}-${range[1]} des ${total} objets`}} 
        columns={allItems} 
        dataSource={Items.find({statut:'disponible'}).fetch().map(item =>{return {key:item._id,caution:item.caution,nom:item.nom,description:item.description}})} />
        </div>
        );
    }
  }