var express = require('express');
var router = express.Router();
var crypto = require('crypto');//引入数据加密模块
//引入数据库操作方法
var connect = require('../db/connect');
var users = require('../db/users');
//引入七牛模块，将图片上传到七牛上面
let qiniu = require('qiniu');

// 跨域请求处理
router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
//  GET users listing. 
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//用户登陆
router.post('/login', function (req, res, next) {
  //接收前端发过来的数据
  if (req.body) {
    var sourcedata = req.body;
    // 加密密码
    //生成口号的散列值
    var md5 = crypto.createHash('md5');
    var md5password = md5.update(sourcedata.password).digest('base64');//输出摘要
    var data = {
      phone_number: sourcedata.phonenumber,
      user_password: md5password
    }
    //将登陆信息跟后端数据库进行比较
    connect.connect(function(){
      users.loginValidate(data,function(){
        let backMessage = {
          Msg: users.Msg,//将提示信息返回给前端
          Username: users.Username, //返回用户名
          Userid: users.Userid //返回用户id
        }
        res.status(200).send(backMessage);
      })
    })
  }
})
//用户注册API
router.post('/register', function (req, res, next) {
  if (req.body) {
    var sourcedata = req.body;
    // 加密密码
    //生成口号的散列值
    var md5 = crypto.createHash('md5');
    var md5password = md5.update(sourcedata.password).digest('base64');//输出摘要
    var data = {
      user_name: sourcedata.username,
      user_password: md5password,
      phone_number: sourcedata.phonenumber
    }
    console.log(data);
    // 将新用户保存到用户表中
    connect.connect(function () {
      users.insertUser(data, function () {
        let backMessage = {
          Msg: users.Msg,//将提示信息返回给前端
          Username: users.Username, //返回用户名
          Userid: users.Userid //返回用户id
        }
        res.status(200).send(backMessage);
      })
    })
  }
})
//获取用户信息API
router.post('/getuserdetail', function (req, res, next) {
  //接收前端发送过来的数据
  if (req.body) {
    //通过用户名查询用户信息
    var username = req.body.username;
    connect.connect(function () {
      users.searchUserDetail(username, function (message) {
        res.send(message);
      })
    })
  }
})
//接收用户上传的头像
router.post('/userpicture', function (req, res, next) {
  console.log(req.files);
  console.log(req.body);
  //将上传上来的图片传给七牛云，直接返回一个图片链接
  //七牛的配置信息
  //要上传的空间名
  let bucket = 'lng-blog-imges';
  //填写accesskey
  let accessKey = '4aIK25wKt7NLLUM4yYes9ZAq64pdDYhuLkHFn31R';
  //填写secretKey
  let secretKey = 'BXYYvbVvD788Eb_mxi9Qh_PdAp6zR5taM8FY6AUn';
  //定义鉴权对象mac
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  let options = {
    scope: bucket,
  };

  let putPolicy = new qiniu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(mac);
  //构建上传用的config对象
  let config = new qiniu.conf.Config();
  //空间对应的机房.华东地区的机房为z0,华北为z1，华南为z2，北美为na0
  config.zone = qiniu.zone.Zone_z0;

  let picture = req.files.picture;
  let formUploader = new qiniu.form_up.FormUploader(config);
  let putExtra = new qiniu.form_up.PutExtra();
  //要输入完整的路径才可以将文件上传到七牛
  let localFile = picture.path;
  //保存到七牛的文件名称,用原来的文件名称
  let key = picture.originalname;
  //文件上传到七牛
  formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
    if (respErr) {
      res.end(JSON.stringify({ status: '101', msg: '上传失败', error: respErr }));
    }
    if (respInfo.statusCode == 200) {
      //向客户端返回图片的外链
      let imageSrc = 'http://oydsbb0dn.bkt.clouddn.com/' + respBody.key;
      // res.send(JSON.stringify({ status: '100', msg: '上传成功', imageUrl: imageSrc }));
      //将返回来的图片链接保存到当前用户的头像字段
      let data = {
        username: req.body.username,
        pictureurl: imageSrc
      }
      connect.connect(function () {
        users.insertPictureUrl(data, function (message) {
          res.send(message);
        })
      })
    } else {
      res.send(JSON.stringify({ status: '101', msg: '上传失败', error: JSON.stringify(respBody) }));
    }
  });
})
module.exports = router;
