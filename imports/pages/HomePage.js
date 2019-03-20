import React, { Component } from 'react'
import {Table, Popconfirm, Button, Badge,message} from 'antd';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class HomePage extends TrackerReact(Component) {

    deleteReservation = (_idItem,startDate) => {
        Meteor.call('deleteReservation',_idItem,startDate,(error,result)=>{
            if(error)
              message.error(error.reason)
            else{
              message.success('Reservation annule')
            }
        })
    }
    render(){
        if(!Meteor.userId())
            return <h1>Veuillez vous connecter</h1>

            const columns = [
                {title: 'Apercu',dataIndex: 'imageName',key: 'imageName',
                    render:(text)=>(
                        <img src={text} alt="image" />
                    )},
                {title: 'Name',dataIndex: 'name',key: 'name'},
                {title: 'Debut',dataIndex: 'startDate',key: 'startDate'},
                {title: 'Fin',dataIndex: 'endDate',key: 'endDate'},
                {title: 'Etat',dataIndex: 'status',key: 'status',
                    render:(text)=>{
                        let etat = ''
                        if(text == 'fini')
                            etat = 'default'
                        else if(text == 'reserve')
                            etat = 'processing'
                        else if(text == 'valide')
                            etat = 'success'
                        return<span><Badge status={etat} />{text}</span>
                    }},
                {title: 'Action',key: 'action',
                    render: (text, record) =>{
                        if(record.status == 'reserve')
                            return (<Popconfirm title="Annuler la reservation ?" onConfirm={() => this.deleteReservation(record._idItem,record.startDate)} onCancel={this.cancel} okText="Oui" cancelText="Non">
                                        <Button>Annuler reservation</Button>
                                    </Popconfirm> )
                        return null
                        
                    }
                        
                    }
            ];
            let data;
            if(Meteor.user().reservations)
                data = Meteor.user().reservations.map(el=>{ el.key = ''+el._idItem+el.startDate; return el})
        return(
            <Table columns={columns} dataSource={data} />     
        )
    }
}