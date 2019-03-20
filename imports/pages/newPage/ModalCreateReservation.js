import React, { Component } from 'react'
import { Button, Modal, Form, Input, Radio,DatePicker} from 'antd';
import moment from 'moment';

import { Items } from '/imports/collections/Collections.js'

export default  ModalCreateReservation  = Form.create({ name: 'form_in_modal' })(
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

    disabledDate = (current) => {
        
        for(const reservation of this.state.item.reservedBy){
            
            if(current.isBetween(moment(reservation.startDate,'DD/MM/YYYY').startOf('day'), moment(reservation.endDate,'DD/MM/YYYY').endOf('day'),null,'[]'))
                return true
        }
        
        return false;
    }


      render() {
        const {
          visible, onCancel, onCreate, form, _idItem
        } = this.props;


        
        if(!_idItem)
            return null
        else this.state.item = Items.findOne(_idItem)

        
        // console.log(item);
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title="Creer une Reservation"
                okText="reserver"
                onCancel={onCancel}
                onOk={onCreate}
            >
            <Form layout="vertical">
                <Form.Item label="Date de reservation">
                    {getFieldDecorator('dates', {
                    rules: [{ required: true, message: 'Choisissez une date de reservation' }],
                    })(
                        <DatePicker.RangePicker disabledDate={this.disabledDate} />
                    )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('_idItem',{initialValue:_idItem})(
                    <Input type = {"hidden"}></Input>
                    )}            
                             
                </Form.Item>        
            </Form>
            
          </Modal>
        );
      }
    }
  );