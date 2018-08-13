//评论表
var mongoose = require('mongoose');
Scheam = mongoose.Schema;
//定义评论表数据模型
var commentModel = new Schema({
    article_id: {
        type: String,
        required: true
    },
    comment_userId: {//通过用户id查找到用户表中该用户信息
        type: Schema.Types.ObjectId, ref: 'user',
        required: true
    },
    comment_user: {//评论者的名称,回复别人的评论的时候,需要用到
        type: String,
        required: true
    },
    comment_content: {
        type: String,
        required: true
    },
    reply: [ //通过被回复评论的_id查找被回复的评论
        {
            type: Schema.Types.ObjectId, ref: 'comments'
        }
    ],
    create_time: {
        type: Date,
        default: Date.now,
        required: true
    }
})

//创建comments表
var Comments = mongoose.model('comments', commentModel);

//根据文章Id查询该文章的全部评论
exports.searchComments = function (articleId, callback) {
    console.log(articleId);
    //如果有reply,说明这是一条回复评论的评论。则使用populate查询，用_id关联被评论数据
    Comments.find({ article_id: articleId }).populate('comment_userId reply', 'user_name picture_url comment_user comment_content').exec(function (error, message) {
        if (error) throw error;
        else {
            callback(message);
        }
    })
}
//插入文章的评论
exports.insertComment = function (oneComment, callback) {
    Comments.create(oneComment, (error, message) => {
        if (error) throw error;
        else {
            exports.Msg = '评论成功';
            callback(message);
        }
    })
}

//删除所有的文章评论(用于调试)
exports.removeComment = function (articleComment_ids,callback) {
    Comments.remove({article_id:articleComment_ids},(error) => {
        if (error) throw error;
        else {
            callback();
        }
    })
}


