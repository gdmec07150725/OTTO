//分类表
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var categoryModel = new Schema({
    category_id:{
        type: Number,
        required: true
    },
    category_name:{
        type:String,
        required:true
    },
}) 

//创建categorys表
let Category = mongoose.model('categorys',categoryModel);

//查询categorys表的所有数据
exports.searchCategory = function(callback){
    Category.find({},(error,message)=>{
        if(error) throw error;
        else{
            //导出数据
            // exports.categoryDetail = message
            callback(message);
        }
    })
};
//插入分类数据
exports.insertCategory = function(data,callback){
    Category.create(data,(error,returnData)=>{
        if(error) throw error;
        callback(returnData);
    })
}
//删除所有分类数据
exports.removeCategory = function(callback){
    Category.remove((error)=>{
        if(error) throw error;
        console.log('删除分类信息成功');
    })
}