import React, { Component } from 'react'
import { Row, Col, List, Card } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Reservations, Emprunts } from '/imports/api/Collections.js';
import Item from '/imports/ui/Item.js';



export default class OverviewPage extends TrackerReact(Component) {
    constructor(props){
        super(props)
        this.state = {}
    }

    componentWillUnmount(){
        this.state.empruntsSub.stop();
        this.state.reservationsSub.stop();
      }
      componentDidMount(){
        this.state.empruntsSub = Meteor.subscribe('emprunts')
        this.state.reservationsSub = Meteor.subscribe('reservations')
      }


    renderEmprunts(){
        return(<List
            grid={{ gutter: 16, column: 2 }}
            dataSource={Emprunts.find({}).fetch().map(item =>{
                return {
                    key:item._id,
                    etudiant:item.etudiant,
                    objets:item.objets.map(function(objet, index){
                        if(index == 0 || index == item.objets.length - 1){
                          return objet.nom
                        }else{
                          return objet.nom+"/ "
                        }}),
                    caution:item.caution
                }
            }
        )}
            renderItem={item => {
                console.log(item)
                return(
                <List.Item>
                    <Card title={"caution : "+item.caution}>{item.objets}</Card>
                </List.Item>
            )}}
        />)
    }

    renderReservations(){
        return(<List
            grid={{ gutter: 16, column: 2 }}
            dataSource={Reservations.find({}).fetch().map(item =>{
                return {
                    key:item._id,
                    etudiant:item.etudiant,
                    objets:item.objets.map(function(objet, index){
                        if(index == 0 || index == item.objets.length - 1){
                          return objet.nom
                        }else{
                          return objet.nom+"/ "
                        }}),
                    caution:item.caution
                }
            }
        )}
            renderItem={item => {
                console.log(item)
                return(
                <List.Item>
                    <Card title={"caution : "+item.caution}>{item.objets}</Card>
                </List.Item>
            )}}
        />)
    }

    render(){
        return(
            <div>
                <Row >
                    <Col className = "center" xs= {24} sm = {12} ><h1>Mes réservations</h1>
                        {this.renderReservations()}
                    </Col>
                    <Col className = "center" xs= {24} sm= {12} ><h1>Mes Emprunts</h1>
                        {this.renderEmprunts()}
                    </Col>
                </Row>
            </div>
        )
    }
}