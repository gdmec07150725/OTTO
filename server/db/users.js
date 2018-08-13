let mongoose = require('mongoose');
Schema = mongoose.Schema;
let userModel = new Schema({
    user_name: {
        type: String,
        required: true
    },
    user_password: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    picture_url: {
        type: String,
    },
    create_time: {
        type: Date,
        default: Date.now,
        required: true
    }
})

// 创建user表
let User = mongoose.model('user', userModel);

//登陆校验
exports.loginValidate = function (data, callback) {
    User.find({ phone_number: data.phone_number, user_password: data.user_password }, function (error, message) {
        if (error) throw error;
        else {
            //校验成功
            if (message.length > 0) {
                exports.Msg = '登陆成功'
                exports.Username = message[0].user_name
                exports.Userid = message[0]._id
                callback();
            } else {
                exports.Msg = '手机号或者密码错误'
                exports.Username = ''
                callback();
            }
        }
    })
}
//插入用户信息
exports.insertUser = function (data, callback) {
    //查找数据表中是否有这个用户
    User.find({ user_name: data.user_name }, function (error, message) {
        if (error) throw error;
        else {
            //判断用户名是否已经存在
            if (message.length > 0) {
                exports.Msg = '该用户名已经存在'
                callback();
            } else {
                //查看手机号码时候存在
                User.find({ phone_number: data.phone_number }, function (error, message) {
                    if (error) throw error;
                    else {
                        if (message.length > 0) {
                            exports.Msg = '该手机已被注册'
                            callback();
                        }
                        else {
                            //插入该用户信息，新增一个用户
                            User.create(data, function (error, message) {
                                if (error) throw error;
                                else {
                                    exports.Msg = '注册成功';
                                    exports.Username = message.user_name
                                    exports.Userid = message._id
                                    console.log(message);
                                    callback();
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}
//根据用户名查询用户信息
exports.searchUserDetail = function (username, callback) {
    User.find({ user_name: username }, function (error, message) {
        if (error) throw error;
        else {
            callback(message);
        }
    })
}
//根据用户名插入用户的头像
exports.insertPictureUrl = function (data, callback) {
    User.findOneAndUpdate(
        { user_name: data.username },
        { picture_url: data.pictureurl },
        { new: true },
        (error, message) => {
            if (error) throw error;
            else {
                exports.Msg = '头像上传成功'
                callback(message);
            }
        }
    )
}

