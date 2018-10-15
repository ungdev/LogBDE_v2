import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Items } from '/imports/api/Collections.js';
import Item from '/imports/ui/Item.js';


export default class OverviewPage extends TrackerReact(Component) {
    constructor(props){
        super(props)
        this.state = {}
    }

    componentWillUnmount(){
        this.state.itemsSub.stop();
      }
      componentDidMount(){
        this.state.itemsSub = Meteor.subscribe('items')
      }

    renderItems(){
        let items = Items.find({}).fetch()
        return items.map((item) => (
            <Item key = {item._id} item = {item} />
        ));
    }

    render(){
        return(
            <div>
                <h1> App</h1>
                <ul>
                    {this.renderItems()}
                </ul>
            </div>
        )
    }
}