

import '/client/routes.js'
import '/client/main.css'

Meteor.subscribe('userData')

Meteor.subscribe('items')


FlowRouter.wait();

Tracker.autorun(() => {
  // wait on roles to intialise so we can check if user is in proper role
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize()
  }
});


