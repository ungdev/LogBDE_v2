
import { Items } from '/imports/collections/Collections.js'

Meteor.publish('items', function(){
    if(!this.userId)
      return
    return Items.find({})
})

Meteor.publish('userData',function(){
  if(!this.userId)
      return
return Meteor.users.find({},{fields: { _id: 1,firstName:1,lastName:1, reservations:1 }})
})

Meteor.publish('roles',function(){
  if(!this.userId)
      return
  if(Roles.userIsInRole(this.userId,'admin','bde'))
      return Meteor.roles.find({}, {fields: {name: 1}})
})
