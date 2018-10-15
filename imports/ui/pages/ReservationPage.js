import React from 'react'

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ListItems from '/imports/ui/user/ListItems.js'
import  Panier  from '/imports/ui/user/Panier.js'

  export default class ReservationPage extends TrackerReact(React.Component) {


    render(){
      return(
        <div>
        <Panier/>
        <br/>
        <hr/>
        <br/>
        <ListItems/>
        
        </div>
      )
    }
    
  }

  