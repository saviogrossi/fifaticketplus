var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
	name: String
});

//Transform
BearSchema.set('toJSON', {
	virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Bear', BearSchema);