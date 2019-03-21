
import { Items } from '/imports/collections/Collections.js'

Meteor.publish('items', function(){
    if(!this.userId)
      return
    if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
      return Items.find({},{fields: { _id: 1,name:1,description:1, suretyBond:1,reservedBy:1,imageName:1 }})

    return Items.find({})
})

Meteor.publish('userData',function(){
  if(!this.userId)
      return
  if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
    return Meteor.users.find(this.userId,{fields: { _id: 1,firstName:1,lastName:1, reservations:1 }})

return Meteor.users.find({},{fields: { _id: 1,firstName:1,lastName:1, reservations:1 }})
})

