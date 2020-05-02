var mongoose = require('mongoose');//require mongoos
mongoose.connect('mongodb://localhost/employee', {useNewUrlParser: true});//cannect mongodb
var conn  = mongoose.connection;

var uploadSchema = new mongoose.Schema({
    imagename:  String, // String is shorthand for {type: String}
  });

  //create model
  var uploadModel = mongoose.model('uploadimage', uploadSchema);
  module.exports=uploadModel;
  