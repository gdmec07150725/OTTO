//文章数据细节表
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var detailModel = new Schema({
    article_title:{
        type: String
    },
    detail_id: {
        type: String,
        required: true
    },
    all_pictureUrl: {
        type: [String],//定义为数组,用于存储多张图片链接,

    },
    content_desc: {
        type: String,

    }
})

//创建detaDetail表
let dataDetails = mongoose.model('dataDetail', detailModel);

//将_id插入到detail_id字段
exports.insertdetailId = function (data, callback) {
    dataDetails.create({ detail_id: data._id }, (error) => {
        if (error) throw error;
        else {
            exports.Msg = '插入detail_id成功';
            callback();
        }
    })
};
//通过detail_id值查询具体信息
exports.searchDetail = function (data, callback) {
    dataDetails.find({ detail_id: data }, (error, message) => {
        if (error) throw error;
        else {
            callback(message);
        }
    })
};

//通过detail_id值插入数据
exports.insertpictureUrlAndDesc = function (data, callback) {
    console.log('接收到的数据是', data);
    dataDetails.findOneAndUpdate(
        { detail_id: data.detail_id },
        {   article_title: data.article_title,
            all_pictureUrl: data.all_pictureUrl, 
            content_desc: data.content_desc 
        },
        {new: true },
        (error,message) => {
            if (error) throw error;
            else {
                exports.Msg = '插入图片和描述成功'
                callback(message);
            }
        })
};
//删除所有数据
exports.removeAllDetail = function (callback) {
    dataDetails.remove(function (error) {
        if (error) throw error;
        else {
            callback();
        }
    })
}
