import React from 'react'

import ListItems from '/imports/ui/user/ListItems.js'
import  {Panier}  from '/imports/ui/user/Panier.js'

  export default class ReservationPage extends React.Component {


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

  