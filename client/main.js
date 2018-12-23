

import '/client/routes.js'
import '/imports/api/Collections.js'

Meteor.subscribe('userData')

FlowRouter.wait();

Tracker.autorun(() => {
  // wait on roles to intialise so we can check if user is in proper role
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize()
  }
});


