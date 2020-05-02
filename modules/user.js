var mongoose = require('mongoose');//require mongoos
mongoose.connect('mongodb://localhost/employee', {useNewUrlParser: true,useCreateIndex:true,});//cannect mongodb
var conn  = mongoose.connection;

var userSchema = new mongoose.Schema({
    username: { type:String,
        required:true,
        index:{
            unique:true,
        }

    } ,// String is shorthand for {type: String}
    email: { type:String,
        required:true,
        index:{
            unique:true,
        }

    } ,
    
    phone_no:{

        type:Number,
        required:true,
    
       },
    
   password:{

    type:String,
    required:true,

   },
   date:{
       type:Date,
       default:Date.now
   },
  });

  //create model
  var userModel = mongoose.model('user', userSchema);
  module.exports=userModel;
  