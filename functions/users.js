var admin = require('firebase-admin');
const animales =require('../functions/animals')

  
var db = admin.database();
var ref = db.ref();

//obtener todos los usuarios
async function getUsers() {
    var usuarios=[]
    await ref.child("Users").once("value",function(snapshot) {
        snapshot.forEach(function (user){
            usuarios.push(user)
        } 
        )}, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return(usuarios) ;
}

//crear usuario
async function create(name, age) {
    let userCreado
    await lastId().then(v =>{        
    const id = parseInt(v) + 1;
    ref.child("Users").child(id).set({id, name,age})        
    userCreado={id, name,age}
    }) 
    return(userCreado)
    
}

//Actualizar usuario
async function update(id,name, age) {
    let myUser
    await ref.child("Users").child(id).once("value",function(snapshot) {
        myUser=snapshot.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    try {
      myUser.name = await name.length === 0 ? myUser.name: name;
      myUser.age = await age.length === 0 ? myUser.age: age;
      await ref.child("Users").child(id).set(myUser)
      return {myUser, err: null};
    } catch (err) {
        console.log(err)
      return {err, myUser: null}
    }

}


async function lastId() {
    var id=0;
    await ref.child("Users").limitToLast(1).once("value",function(snapshot) {
        snapshot.forEach(function(data) {
           id=data.key;
          });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return(id) ;
}

//Eliminar usuario
async function deleteUser(id) {
    deleteOwnerFrom(id)
    let object
    await ref.child("Users").child(id).once("value",function(snapshot) {
        object=snapshot.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    ref.child("Users").child(id).set(null)
    animales.deleteOwnerFrom(id);

    return object;
}
//Adoptar un animal
async function adopt(idOwner,idAnimal) {
    let owner
    await ref.child("Users").child(idOwner).once("value",function(snapshot) {
        owner=snapshot.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    if(owner){
        ref.child("Animals").child(idAnimal).child("owner").set(owner.name)
    }
    else{
        console.log("No se encontró ese usuario")
    }
}


function deleteOwnerFrom(idUser){
    getName(idUser).then(v=>{
        ref.child("Animals").once("value",function(snapshot) {
            snapshot.forEach(function (data){
                if(data.val().owner==v){
                    ref.child("Animals").child(data.val().id).child("owner").set("")
                }
            });
          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    })
    
}

async function getName(idUser) {
    let name
    await ref.child("Users").child(idUser).child("name").once("value",function(snapshot) {
         name=  snapshot.val()

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    return name
}

module.exports = {
    getUsers,
    create,
    update,
    deleteUser,
    adopt
};