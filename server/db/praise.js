var mongoose = require('mongoose');
Schema = mongoose.Schema;
//利用mongoose定义数据架构
var praiseModel = new Schema({
    type_id: {//文章或者是评论   
        type: String,
        required: true
    },
    type: {//点赞类型，1--文章点赞 2--评论点赞
        type: Number,
        required: true
    },
    user_id: {//用户id
        type: String,
        required: true,
    },
    status: { //点赞状态 0--取消赞 1--有效赞
        type: Number,
        required: true,
        default: 0
    }
})
//创建Praise表
var Praise = mongoose.model('praise', praiseModel);

//文章点赞方法
exports.updateArticle_praise = function (data, callback) {
    Praise.find({ type_id: data.type_id, type: data.type, user_id: data.user_id }, function (error, message) {
        if (error) throw error;
        else {
            //说明数据库有这条数据,直接修改status的状态
            if (message.length > 0) {
                Praise.findOneAndUpdate({ type_id: data.type_id, type: data.type, user_id: data.user_id }, { status: data.status }, { new: true }, function (error, message) {
                    if (error) throw error;
                    else {
                        console.log("修改status后的数据为", message);
                        callback();
                    }
                })
            } else {
                //说明数据库没有这条数据,直接插入这条数据,并将status设为1
                Praise.create({ type_id: data.type_id, type: data.type, user_id: data.user_id, status: data.status }, function (error, message) {
                    if (error) throw error;
                    else {
                        console.log("插入status后的数据为", message);
                        callback();
                    }
                })
            }
        }
    })
}
//页面初始化的时候，文章点赞状态获取方法
exports.getArticle_praise = function (data, callback) {
    Praise.find({ type_id: data.type_id, type: data.type, user_id: data.user_id }, function (error, message) {
        if (error) throw error;
        else {
            callback(message);
        }
    })
}
//删除所有的点赞方法
exports.removepraise = function(callback){
    Praise.remove(function(error){
        if(error) throw error;
        else{
            callback();
        }
    })
}