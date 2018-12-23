import React, { Component } from 'react'
import { Row, Col, List, Card } from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Reservations, Emprunts } from '/imports/api/Collections.js';
import Item from '/imports/ui/Item.js';


const data = [
    {
      _id:"test",
      emprunts : [
        {
            date: '20/09/1998',
            suretyBondTaken:null,
            items :[{
                        name : 'test',
                        _id:1
                    },
                    {
                        name : 'test2',
                        _id:2
                    }
                ]
        },
        {
            date: '20/10/1998',
            suretyBondTaken:0,
            items :[{
                name : 'test3',
                _id:3
            },
            {
                name : 'test4',
                _id:4
            }
        ]
            
        },
        {
            date: '20/10/1998',
            suretyBondTaken:2.5,
            items :[{
                name : 'test5',
                _id:5
            },
            {
                name : 'test6',
                _id:6
            }
        ]
        }
      ]
    }
  ]

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
            // dataSource={Emprunts.findOne({_id:Meteor.userId()})}
            dataSource={data}
            renderItem={item => {
                let nbEmprunt = 0
                return item.emprunts.map(element =>{
                    
                    return (
                        <List.Item key={++nbEmprunt} >
                            <List.Item.Meta
                            title={'le '+element.date+', caution prise : '+(element.suretyBondTaken ? element.suretyBondTaken : 0)}
                            description={element.items.map(function(item,index){
                                if(index +1 == element.items.length)
                                    return <a key={item._id} >{item.name}</a>
                                else return <a key={item._id} >{item.name+', '}</a>
                            })}
                            />
                        </List.Item>
                    )
                })
            }}
                
                
            
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