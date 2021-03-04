var admin = require('firebase-admin');
var db = admin.database();
var ref = db.ref();
async function findOrCreate(user) {
    var users=[]
    flag=false;
    await ref.child("UsersGoogle").once("value",function(snapshot) {
        snapshot.forEach(function (u){
            users.push(u.key)
        } 
        )}, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    users.forEach(element => {
        if(element==user.GoogleID){
            console.log("se encontró")
            flag=true;
        }
    });
    if(flag){
        return(user)
    }
    ref.child("UsersGoogle").child(user.GoogleID).set(user)
    return(user)
    //return(user);
}



module.exports = {
    findOrCreate
};