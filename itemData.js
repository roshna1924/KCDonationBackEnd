var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

var itemSchema = mongoose.Schema({
  itemCategory: {type:String, required: true},
  itemName: {type:String, required: true},
  itemAddress: {type:String, required: true},
  itemExpiry: {type:Date , required: false},
  itemWeight: {type:Number, required: false},
  itemPrice: {type:Float, required: true},
  username : {type:String, required: false}
});

var itemData = module.exports = mongoose.model('itemData', itemSchema);


