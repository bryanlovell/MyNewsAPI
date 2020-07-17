var mongoose = require('mongoose');

var infoSchema = new mongoose.Schema({
    keyword: String
}, {
    timestamps: true
})


var compinfo = mongoose.model('News', infoSchema, 'ArticleInfo');
module.exports = compinfo;
