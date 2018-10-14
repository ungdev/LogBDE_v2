import React, { Component } from 'react'
import { Row, Col } from 'antd';

import  AddItem  from '/imports/ui/admin/AddItem.js'
import SearchItem from '/imports/ui/admin/SearchItem.js'
import ApercuItems from '/imports/ui/admin/ApercuItems.js'

export default class GestionPage extends Component {
    render(){
        return(
            
            <div>
                <Row >
                    <Col className = "center" xs= {24} sm = {12} ><h1>Ajouter un produit</h1>
                        <AddItem />
                    </Col>
                    <Col className = "center" xs= {24} sm= {12} ><h1>Chercher / Modifier un Produit</h1>
                        <SearchItem />
                    </Col>
                </Row>
                <Row >
                <br/>
                <Col className = "center"><h1>Rechercher par Nom ou Statut</h1>
                 <ApercuItems />
                </Col>
                </Row>
            </div>
        )
    }
}