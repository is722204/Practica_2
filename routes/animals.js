const express = require('express');
const Joi = require('joi');
const router = express.Router();
const axios = require('axios');

const data =require('../functions/animals')




const schema = Joi.object({

    animalname:Joi.string().min(5).required(),
    animalage: Joi.string().required(),
    breedname:Joi.string(),
    basecolour: Joi.string(),
    speciesname:Joi.string()
});



//Get: Obtiene todos los animales
router.get("/",(req,res)=>{
    data.getAnimals().then( v=>{
        const animalsPromises = v.map(() => {
            return new Promise((resolve, reject) => {
              axios.get('https://api.thecatapi.com/v1/images/search')
              .then(function({data}) {
                const [cat] = data;
                const {url} = cat;
                resolve(url);
              }).catch(function(error) {
                reject(error);
              });
            });
          });
    Promise.all(animalsPromises)
    .then(function(urls) {
      const animalsWithImage = v.map((animal, index) => ({...animal, image: urls[index]}));
      const user=req.user
      res.render('index', {data:{animalsWithImage},user:{user}});
    })
    .catch(function(errors) {
      res.send(`${errors}`)
    });


        //res.render("index",{v})
    })   
})

router.get("/:id",(req,res)=>{
    const {id} = req.params;
    data.getAnAnimal(id).then(v=>{
        const {url} = req.query;
        //console.log({animalname: v.animalname , v, image: url})
        const user=req.user
        res.render("animals", {data:{properties: v, image: url},user:{user}})
    })

})
router.get("/adopt/:id",(req,res)=>{
    const {id} = req.params;
    data.getAnAnimal(id).then(v=>{
        const user=req.user
        res.render("adopt", {v:{v},user:{user}})
    })

})


//Post: Agrega un animal a la DB
router.post("/",(req,res)=>{
    const {animalname,breedname,basecolour,speciesname,animalage} = req.body;
    const result = schema.validate({animalname,breedname,basecolour,speciesname,animalage});
    if (result.error) return res.status(400).send(result.error.details[0].message);
    data.create(animalname,breedname,basecolour,speciesname,animalage).then(v=>{
        res.send(v);
    })

    
})

//Put: Actualizar un animal en la DB
router.post('/:id', (req, res, next) => {
    console.log("se metió")
    const {id} = req.params;
    const {
          animalname= '',breedname= '',
          basecolour= '',speciesname= '',
          animalage= ''} = req.body;
    const result = schema.validate({animalname,breedname,basecolour,speciesname,animalage});
    
    if (result.error) return res.status(400).send(result.error.details[0].message);
    data.update(id, animalname,breedname,basecolour,speciesname,animalage).then(v=>{
        if (v.err) return next();
        res.send(v.myAnimal);
    })
    
});

//DELETE: Borra un animal
router.delete('/:id', (req, res) => {
    const {id} = req.params;
  
    data.deletePet(id).then(v=>{
        res.send(v);
    })
    
});
  


module.exports = router;

