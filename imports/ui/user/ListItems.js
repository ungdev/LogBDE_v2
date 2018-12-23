import React from 'react'
import { Table, Input, Button, Icon, message, Popconfirm } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Items } from '/imports/api/Collections.js'

export default class ListItems extends TrackerReact(React.Component) {

    constructor(props){
        super(props)
        this.state = {
          searchText: '',
        };   
      }
      
      componentWillUnmount(){
        this.state.itemsSub.stop();
      }
      componentDidMount(){
        this.state.itemsSub = Meteor.subscribe('items')
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

      render() {
        const allItems = [{
          title: 'Nom',
          dataIndex: 'name',
          key: 'name',
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
          title: 'Caution/Prix',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: 'Quantite(s)',
          dataIndex: 'quantity',
          key: 'quantity',
        },
         {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },{
          title: 'Operation',
          dataIndex: 'operation',
          render: (text, record) => {
            if(!record)
              return null

            
              return (<Popconfirm title="êtes vous sûr d'ajouter cet objet a votre panier ?" onConfirm={() => this.handleAddToCart(record.key)}>
              <a ><Icon type="plus"  />Ajouter</a>
            </Popconfirm>)
          },
        }]; // ALL ITEMS
  
        return (
          <Table 
          pagination = {{pageSize:5, pageSizeOptions: ['5', '10','50'], showSizeChanger: true, showTotal:(total, range) => `${range[0]}-${range[1]} des ${total} objets`}} 
          columns={allItems} 
          dataSource={Items.find().fetch().map(item =>{
            return {key:item._id,isConsumable:item.isConsumable,name:item.name,quantity:item.quantity?item.quantity:1,description:item.description,price:item.isConsumable ? item.price:item.suretyBond}
            
            })} />
          );
      }
}