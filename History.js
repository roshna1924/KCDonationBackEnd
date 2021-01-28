var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

var historySchema = mongoose.Schema({
  donarName: {type:String, required: true},
  donarAddedDate: {type:Date, required: true},
  itemCategory: {type:String, required: true},
  itemName: {type:String, required: true},
  itemExpiry: {type:Date, required: false},
  itemWeight: {type:Number, required: false},
  itemPrice: {type:Float, required: true},
  itemAddress: {type:String, required: true},
  requesterName: {type:String},
  requesterCompDate: {type:Date},
  referenceId : {type: Object}
});

var History = module.exports = mongoose.model('History', historySchema);

