import { Items, Reservations, Cart, Emprunts } from '/imports/api/Collections.js';


Meteor.publish('userData',function(){
    return Meteor.users.find(this.userId)
})

Meteor.publish('items', function(){
  return Items.find({})
})

Meteor.publish('reservations',function(){
  if(!Roles.userIsInRole(this.userId,['admin']))
    return Reservations.find(this.userId)
    
  return Reservations.find({})
})

Meteor.publish('emprunts',function(){
  if(!Roles.userIsInRole(this.userId,['admin']))
    return Emprunts.find(this.userId)
    
  return Emprunts.find({})
})

Meteor.publish('cart',function(){
  return Cart.find(this.userId)
})