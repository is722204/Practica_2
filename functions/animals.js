var admin = require('firebase-admin');


const serviceAccount=require("../practica1-a688a-firebase-adminsdk-8wrlb-9253faa409.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://practica1-a688a-default-rtdb.firebaseio.com"
});
  
var db = admin.database();
var ref = db.ref();


//obtener todos los animales
async function getAnimals() {
    var animales=[]
    await ref.child("Animals").once("value",function(snapshot) {
        snapshot.forEach(function (animal){
            animales.push(animal.val())
        } 
        )}, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return(animales) ;
}

//obtener un animal
async function getAnAnimal(id) {
    var animal
    await ref.child("Animals").child(id).once("value",function(snapshot) {
       animal=snapshot.val()
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return(animal) ;
}



//Crear animal
async function create(animalname,breedname,basecolour,speciesname,animalage) {
    let animalCreado
    await lastId().then(v =>{        
    const id = parseInt(v) + 1;
    ref.child("Animals").child(id).set({id, animalname,breedname,basecolour,speciesname,animalage,"owner":""})        
    animalCreado={id, animalname,breedname,basecolour,speciesname,animalage,"owner":""}
    }) 
    return(animalCreado)
    
}

//Actualizar un animal
async function update(id,animalname,breedname,basecolour,speciesname,animalage) {
    let myAnimal
    await ref.child("Animals").child(id).once("value",function(snapshot) {
        myAnimal=snapshot.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    try {
      myAnimal.animalname = await animalname.length === 0 ? myAnimal.animalname: animalname;
      myAnimal.breedname =await breedname.length === 0 ? myAnimal.breedname: breedname;
      myAnimal.basecolour =await basecolour.length === 0 ? myAnimal.basecolour: basecolour;
      myAnimal.speciesname = await speciesname.length === 0 ? myAnimal.speciesname: speciesname;
      myAnimal.animalage =await animalage.length === 0 ? myAnimal.animalage: animalage;
      await ref.child("Animals").child(id).set(myAnimal)
      return {myAnimal, err: null};
    } catch (err) {
        console.log(err)
      return {err, myAnimal: null}
    }

}
//Eliminar un animal
async function deletePet(id) {
    let object
    await ref.child("Animals").child(id).once("value",function(snapshot) {
        object=snapshot.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    ref.child("Animals").child(id).set(null)

    return object;
}


async function lastId() {
    var id=0;
    await ref.child("Animals").limitToLast(1).once("value",function(snapshot) {
        snapshot.forEach(function(data) {
           id=data.key;
          });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return(id) ;
}

//Eliminar el dueño del animal 
//Se llama cuando se elimina un usuario
function deleteOwnerFrom(idUser){
    ref.child("Animals").once("value",function(snapshot) {
        //console.log(snapshot.val()[1].owner)
        snapshot.forEach(function (data){
            if(data.val().owner==idUser){
                //data.child("owner").set(null)
                ref.child("Animals").child(data.val().id).child("owner").set("")
            }
        });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}



module.exports = {
    getAnimals,
    create,
    update,
    deletePet,
    deleteOwnerFrom,
    getAnAnimal
};