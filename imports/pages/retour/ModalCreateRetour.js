import React, { Component } from 'react'
import { Button,Switch, Modal, Form, Input} from 'antd';
import moment from 'moment';

import { Items } from '/imports/collections/Collections.js'

export default  ModalCreateRetour  = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends Component {

        constructor(props){
            
            super(props)
            this.state = {}
        }

        componentWillUnmount(){
            this.state.itemsSub.stop();
        }
        componentDidMount(){
            this.state.itemsSub = Meteor.subscribe('items')
        }


      render() {
        const {
          visible, onCancel, onCreate, form, _idItem,endDate, description,location} = this.props;
        const { TextArea } = Input;

        
        

        
        // console.log(item);
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title="Valider le retour"
                okText="Valider"
                onCancel={onCancel}
                onOk={onCreate}
            >
            <Form layout="vertical">
                <Form.Item label="Description">
                    {getFieldDecorator('description', {
                    rules: [{ required: true, message: 'description requise' }],
                    initialValue:description
                    })(
                        <TextArea placeholder="Ex : rien a signaler" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </Form.Item>
                <Form.Item label="Caution encaissée">
                    {getFieldDecorator('caution',)(
                        <Input  placeholder="Ex : 5.65"/>
                    )}
                </Form.Item>
                <Form.Item label="Emplacement de stockage">
                {getFieldDecorator('location',{
                    rules: [{ required: true, message: 'emplacement requis' }],
                    initialValue:location
                    })(
                    <Input placeholder="Ex : salle serveur" ></Input>
                    )}            
                             
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('_idItem',{initialValue:_idItem})(
                    <Input type = {"hidden"}></Input>
                    )}            
                             
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('endDate',{initialValue:endDate})(
                    <Input type = {"hidden"}></Input>
                    )}            
                             
                </Form.Item>        
            </Form>
            
          </Modal>
        );
      }
    }
  );