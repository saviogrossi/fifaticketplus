var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TicketSchema   = new Schema({
	isoDate: { type: String, index: true },
	ticketsAll: [],
	ticketsZero: [],
    ticketsForUs: []
});

//Transform
TicketSchema.set('toJSON', {
	virtuals: true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Ticket', TicketSchema);