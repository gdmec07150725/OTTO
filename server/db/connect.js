var mongoose = require('mongoose');
//连接vueDB数据库
exports.connect = function(callback){
    mongoose.connect('mongodb://localhost:27017/vueDB',{useNewUrlParser: true},(error)=>{
        if(error) throw error;
        else callback();
    })
};