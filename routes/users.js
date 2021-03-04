const express = require('express');
const Joi = require('joi');
const router = express.Router();
const data =require('../functions/users')

//Esquema para validar Usuarios
const schema = Joi.object({
    name:Joi.string().min(5).required(),
    age: Joi.number().min(1).required(),
});

//Get: Obtiene todos los usuarios
router.get("/",(req,res)=>{
    data.getUsers().then(v=>{
        res.send(v);
    })
    
})

//POST: agregar usuario, requiere validación
router.post("/",(req,res)=>{
    const {name,age} = req.body;
    const result = schema.validate({name,age});
    if (result.error) return res.status(400).send(result.error.details[0].message);
    data.create(name,age).then(v=>{
        res.send(v);
    }) 
})

//Put: Actualizar un usuario en la DB
router.put('/:id', (req, res, next) => {
    const {id} = req.params;
    const {
          name= '',age= ''} = req.body;

    const result = schema.validate({name,age});
    if (result.error) return res.status(400).send(result.error.details[0].message);  
    data.update(id, name,age).then(v=>{
        if (v.err) return next();
        res.send(v.myUser);
    })
    
});

//DELETE: Eliminar de la base de datos, regresa el usuario
router.delete('/:id', (req, res) => {
    const {id} = req.params;
  
    data.deleteUser(id).then(v=>{
        res.send(v);
    })
    
});
//Asignar el owner
router.get("/own/:idAnimal",(req,res)=>{
    const owner=req.query.ownerVar
    const {idAnimal} = req.params;
    data.adopt(owner,idAnimal)
    res.redirect("/animals")
})

module.exports = router;

