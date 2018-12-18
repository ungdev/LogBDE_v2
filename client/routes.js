import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import EmpruntPage from '/imports/ui/pages/EmpruntPage.js'
import GestionPage from '/imports/ui/pages/GestionPage.js'
import OverviewPage from '/imports/ui/pages/OverviewPage.js'
import ReservationPage from '/imports/ui/pages/ReservationPage.js'
import RetourPage from '/imports/ui/pages/RetourPage.js'
import HomePage from '/imports/ui/pages/HomePage.js'
import { AddAdmin } from '/imports/ui/superAdmin/AddAdmin.js'

import { MainLayout } from '/imports/MainLayout.js'


FlowRouter.triggers.enter([function(context, redirect) {
    if(!Meteor.userId())
        redirect('/');

  }], {except: ["home"]}); // check si l'utilisateur est log-in expect sur /


var adminRoutes = FlowRouter.group({
    name: 'admin',
    triggersEnter: [function(context, redirect) { 
      console.log("check admin")
      if(!Roles.userIsInRole(Meteor.userId(),['admin']))
        redirect('/overview')
    }]
  });
  

  adminRoutes.route('/retour', {
    name: 'retour',
    action() {
        mount( MainLayout, {
            content: <RetourPage />
        })}
  });

  adminRoutes.route('/gestion', {
    name: 'gestion',
    action() {
        mount( MainLayout, {
            content: <GestionPage />
        })}
  });

  adminRoutes.route('/emprunt', {
    name: 'emprunt',
    action() {
        mount( MainLayout, {
            content: <EmpruntPage />
        })}
  });

  //////////////

FlowRouter.route('/addadmin',{
  name: 'addadmin',
    triggersEnter: [function(context, redirect) {
      console.log("check super-admin");
      if(!Roles.userIsInRole(Meteor.userId(),'super-admin'))
        redirect('/gestion')
    }],
    action(){
      mount( MainLayout, {
        content: <AddAdmin />
      })
    }
})

FlowRouter.route('/', {
    name: 'home',
    triggersEnter: [function(context, redirect) { 
      if(Meteor.userId())
        redirect('/overview')
    }],
    action(){
      mount( MainLayout, {
        content: <HomePage />
      })
    }
})

FlowRouter.route('/overview', {
    name: 'overview',
    action(){
      mount( MainLayout, {
        content: <OverviewPage />
      })
    }
})


FlowRouter.route('/reservation', {
    name: 'reservation',
    action(){
      mount( MainLayout, {
        content: <ReservationPage />
      })
    }
})


FlowRouter.notFound = {
    name: 'notFound',
    action(){
      mount( MainLayout, {
        content: <NotFoundPage />
      })
    }
};