

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCmflt6A4BGfaZ1rw-Wmh6zbVmfaVqOkdY",
    authDomain: "faltantesflor.firebaseapp.com",
    databaseURL: "https://faltantesflor.firebaseio.com",
    projectId: "faltantesflor",
    storageBucket: "",
    messagingSenderId: "823242970822"
  };
  firebase.initializeApp(config);


var database= firebase.database();



$(document).on("click","#submit",function(){



var linea_prd= $('#linea').val()
var producto = $('#producto').val()
var color = $('#color').val()
var grado = $('#grado').val()
var tallos = $('#tallos').val()
var especificaciones = $('#especificaciones').val()


var newPostKey = firebase.database().ref().child('faltantesflor').push().key

 faltantes_data={
 faltantes_linea_prd:linea_prd,
 faltantes_producto:producto,
 faltantes_color:color,
 faltantes_grado:grado,
 faltantes_tallos:tallos,
 faltantes_especificaciones:especificaciones,
 faltantes_new_post_key:newPostKey,
 faltantes_cooler_status:0,
 faltantes_production_status:0,
 faltantes_request_on:moment(Date.now()).format(),
 faltantes_cooler_fill_on:0,
 faltantes_production_ok_on:0
  }

  var updates = {};
  updates[newPostKey] = faltantes_data;
  firebase.database().ref().update(updates);

})




database.ref().on("child_added",function(childsnapshot){

var production_stat=childsnapshot.val().faltantes_production_status
var cooler_stat=childsnapshot.val().faltantes_cooler_status
var text_production_btn='Pending'
var text_cooler_btn='Pending'
var cooler_btn_class='btn-danger'
var production_btn_class='btn-danger'



if (production_stat==1){
text_production_btn='Ok'
cooler_btn_class='btn-success'
}


if (cooler_stat==1){
text_cooler_btn='Ok'
production_btn_class='btn-success'
}


if( cooler_stat===0 || production_stat===0){

$('.info').prepend("<tr id='request_row'> <td>"+ moment(childsnapshot.val().faltantes_request_on).fromNow() +" </td>  <td>" + childsnapshot.val().faltantes_linea_prd +"</td> <td>" + childsnapshot.val().faltantes_producto +"</td> <td>" + childsnapshot.val().faltantes_color +"</td> <td>" + childsnapshot.val().faltantes_grado +"</td> <td>" + childsnapshot.val().faltantes_tallos  +"</td> <td>" + childsnapshot.val().faltantes_especificaciones +"</td> <td> <button class='cooler btn " + cooler_btn_class + " ' data='"+  childsnapshot.val().faltantes_new_post_key +"'  type='button'>"+ text_cooler_btn+  "</button> </td> <td> <button class='production btn " + production_btn_class + " ' data='"+  childsnapshot.val().faltantes_new_post_key +"'  type='button'>"+ text_production_btn + "</button> </td>  </tr>" )
}

})


$(document).on("click",".cooler",function(){


  // this section retrives the object from firebase 
  
var key=$(this).attr('data')
var line=$(this)

firebase.database().ref(key).once('value').then(function(snapshot){
    var cooler_status=snapshot.val().faltantes_cooler_status

  

// This section should change the status of the cooler varible

if(cooler_status==1){

  if (confirm('Desea regresar cambiar el status de esta orden?')) {
  database.ref(key).update({ faltantes_cooler_status: 0 })
  database.ref(key).update({ faltantes_cooler_fill_on: 0 })

  line.attr('class','btn btn-danger cooler')
  line.text('Pending')
  } 
  else{//Nothing Happen}


} }else {
  database.ref(key).update({ faltantes_cooler_status: 1 })
  database.ref(key).update({ faltantes_cooler_fill_on: moment(Date.now()).format() })
  line.attr('class','btn btn-success cooler')
  line.text('OK')
  }

})


})


$(document).on("click",".production",function(){
  // this section retrives the object from firebase 
  
 
var key=$(this).attr('data')
var line=$(this)

firebase.database().ref(key).once('value').then(function(snapshot){
    var production_status=snapshot.val().faltantes_production_status


// This section should change the status of the cooler varible

if(production_status==1){

  if (confirm('Desea regresar cambiar el status de esta orden?')) {
  database.ref(key).update({ faltantes_production_status: 0 })
  database.ref(key).update({ faltantes_production_ok_on: 0 })
  line.attr('class','btn btn-danger production')
  line.text('Pending')
  } 
  else{//Nothing Happen}


} }else {
  database.ref(key).update({ faltantes_production_status: 1 })
  database.ref(key).update({ faltantes_production_ok_on: moment(Date.now()).format() })
  line.attr('class','btn btn-success production')
  line.text('OK')
  }


})


})



//Code Snippet
////database.ref().push(faltantes_data)

//database.ref().on("value", function(snapshot) {
//  console.log(snapshot.val()); 
//}, function(errorObject) {
//  console.log("The read failed: " + errorObject.code);
//});
