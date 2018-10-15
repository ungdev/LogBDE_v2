import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import '/server/publish.js'
import '/server/adminMethods.js'
import '/server/userMethods.js'

//Meteor.users.remove({})

Meteor.startup(() => {
  Roles.addUsersToRoles('JGsYbq2LxKHLLzXL2', 'admin');
  Roles.addUsersToRoles('JGsYbq2LxKHLLzXL2', 'super-admin');
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

Meteor.users.deny({
  update() { return true; },
  remove() { return true; },
  insert() { return true; }
});

