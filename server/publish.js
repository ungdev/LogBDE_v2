
import { Items } from '/imports/collections/Collections.js'

Meteor.publish('items', function(){
    if(!this.userId)
      return 
    return Items.find({})
})

Meteor.publish('userData',function(){
  if(!this.userId)
      return 
    return Meteor.users.find(this.userId)
})

