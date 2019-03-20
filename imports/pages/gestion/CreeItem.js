import React, { Component } from 'react'
import { Select, Modal, Form, Input} from 'antd';
const Option = Select.Option;
export default  CreeItem  = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    
    class extends Component {

        constructor(props){
            
            super(props)
            this.state = {}
        }

      getGroups(){
        return Roles.getGroupsForUser(Meteor.userId(),'admin').map(el => <Option key = {el} >{el}</Option>)
      }

      render() {
        const {visible, onCancel, onCreate, form} = this.props;

        // console.log(item);
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title="Creer un objet"
                okText="Creer"
                onCancel={onCancel}
                onOk={onCreate}
            >
            <Form layout="vertical">
            <Form.Item label="Nom">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Pour quelle asso ?">
              {getFieldDecorator('asso', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Select >
                 {Roles.getGroupsForUser(Meteor.userId(),'admin').map(group =>(<Option key={group}>{group}</Option>))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: 'description' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Endroit de stockage">
              {getFieldDecorator('location', {
                rules: [{ required: true, message: 'stockage' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Caution">
              {getFieldDecorator('suretyBond', {
                rules: [{ required: true, message: 'caution' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label = "Choisissez une ou des assos">
          {getFieldDecorator('select', {
            rules: [
              { required: true, message: 'Choisissez au moins une asso !', type: 'array' },
            ],
          })(
            <Select mode="multiple" placeholder="Choisissez a qu'elle asso appartient cet objet">
              {this.getGroups()}
            </Select>
          )}
        </Form.Item>        
            </Form>
            
          </Modal>
        );
      }
    }
  );