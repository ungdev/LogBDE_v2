
import { Items } from '/imports/api/Collections.js';
import { Cart } from '/imports/api/Collections.js';
import { Reservations } from '/imports/api/Collections.js';

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
            statut:"disponible",
            caution
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
    addToCart(itemId){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        let item = Items.findOne(itemId)
        if(!item || item.statut !== 'disponible')
            throw new Meteor.Error('Oups','Cet Objet n est pas dispo !')

        Items.update(itemId,{
            $set:{
                statut:'réservé',
                etudiant:this.userId
            }
        })

        Cart.update(this.userId, {
            $set:{
                lastModified : new Date(),
                isActive: true
            },
            $push:{
                carted: {
                    _id:itemId,
                    nom:item.nom,
                    caution:item.caution
                }      
            },
            $inc:{
                caution:item.caution
            }
        },{upsert: true})
    },
    deleteFromCart(itemId){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        let item = Items.findOne(itemId)
        if(!item || item.etudiant !== this.userId)
            throw new Meteor.Error('Oups','l objet n existe pas ou vous ne l avez pas réservé')

            Items.update(itemId,{
                $set:{
                    statut:'disponible',
                    etudiant:null
                }
            })
            Cart.update(this.userId, {
                $set:{
                    lastModified : new Date(),
                    statut: 'active'
                },
                $pull:{
                    carted: {_id:itemId }                
                },
                $inc:{
                    caution:-item.caution
                }
            })
        
    },
    createReservation(){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        let panier = Cart.findOne(this.userId);
        let user = Meteor.users.findOne(this.userId)
        Reservations.insert({
            etudiant:user.lastName+' '+user.firstName,
            objets: panier.carted.map(item=>{return item.nom}),
            caution : panier.caution
        })
        // let 
        // Reservations
    }
})