import { Mongo } from 'meteor/mongo';

export const Items = new Mongo.Collection("items")

export const Cart = new Mongo.Collection('cart')

export const Reservations = new Mongo.Collection('reservations')

export const Emprunts = new Mongo.Collection('emprunts')
