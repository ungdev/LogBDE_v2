
import React from 'react'
import { Icon, Button, message, List, Card } from 'antd';
import { Cart } from '/imports/api/Collections.js'
import TrackerReact from 'meteor/ultimatejs:tracker-react';




export default class Panier extends TrackerReact(React.Component) {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentWillUnmount(){
    this.state.cartSub.stop();
  }
  componentDidMount(){
    this.state.cartSub = Meteor.subscribe('cart')
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleDelete = (itemId) =>{
    Meteor.call('deleteFromCart',itemId,(error,result)=>{
        if(error){
            message.error(error.reason)
        }else{
            message.success('Objet retiré du panier')
        }
    })
  }

  createReservation = () =>{
      Meteor.call('createReservation',(error,result)=>{
        if(error){
          message.error(error.reason)
        }else{
          message.success('Réservation créée')
        }
      })
  }

  render() {
    let data = Cart.find(Meteor.userId()).fetch()[0]
        if(!data)
          return null
    let tmp = Cart.find(Meteor.userId()).fetch()[0].carted
    
    // Only show error after a field is touched.
    console.log(tmp);
    
    return (
        <div className="center">
        <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
        dataSource={tmp}
        renderItem={item => (
          <List.Item>
            <Card title={item.nom} extra = {<a><Icon type="delete" onClick = {() => this.handleDelete(item._id)} theme="outlined" /></a>}>   Caution : {item.caution+'€'}</Card>
          </List.Item>
        )}
      />
          <Button disabled={!tmp.length} type="primary" onClick = {this.createReservation}>
            Créer la réservation
          </Button>
        </div>
    );
  }
}


// const Panier = Form.create()(
//     class CartForm extends React.Component {
//       render() {
//         const { form } = this.props;
//         const { getFieldDecorator } = form;
//         let data = Cart.find(Meteor.userId()).fetch()[0]
//         if(!data)
//           return null
//         let tmp = Cart.find(Meteor.userId()).fetch()[0].carted.map(item =>{return {key:item._id,caution:item.caution,nom:item.nom}})
//         return (
//             <Form layout="vertical" onSubmit = {() =>{console.log(this)}}>
//               {tmp.map(item =>{
//                 console.log(item)
//                 return(<FormItem label={'nom : '+item.nom+' caution : '+item.caution}>
//                 {getFieldDecorator('key',{initialValue:item.key,})(<Input type='hidden' />)}
//               </FormItem>)
//               })}
//               <Button
//               type="primary"
//               htmlType="submit"/>

//             </Form>
//         );
//       }
//     }
//   );

//   handleDeleteFromCart = (id) =>{
//     Meteor.call('deleteFromCart',id,(error,result)=>{
//         if(error)
//           message.error(error.reason)
//         else{
//           message.success('Objet supprimé')
//         }
//       })
// }