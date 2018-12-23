import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Items } from '/imports/api/Collections.js'
import { Random } from 'meteor/random'

import '/server/publish.js'
import '/server/adminMethods.js'
import '/server/userMethods.js'

import { MockItems} from '/server/MOCK_DATA.js'

Meteor.startup(() => {
  if(Items.find().count() === 0){
    MockItems.forEach(element => {
      Items.insert(element)
    });
  }
  //Roles.addUsersToRoles(user._id, 'admin'); 
});



Accounts.onCreateUser((options, user) => {
  console.log("user : "+JSON.stringify(user));
  // console.log("options : "+JSON.stringify(options));
  if (!user.services.utt) {
    throw new Error('Expected login with UTT oAuth only.');
  }

  _.extend(user, options)


  return user;
});


