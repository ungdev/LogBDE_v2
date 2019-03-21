
import moment from 'moment';
import {Items} from '/imports/collections/Collections.js'
import CheckableTag from 'antd/lib/tag/CheckableTag';

Meteor.methods({
    createReservation(id,startDate,endDate){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        let item = Items.findOne(id)

        if(!item)
            throw new Meteor.Error('Oups','Objet inconnu')
        
        for(const reservation of item.reservedBy){
            if(moment(startDate,'DD/MM/YYYY').isBetween(moment(reservation.startDate,'DD/MM/YYYY').startOf('day'), moment(reservation.endDate,'DD/MM/YYYY').endOf('day'),null,'()'))
                throw new Meteor.Error('Oups','Ne reserver pas un objet pendant un reservation ! 1')
            if(moment(endDate,'DD/MM/YYYY').isBetween(moment(reservation.startDate,'DD/MM/YYYY').startOf('day'), moment(reservation.endDate,'DD/MM/YYYY').endOf('day'),null,'[]'))
                throw new Meteor.Error('Oups','Ne reserver pas un objet pendant un reservation ! 2')
            if(moment(reservation.startDate,'DD/MM/YYYY').isBetween(moment(startDate,'DD/MM/YYYY').startOf('day'), moment(endDate,'DD/MM/YYYY').endOf('day'),null,'[]'))
                throw new Meteor.Error('Oups','Ne reserver pas un objet pendant un reservation ! 3')
            if(moment(reservation.endDate,'DD/MM/YYYY').isBetween(moment(startDate,'DD/MM/YYYY').startOf('day'), moment(endDate,'DD/MM/YYYY').endOf('day'),null,'()'))
                throw new Meteor.Error('Oups','Ne reserver pas un objet pendant un reservation ! 4')
        }

        let user = Meteor.users.findOne(this.userId)

        console.log(this.userId, id,startDate,endDate);

        Items.update(item._id, {
            $push : {
                reservedBy : {
                    _idEtudiant : this.userId,
                    fullName : user.lastName+" "+user.firstName,
                    startDate,
                    endDate
                }
            }
        })

        Meteor.users.update(this.userId, {
            $push :{
                reservations : {
                    _idItem : item._id,
                    startDate,
                    endDate,
                    imageName:item.imageName,
                    status:"reserve",
                    name:item.name
                }
            }
        })
    },
    deleteReservation(idItem,startDate,idEtudiant){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        let item = Items.findOne(idItem)

        if(!item)
            throw new Meteor.Error('Oups','Objet inconnu')

        let userId = this.userId;

        if(Roles.userIsInRole(this.userId,'admin',item.asso)){
            userId = idEtudiant
        }

        let reservation = item.reservedBy.find((el)=>{
            if(el._idEtudiant == userId && el.startDate == startDate)
                return el;
        })
        if(!reservation)
            throw new Meteor.Error('Oups','Reservation inconnu')

        if(reservation.isValide)
            throw new Meteor.Error('Oups','tu fais quoi frere ?')
        
        
        if(userId !== this.userId){
            Meteor.users.update({_id:userId,"reservations._idItem":idItem,"reservations.startDate":startDate}, {
                $set :{
                    "reservations.$.status" : "annule"
                }
            })
        }else{
            Meteor.users.update({_id:this.userId}, 
                { $pull: {reservations:{ _idItem: idItem,startDate:startDate  }}
            })
        }

        Items.update({_id:idItem},
            { $pull: {reservedBy:{ _idEtudiant: reservation._idEtudiant,startDate:startDate }}
        })
        
    },

    validerEmprunt(idItem,idEtudiant,startDate,endDate){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
            throw new Meteor.Error('Oups','You are not ADMIN')

        let item = Items.findOne(idItem)

        if(!item)
            throw new Meteor.Error('Oups','Objet inconnu')

        if(item.isBorrowed)
            throw new Meteor.Error('Oups','l\'objet est en pret')
        let reservation = item.reservedBy.find((el)=>{
            if(el._idEtudiant == idEtudiant)
                return el;
        })

        if(!moment(reservation.startDate,'DD/MM/YYYY').isSameOrBefore(moment()))
            throw new Meteor.Error('Oups','Vous ne pouvez plus valider cet emprunt')
        Items.update({
            _id:idItem,
            reservedBy: { $elemMatch: { _idEtudiant: { $eq: idEtudiant }, startDate: { $eq: startDate } } }
        },
        { $set: { "reservedBy.$.isValide" : true,
                    isBorrowed : true,
                }
        }
        )
        Meteor.users.update({_id:idEtudiant,"reservations._idItem":idItem}, {
            $set :{
                "reservations.$.status" : "valide"
            }
        })
    },

    createItem(name,description,location,suretyBond,asso){
        
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
            throw new Meteor.Error('Oups','You are not ADMIN')

        check(name,String)
        check(description,String)
        check(location,String)
        suretyBond = parseFloat(suretyBond);

        Items.insert({
            asso,
            name,
            description,
            location,
            suretyBond,
            isBorrowed:false,
            createdAt:moment().format('DD/MM/YYYY'),
            history:[],
            reservedBy:[],
            imageName:"http://dummyimage.com/200x100.png/5fa2dd/ffffff"
        }
        )
    },

    createRetour(idItem,description,caution,location,endDate){
         if(!this.userId)
             throw new Meteor.Error('Oups','You are not logged in')

         if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
             throw new Meteor.Error('Oups','You are not ADMIN')

         let item = Items.findOne(idItem)

         if(!item)
             throw new Meteor.Error('Oups','Objet inconnu')

         if(!item.isBorrowed)
             throw new Meteor.Error('Oups','l\'objet n\'a pas ete prete ?')

         let reservation = item.reservedBy.find(function(element) {
                 return element.endDate == endDate;
         });
         if(!reservation)
            throw new Meteor.Error('Oups','reservation introuvable')

        reservation._idLogeur = this.userId
        reservation.description = description
        reservation.location = location
        reservation.suretyBondTaken = caution ? parseFloat(caution) :0
        

             Items.update(idItem,
            {$push :{history:reservation},
            $pull:{ reservedBy:{_idEtudiant:reservation._idEtudiant, endDate: endDate }},
            $set:{isBorrowed:false,
                location,
                description
                    }}
             )
             Meteor.users.update({_id:reservation._idEtudiant,"reservations._idItem":idItem}, {
                $set :{
                    "reservations.$.status" : "fini",                
                }
            })
        
    },

    deleteItem(idItem){
        if(!this.userId)
             throw new Meteor.Error('Oups','You are not logged in')

         if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
             throw new Meteor.Error('Oups','You are not ADMIN')

        let item = Items.findOne(idItem)

        if(item.isBorrowed)
            throw new Meteor.Error('Oups','l objet est en pret')

         if(!item)
            throw new Meteor.Error('Oups','Objet inconnu')


        Items.remove(idItem);
        
        Meteor.users.update({},
        {
            $pull:{reservations:{ _idItem: idItem,status:"reserve"}}
        },
        {multi:true})
    },
    addAdmins(args){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')

        if(!Roles.userIsInRole(this.userId,'admin','bde'))
            throw new Meteor.Error('Oups','You are not ADMIN in bde')

        args = JSON.parse(args)

        for(userId of args.admins){
            for(role of args.asso){
                Roles.addUsersToRoles(userId, ['admin'],role);
            }
        }
    },

    seeProfil(idEtudiant){
        if(!this.userId)
            throw new Meteor.Error('Oups','You are not logged in')
        
        if(Roles.getGroupsForUser(this.userId,'admin').length == 0)
            throw new Meteor.Error('Oups','You are not ADMIN')

        check(idEtudiant,String)

        let user = Meteor.users.findOne(idEtudiant)
        if(user)
            return user.username

        throw new Meteor.Error('Oups','Etudiant inconnu')
    }
})