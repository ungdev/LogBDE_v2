
import { Items } from '/imports/api/Collections.js';
import { Cart } from '/imports/api/Collections.js';
import { Reservations } from '/imports/api/Collections.js';

Meteor.methods({
    
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
            etudiant: {
                _id: this.userId,
                fullName : user.lastName+' '+user.firstName
            },
            objets: panier.carted.map(item=>{return {_id:item._id,nom:item.nom}}),
            caution : panier.caution
        })
        Cart.remove(this.userId)
    }
})