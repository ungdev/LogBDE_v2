import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Items } from '/imports/api/Collections.js';
import { Reservations } from '/imports/api/Collections.js';
import { Cart } from '/imports/api/Collections.js';
import '/server/methods.js'

//Meteor.users.remove({})

Meteor.startup(() => {
  Roles.addUsersToRoles('JGsYbq2LxKHLLzXL2', 'admin');
  Roles.addUsersToRoles('JGsYbq2LxKHLLzXL2', 'super-admin');
});

Meteor.publish('userData',function(){
    return Meteor.users.find(this.userId)
})

Meteor.publish('items', function(){
  return Items.find({})
})

Meteor.publish('reservations',function(){
  return Reservations.find({})
})

Meteor.publish('cart',function(){
  return Cart.find(this.userId)
})

Accounts.onCreateUser((options, user) => {
  // console.log("user : "+JSON.stringify(user));
  // console.log("options : "+JSON.stringify(options));
  if (!user.services.utt) {
    throw new Error('Expected login with UTT oAuth only.');
  }

  if(!options.bdeMember)
    throw new Error('not BDE member')
  
  _.extend(user, options)


  return user;
});

Meteor.users.deny({
  update() { return true; },
  remove() { return true; },
  insert() { return true; }
});

