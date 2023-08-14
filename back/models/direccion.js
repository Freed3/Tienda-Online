'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DireccionSchema = Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    destinatario: {type: String, required: true},
    apellido : {type: String, required: true},
    cedula: {type: String, required: true},
    telefono: {type: String, required: true},
    direccion: {type: String, required: false},
    departamento: {type: String, required: true},
    ciudad: {type: String, required: true},
    numero : {type: String, required: false},
    apartamento : {type: String, required: false},
    postal: {type: String, required: true},
    
    principal: {type: Boolean, required: true},
    createdAt: {type:Date, default: Date.now, required: true}
});
module.exports =  mongoose.model('direccion',DireccionSchema);