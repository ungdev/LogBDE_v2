

import { Items } from '/imports/api/Collections.js'

Meteor.methods({
    getUsernames(value){

        if(!Roles.userIsInRole(this.userId,'super-admin'))
            throw new Meteor.Error('Oups','You are not a super admin !')


        check(value,String)

        
        
        let users = Meteor.users.find({ firstName: { $regex: "^"+value + ".*", $options: 'i'} } ).map((user)=>{
            return {value:user._id,text:user.firstName+' '+user.lastName+' ('+user.username+')'}
        })

        return users
    },
    addAdmin(userId){
        if(!Roles.userIsInRole(this.userId,'super-admin'))
            throw new Meteor.Error('Oups','You are not a super admin !')

        check(userId,String)

        Roles.addUsersToRoles(userId, 'admin');
    }, // END Super-Admin


    addItem(nom,description,etat,caution){

        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        check(nom,String)
        check(description, String)
        check(etat, String)
        if(!(!isNaN(parseFloat(caution)) && isFinite(caution) && caution > 0))
            throw new Meteor.Error('Oups','le prix de la caution n est pas correct')

        Items.insert({
            nom,
            description,
            etat,
            statut:"disponible", // ['disponible','emprunté','réservé']
            caution,
            addedBy : this.userId,
        })  
    },

    updateItem(id, nom, description, etat){
        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        check(id,String)
        check(nom,String)
        check(description,String)
        check(etat,String)

        let item = Items.findOne(id)

        if(!item || item.statut === 'emprunté')
            throw new Meteor.Error('Oups','l objet n exsite pas ou est en plein emprunt !')

        Items.update(id,{
            $set:{
                nom,
                description,
                etat,
                modifiedBy:{
                    adminId: this.userId,
                    date: new Date()
                }
            }
        })

    },
    deleteItem(id){
        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        check(id,String)
        let item = Items.findOne(id)

        if(!item || item.statut === 'emprunté' || item.statut === 'réservé' || item.addedBy !== this.userId)
            throw new Meteor.Error('Oups','en l etat cet objet n est pas supprimable')
            
        Items.remove(id)
    },
})