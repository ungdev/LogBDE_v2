
import { Items } from '/imports/api/Collections.js';

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
    addAdmin(value){
        if(!Roles.userIsInRole(this.userId,'super-admin'))
            throw new Meteor.Error('Oups','You are not a super admin !')

        check(value,String)

        Roles.addUsersToRoles(value, 'admin');
    },

    addItem(nom,description,etat){

        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        check(nom,String)
        check(description, String)
        check(etat, String)

        Items.insert({
            nom,
            description,
            etat,
            statut:"disponible" 
        })  // ['disponible','emprunté','réservé']
    },

    getItem(id){
        check(id,String)
        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        let item = Items.findOne(id)

        if(!item)
            throw new Meteor.Error('Oups','l objet n exsite pas !')

        return item
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
                etat
            }
        })

    },
    deleteItem(id){
        if(!Roles.userIsInRole(this.userId,'admin'))
            throw new Meteor.Error('Oups','You are not an admin !')

        check(id,String)
        let item = Items.findOne(id)

        if(!item || item.statut === 'emprunté' || item.statut === 'réservé')
            throw new Meteor.Error('Oups','cette objet est soit réservé soit emprunté')
        Items.remove(id)
    },
    getAllItems(){
        let items = Items.find();
        let tmp = items.map((item)=>{
            return {key:item._id,statut:item.statut,nom:item.nom,description:item.description}
        })
        return tmp;
    }
})