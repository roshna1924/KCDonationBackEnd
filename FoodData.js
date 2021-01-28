var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

var foodSchema = mongoose.Schema({
  foodName: {type:String, required: true},
  foodAddress: {type:String, required: true},
  foodExpiry: {type:Date , required: true},
  foodWeight: {type:Number, required: true},
  foodPrice: {type:Float, required: true}
});

var FoodData = module.exports = mongoose.model('FoodData', foodSchema);


