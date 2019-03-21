import React, { Component } from 'react'
import { Select, Modal, Form, Input} from 'antd';
const Option = Select.Option;
export default  CreeItem  = Form.create()(
    // eslint-disable-next-line
    
    class extends Component {

        constructor(props){
            
            super(props)
            
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
            </Form>
            
          </Modal>
        );
      }
    }
  );