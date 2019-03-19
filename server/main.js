import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Items } from '/imports/api/Collections.js'

import '/server/publish.js'
import '/server/adminMethods.js'
import '/server/userMethods.js'

import { MockItems} from '/server/dataItems.js'
//Meteor.users.remove({})
// Items.remove({})
Meteor.startup(() => {
  Roles.addUsersToRoles('prhxZP4TeCT3mY8ry', 'admin');
  Roles.addUsersToRoles('prhxZP4TeCT3mY8ry', 'super-admin');
  Roles.addUsersToRoles('JGwZdb53u73s8KDx8', 'admin');
  Roles.addUsersToRoles('JGwZdb53u73s8KDx8', 'super-admin');
  // MockItems.forEach(element => {
  //   Items.insert(element)
  // });

});



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

// Meteor.users.deny({
//   update() { return true; },
//   remove() { return true; },
//   insert() { return true; }
// });

