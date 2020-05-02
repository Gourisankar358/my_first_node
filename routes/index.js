var express = require('express'); //express requre
var empmodel=require('../modules/employee'); //model requeir
var uploadmodel=require('../modules/upload');
var userdmodel=require('../modules/user');

var multer=require('multer'); //file upload parpose  npm install multer
var path=require('path'); //path setting
var jwt = require('jsonwebtoken');//login purpose npm install jsonwebtoken
var bcrypt = require('bcryptjs');//npm install bcryptjs password encript

/* login */

//npm install node-localstorage

/* file upload */
// npm install multer

var router = express.Router();


employee=empmodel.find({});
imaheupload=uploadmodel.find({});

router.use(express.static(__dirname+"./public/"));

//login parpous

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//file upload parpous
var Storage=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{

    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
}

);

// upload m
var upload=multer({
storage:Storage
}).single('ff');

function checkEmail(req,res,next)
{
  var email_id=req.body.email;
  var checkexitemail=userdmodel.findOne({email:email_id});
  checkexitemail.exec((err,data)=>
  {
     if(err) throw err;
     if(data)
     {
      return res.render('register', { title: 'register',msg:'Email already exit'});
     }
     next();
  });
}

function checkUsername(req,res,next)
{
  var user_name=req.body.username;
  var checkexitusername=userdmodel.findOne({username:user_name});

  checkexitusername.exec((err,data)=>
  {
     if(err) throw err;
     if(data)
     {
    return res.render('register', { title: 'register',msg:'Username already exit'});
     }
     next();
  });
}




//middleware for login
function checklogin(req,res,next){
  mytoken=localStorage.getItem('useToken');
  try {
    var decoded = jwt.verify(mytoken, 'loginToken');
    
  } catch(err) {
   // res.send('fhjj');
    res.redirect('/login')
  }
next();
}

/* GET home page. */


// index rout
router.get('/',checklogin,function(req, res, next) {

  var loginUser=localStorage.getItem('loginUser');

  employee.exec(function(err,data)
  {
    if(err) throw err;
    res.render('index', { title: 'employee record',records:data,success:''});
  });
});



//log in route

router.get('/login', function(req, res, next) {

var loginUser=localStorage.getItem('useToken');

if(loginUser)
{
  res.redirect('/');
}else{

  res.render('login', { title: 'login',msg:''});
}

 
});


router.post('/login', function(req, res, next) {

var username=req.body.username;
var password=req.body.password;
var checkuser=userdmodel.findOne({username:username});
checkuser.exec((err,data)=>
{
if(err) throw err;
var getUserID=data._id;
var getpassword=data.password;

if(bcrypt.compareSync(password,getpassword))
{
  var token = jwt.sign({ uderID: getUserID }, 'loginToken');

  localStorage.setItem('useToken', token);
  localStorage.setItem('loginUser', username);

  res.redirect('/');
}
else{

  res.render('login',{title:'login page', msg:'invalid usename password'});
}
}); 
});



 router.get('/register', function(req, res, next) {
  var loginUser=localStorage.getItem('useToken');
  if(loginUser)
  {
    res.redirect('/');
  }else{
  res.render('register', { title: 'register',msg:''});
  }
});



router.post("/register",checkEmail,checkUsername, function(req,res,next)
{

  var user_name=req.body.username;
  var email_id=req.body.email;
  var phone=req.body.phone_no;
  var password=req.body.password;
  var confirmpassword=req.body.confirm_password;

  if(password!=confirmpassword)
  {
    res.render('register', { title: 'register',msg:'password not match'});
  }
  else{

    password=bcrypt.hashSync(req.body.password,10);
    var userdetails= new userdmodel({
    username:user_name,
    email:email_id,
    phone_no:phone,
    password:password,

  });
  userdetails.save((err,doc)=>{

    if(err) throw err;
    res.render('register', { title: 'register',msg:'user register successfully'});



  });
  
  }
});



router.get('/login1', function(req, res, next) {

  var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  localStorage.setItem('mytoken', token);
res.send('login successfully');
 
});


//logout router
router.get('/logout', function(req, res, next) {

  localStorage.removeItem('useToken');
  res.send('login successfully');
 
});







//file upload post rout
router.post('/upload',upload,  function(req, res, next) {
  var imageFile=req.file.filename;
  var success=req.file.filename+" upload successfully";

var imageDetails=new uploadmodel({

imagename:imageFile
});
imageDetails.save(function(err,doc)
{
if(err) throw err;


imaheupload.exec(function(err,data)
{
  if(err) throw err;
  res.render('upload', { title: 'employee record',records:data,success:success});
});

  //res.render('upload', {title: 'file upload',success:success});


});
});


//file upload get rout
router.get('/upload', function(req, res, next) {
    
imaheupload.exec(function(err,data)
{
  if(err) throw err;
  res.render('upload', { title: 'employee record',records:data,success:''});
});

});


//idex post rout
router.post("/", function(req,res,next)
{
var empDetails = new empmodel(
{
name:req.body.uname,
email:req.body.email,
etype:req.body.emptype,
hourlyrate:req.body.hrlyrate,
totalHour:req.body.ttlhr,
total:parseInt(req.body.hrlyrate)*parseInt(req.body.ttlhr),

});
empDetails.save(function(err,res1)
{

  if(err) throw err;
  employee.exec(function(err,data)
  {
    if(err) throw err;
    res.render('index', { title: 'employee record',records:data,success:'record insert successfully' });
  });
}); 
});

//search post route

router.post("/search/", function(req,res,next)
{
var flrtName=req.body.uname;
var email=req.body.email;
var hourly=req.body.hourly;

if(flrtName!="" && email!="" && hourly!="")
{
    var filterParamiter={$and:[{ name:flrtName},
    {$and:[{email:email},{etype:hourly}]}
     
    ]
  }
}

else if(flrtName=="" && email!="" && hourly!="")
{

  var filterParamiter={$and:[{ email:email},{etype:hourly}]}
     
}
else if(flrtName=="" && email=="" && hourly!="")
{

  var filterParamiter={etype:hourly}
     
}
else{
  var filterParamiter={}

}
 

employeefilter=empmodel.find(filterParamiter);
employeefilter.exec(function(err,data)
  {
    if(err) throw err;
    res.render('index', { title: 'employee record',records:data,success:''});
  });
});

//delete get route
router.get('/delete/:id', function(req, res, next) {

  var id=req.params.id;
  var del=empmodel.findByIdAndDelete(id);
  del.exec(function(err)
  {
    if(err) throw err;
    res.redirect("/");
  });
});

//edit get route

router.get('/edit/:id', function(req, res, next) {

  var id=req.params.id;
  var edit=empmodel.findById(id);
  edit.exec(function(err,data)
  {
    if(err) throw err;
    res.render('edit', { title: 'Edit employee record', records:data });

  });
});

//edit post route
router.post('/update/', function(req, res, next) {

  var id=req.body.id;
  var update=empmodel.findByIdAndUpdate(id,{

    name:req.body.uname,
    email:req.body.email,
    etype:req.body.emptype,
    hourlyrate:req.body.hrlyrate,
    totalHour:req.body.ttlhr,
    total:parseInt(req.body.hrlyrate)*parseInt(req.body.ttlhr),
    

  });
  update.exec(function(err,data)
  {
    if(err) throw err;
    res.redirect('/');

  });
});


module.exports = router;
