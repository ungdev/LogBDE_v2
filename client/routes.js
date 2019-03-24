import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import HomePage from '/imports/pages/HomePage.js'
import NewPage from '/imports/pages/newPage/NewPage.js'

import InventairePage from '/imports/pages/gestion/InventairePage.js'
import GestionPage from '/imports/pages/gestion/GestionPage.js'
import EmpruntPage from '/imports/pages/emprunt/EmpruntPage.js'

import RetourPage from '/imports/pages/retour/RetourPage.js'
import AdminPage from '/imports/pages/admin/AdminPage.js'
import NotFoundPage from '/imports/pages/NotFoundPage.js'
import  MainLayout  from '/imports/MainLayout.js'


FlowRouter.triggers.enter([function(context, redirect) {
    if(!Meteor.userId())
        redirect('/');

  }], {except: ["/"]}); // check si l'utilisateur est log-in except sur /


var assosRoutes = FlowRouter.group({
    name: 'assos',
    triggersEnter: [function(context, redirect) {
      if(!Roles.userIsInRole(Meteor.userId(),'admin',context.params.asso))
        redirect('/')
    }]
});

var adminRoutes = FlowRouter.group({
  name: 'admin',
  triggersEnter: [function(context, redirect) {
    if(!Roles.userIsInRole(Meteor.userId(),'admin','bde'))
      redirect('/')
  }]
});

adminRoutes.route('/admin-users', {
  name: 'admin-users',
  action(params) {
      mount( MainLayout, {
          content: <AdminPage/>
      })}
});

  assosRoutes.route('/gestion-inventaire/:asso', {
    name: 'gestion-inventaire',
    action(params) {
        mount( MainLayout, {
            content: <InventairePage asso={params.asso}/>
        })}
  });

  assosRoutes.route('/gestion-users/:asso', {
    name: 'gestion-inventaire',
    action(params) {
        mount( MainLayout, {
            content: <GestionPage asso={params.asso}/>
        })}
  });

  assosRoutes.route('/gestion-emprunt/:asso', {
    name: 'gestion-emprunt',
    action(params) {
        mount( MainLayout, {
            content: <EmpruntPage asso={params.asso}/>
        })}
  });

  assosRoutes.route('/gestion-retour/:asso', {
    name: 'gestion-retour',
    action(params) {
        mount( MainLayout, {
            content: <RetourPage asso={params.asso}/>
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


Accounts.onLogout(()=>FlowRouter.go('/'))


FlowRouter.route('/users/:id', {
  name: 'users',
  triggersEnter: [function(context, redirect) { 
    if(Roles.getGroupsForUser(Meteor.userId(),'admin').length == 0)
        redirect('/')

    if(context.params.id){
      Meteor.call('seeProfil',context.params.id,(error,result)=>{
        if(error)
          return;
        window.location = 'https://etu.utt.fr/user/'+result
      })      
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