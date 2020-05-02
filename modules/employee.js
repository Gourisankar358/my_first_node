var mongoose = require('mongoose');//require mongoos    npm install mongoose
mongoose.connect('mongodb://localhost/employee', {useNewUrlParser: true});//cannect mongodb
var conn  = mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name:  String, // String is shorthand for {type: String}
    email: String,
    etype:   String,
    hourlyrate: Number,
    totalHour: Number,
    total: Number,
  });

  //create model
  var employeeModel = mongoose.model('Employee', employeeSchema);
  module.exports=employeeModel;
  