
import React from 'react'
import { Icon, Button, message, List, Card, Form,Input, DatePicker } from 'antd';
import { Cart, Items } from '/imports/api/Collections.js'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import moment from 'moment';

const FormItem = Form.Item;
const {RangePicker} = DatePicker
let id = 0;



class FormPanier extends TrackerReact(React.Component) {

  constructor(props){
    super(props)
    console.log(props);
    this.state =  {
      dates : new Array
    }
  }

  componentWillUnmount(){
    this.state.cartSub.stop();
    this.state.ItemSub.stop();
  }
  componentDidMount(){
    this.state.cartSub = Meteor.subscribe('cart')
    this.state.itemSub = Meteor.subscribe('items')
    
  }


  // remove = (k) => {
  //   const { form } = this.props;
  //   // can use data-binding to get
  //   const keys = form.getFieldValue('keys');
  //   // We need at least one passenger
  //   if (keys.length === 1) {
  //     return;
  //   }

  //   // can use data-binding to set
  //   form.setFieldsValue({
  //     keys: keys.filter(key => key !== k),
  //   });
  // }

  // add = () => {
  //   const { form } = this.props;
  //   // can use data-binding to get
  //   const keys = form.getFieldValue('keys');
  //   const nextKeys = keys.concat(++id);
  //   // can use data-binding to set
  //   // important! notify form to detect changes
  //   form.setFieldsValue({
  //     keys: nextKeys,
  //   });
  // }

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }

  disabledDate(current) {
    for(const date of this.state.dates){
      if(current.isBetween(moment(reservation.startDate,'DD/MM/YYYY').valueOf(), moment(reservation.endDate,'DD/MM/YYYY').valueOf(), null, '[]'))
        return true
    }
  }

  calendarChange(dates){
    console.log(dates);
    
  }

  render() {

    let cart = Cart.findOne(Meteor.userId())
    if(!cart)
      return null
    for (const itemCarted of cart.carted) {
      const item = Items.findOne(itemCarted._id)
      if(!item)
        return null
      if(item.isConsumable)
        continue   
      for(const reservation of item.reservedBy){
        this.state.dates.push({startDate:reservation.startDate,endDate:reservation.endDate})
      }
    }

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };

    

    return (
      <Form onSubmit={this.handleSubmit}>
        
        <FormItem label="RangePicker">
          {getFieldDecorator('range-picker', rangeConfig)(
            <RangePicker
            disabledDate={this.disabledDate}
            onCalendarChange = {this.calendarChange}
            format="DD/MM/YYYY" />
          )}
        </FormItem>
        <FormItem >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

export const Panier = Form.create()(FormPanier)

// export default class Panier extends TrackerReact(React.Component) {

//   constructor(props){
//     super(props)
//     this.state = {}
//   }

//   componentWillUnmount(){
//     this.state.cartSub.stop();
//   }
//   componentDidMount(){
//     this.state.cartSub = Meteor.subscribe('cart')
//   }


//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   }

//   handleDelete = (itemId) =>{
//     Meteor.call('deleteFromCart',itemId,(error,result)=>{
//         if(error){
//             message.error(error.reason)
//         }else{
//             message.success('Objet retiré du panier')
//         }
//     })
//   }

//   createReservation = () =>{
//       Meteor.call('createReservation',(error,result)=>{
//         if(error){
//           message.error(error.reason)
//         }else{
//           message.success('Réservation créée')
//         }
//       })
//   }

//   render() {
//     let data = Cart.find(Meteor.userId()).fetch()[0]
//         if(!data)
//           return null
//     let tmp = Cart.find(Meteor.userId()).fetch()[0].carted
    
//     // Only show error after a field is touched.
//     console.log(tmp);
    
//     return (
//         <div className="center">
//         <List
//         grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
//         dataSource={tmp}
//         renderItem={item => (
//           <List.Item>
//             <Card title={item.nom} extra = {<a><Icon type="delete" onClick = {() => this.handleDelete(item._id)} theme="outlined" /></a>}>   Caution : {item.caution+'€'}</Card>
//           </List.Item>
//         )}
//       />
//           <Button disabled={!tmp.length} type="primary" onClick = {this.createReservation}>
//             Créer la réservation
//           </Button>
//         </div>
//     );
//   }
// }