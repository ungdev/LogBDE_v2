import React from 'react'

import { Table, Input, Button, Icon, message, Popconfirm,Modal, Form,Row, Col } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Items } from '/imports/api/Collections.js'

const FormItem = Form.Item;

const ModalDuplicateItem = Form.create()(
  class A extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, title,itemId } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="Dupliquer"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Nombre de fois ?">
              {getFieldDecorator('nombre', {
                rules: [{ required: true, message: 'Dit le nombre de fois que tu veux dupliquer cet objet !' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('itemId',{initialValue:itemId,})(<Input type='hidden' />)}
              </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);


  export default class ApercuItems extends TrackerReact(React.Component) {

    constructor(props){
      super(props)
      this.state = {
        searchText: '',
        visible: false,
        title:'',
        itemId:''
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

    handleDelete = (id) =>{
      Meteor.call('deleteItem',id,(error,result)=>{
        if(error)
          message.error(error.reason)
        else{
          message.success('Objet supprimé')
        }
      })
    }

    showModal = (itemId,nomItem) => {
      this.setState({ visible: true, title:nomItem, itemId:itemId });
    }
  
    handleCancel = () => {
      this.setState({ visible: false });
    }
  
    handleCreate = () => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
  
        console.log('Received values of form: ', values);
        Meteor.call('duplicateItem', values.itemId, values.nombre,(error,result)=>{
          if(error)
            message.error(error.reason)
          else{
            message.success('Objet correctement duppliqué')
          }
        })
        form.resetFields();
        this.setState({ visible: false });
      });
    }
  
    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }
  
    render() {
      const columns = [{
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
        title: 'Code barre',
        dataIndex: 'key',
        key: 'codebarre',
      }, {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        //width:150
      }, {
        title: 'Statut',
        dataIndex: 'statut',
        key: 'statut',
        filters: [{
          text: 'Disponible',
          value: 'disponible',
        }, {
          text: 'Réservé',
          value: 'réservé',
        },{
          text: 'Emprunté',
          value: 'emprunté',
        }],
        onFilter: (value, record) => record.statut.indexOf(value) === 0,
      },{
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            Items.find().count() >= 1
              ? (
                <Row>
                    <Col className = "center" xs= {24} sm = {12} >  
                      <Popconfirm title="êtes vous sûr de supprmier cette objet ?" onConfirm={() => this.handleDelete(record.key)}>
                        <a ><Icon type="delete"  />Delete</a>
                      </Popconfirm>
                    </Col>
                  <Col className = "center" xs= {24} sm = {12} >
                    <a onClick={() => this.showModal(record.key,record.nom)}><Icon type="copy"  />Dupliquer</a>
                  </Col>
                </Row>
              ) : null
          );
        },
      }];
      return (
        <>
      <Table pagination = {{pageSize:5, pageSizeOptions: ['5', '10','50'], showSizeChanger: true, showTotal:(total, range) => `${range[0]}-${range[1]} des ${total} objets`}} columns={columns} dataSource={Items.find({}).fetch().map(item =>{return {key:item._id,statut:item.statut,nom:item.nom,description:item.description}})} />
      <ModalDuplicateItem
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                title={this.state.title}
                itemId={this.state.itemId}
      ></ModalDuplicateItem>
      </>
      );
    }
  }