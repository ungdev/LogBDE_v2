import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import HomePage from '/imports/pages/HomePage.js'
import NewPage from '/imports/pages/newPage/NewPage.js'

import GestionPage from '/imports/pages/gestion/GestionPage.js'
import EmpruntPage from '/imports/pages/emprunt/EmpruntPage.js'

import RetourPage from '/imports/pages/retour/RetourPage.js'

import NotFoundPage from '/imports/pages/NotFoundPage.js'
import { MainLayout } from '/imports/MainLayout.js'


FlowRouter.triggers.enter([function(context, redirect) {
    if(!Meteor.userId())
        redirect('/');

  }], {except: ["/"]}); // check si l'utilisateur est log-in except sur /


var adminRoutes = FlowRouter.group({
    name: 'admin',
    triggersEnter: [function(context, redirect) { 
      if(Roles.getGroupsForUser(Meteor.userId(),'admin').length == 0)
        redirect('/')
    }]
  });

  adminRoutes.route('/gestion-inventaire', {
    name: 'gestion',
    action() {
        mount( MainLayout, {
            content: <GestionPage />
        })}
  });

  adminRoutes.route('/gestion-emprunt', {
    name: 'gestion',
    action() {
        mount( MainLayout, {
            content: <EmpruntPage />
        })}
  });

  adminRoutes.route('/gestion-retour', {
    name: 'gestion',
    action() {
        mount( MainLayout, {
            content: <RetourPage />
        })}
  });

FlowRouter.route('/', {
    name: '/',
    action(){
      mount( MainLayout, {
        content: <HomePage />
      })
    }
})


FlowRouter.route('/users/:id', {
  name: '/',
  triggersEnter: [function(context, redirect) { 
    if(Roles.getGroupsForUser(Meteor.userId(),'admin').length == 0)
        redirect('/')

    if(context.params.id){
      let user = Meteor.users.findOne(context.params.id);
      if(user)
        window.location = 'https://etu.utt.fr/user/'+user.username
    }
  }],
  action(){
    mount( MainLayout, {
      content: <NotFoundPage />
    })
  }
})

FlowRouter.route('/new', {
    name: 'new',
    action(){
      mount( MainLayout, {
        content: <NewPage />
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