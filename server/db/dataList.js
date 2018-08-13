//所有文章数据表
var mongoose = require('mongoose');
Schema = mongoose.Schema;
//利用mongoose定义数据架构
var DataModel = new Schema({
    title: {
        type: String,
        required: true
    },
    content_desc: {
        type: String,
        required: true
    },
    creat_time: {
        type: Date,
        default: Date.now,
        require: true
    },
    first_picture: {
        type: String,
        require: true
    },
    category_id: {
        type: Number,
        required: true
    }
})

//创建data表
var datasContent = mongoose.model('data', DataModel);

//查询全部数据
exports.searchAllDatas = function (callback) {
    datasContent.find({}, (error, message) => {
        if (error) throw error
        else {
            //导出数据
            // exports.datas = message;
            //继续执行回调
            callback(message);
        }
    })
};
//插入单条数据
exports.insertData = function (data, callback) {
    datasContent.find({ title: data.title }, (error, message) => {
        if (error) throw error
        else {
            //判断该数据是否已经存在
            if (message.length > 0) {
                exports.Msg = '该数据已经存在'
                callback();
            } else {
                datasContent.create(data, (error, returnData) => {
                    if (error) throw error;
                    else {
                        exports.Msg = '插入数据成功';
                        // //将插入数据后返回的_id返回出去
                        // exports.id = returnData._id;
                        callback(returnData);
                    }
                });
            }
        }
    })
};
//根据分类id查询对应的文章
exports.searchCategory = function (data, callback) {
    //category_id为0的时候，表示查找全部的文章
    if (data.category_id == 0) {
        datasContent.find(function (error, message) {
            if (error) throw error;
            else {
                callback(message);
            }
        })
    } else {
        datasContent.find({ category_id: data.category_id }, function (error, message) {
            if (error) throw error;
            else {
                callback(message);
            }
        })
    }
}
//模糊查询文章标题,获取文章列表
exports.blurrySearch = function (qs,callback) {
    datasContent.find({title: qs},function(error,message){
        if(error) throw error;
        else{
            callback(message);
        }
    })
}
//删除所有数据
exports.removeData = function (callback) {
    datasContent.remove((error) => {
        if (error) throw error;
        else {
            exports.Msg = '删除数据成功';
            callback();
        }
    })
}
//自定义disconnect函数，断开数据库连接
exports.disconnect = function () {
    mongoose.disconnect();
};
