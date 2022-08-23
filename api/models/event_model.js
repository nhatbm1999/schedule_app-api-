const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    event_name: {type: String, required: true},
    event_description: {type: String},
    event_image: {type: String}, 
    event_location_longitude: {type: Number, required: true},
    event_location_latitude: {type: Number, required: true},
    start_time: {type: Date},
    end_time: {type: Date},
    is_all_day: {type: Boolean, required: true},
});

module.exports = mongoose.model('Event', eventSchema);