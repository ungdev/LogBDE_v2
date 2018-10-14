import React, { Component } from 'react';
 
// Task component - represents a single todo item
export default class Item extends Component {
  render() {
    return (
      <li>{this.props.item.nom}</li>
    );
  }
}