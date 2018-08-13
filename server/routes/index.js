var express = require('express');
var router = express.Router();
var request = require('superagent')//引入superagent模块用于发起目标地址请求
var superagent = require('superagent-charset')(request)//解决编码问题
var cheerio = require('cheerio');//用来获取抓取到的页面元素和其中的数据信息
var Nightmare = require('nightmare');          // 自动化测试包，处理动态页面
var nightmare = Nightmare({ show: true });     // show:true  显示内置模拟浏览器
//引入数据库的操作方法
var connect = require('../db/connect');//连接数据库
var category = require('../db/category');//文章分类api
var dataList = require('../db/dataList');//文章列表api
var dataDetail = require('../db/dataDetail');//文章详情api
var comment = require('../db/comment');//文章评论api
var praise = require('../db/praise');//文章/评论点赞api

//跨域请求处理
router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getlunbo', function (req, res, next) {
  var swiperNews = {};
  //获取新闻轮播图数据方法
  var getSwiperNews = function (htmlStr) {
    let todayNews = [];
    let $ = cheerio.load(htmlStr);
    $('div.swipe-pics a').each(function (index, ele) {
      let news = {
        url: $(ele).attr('href'),
        img_url: $(ele).find('img').attr('src'),
        title: $(ele).find('h2.tit').text()
      };
      todayNews.push(news);
    });
    return todayNews;
  }
  nightmare
    .goto('https://new.qq.com/ch/photo/')//获取腾讯新闻轮播图信息
    .wait("div#List")
    .evaluate(() => document.querySelector("div#List").innerHTML)
    .then(htmlStr => {
      // 获取新闻页面轮播图数据
      swiperNews = getSwiperNews(htmlStr)
      //将获取到的数据返回给前端
      res.json(swiperNews);
    })
    .catch(error => {
      console.log(`轮播图新闻抓取失败 - ${error}`);
    })
});
router.get('/getNewsList', function (req, res, next) {
  var hotNews = {};
  //获取新闻轮播图数据方法
  var getHotNews = function (htmlStr) {
    let hotNewsContent = [];
    let $ = cheerio.load(htmlStr);
    $('div.major div.Q-tpList').each(function (index, ele) {
      let news = {
        url: $(ele).find('a').attr('href'),
        img_url: $(ele).find('img').attr('src'),
        title: $(ele).find('div.text').find('em a').text()
      };
      hotNewsContent.push(news);
    });
    return hotNewsContent;
  }
  nightmare
    .goto('https://news.qq.com/')//获取腾讯新闻的热点新闻
    .wait("div.con")
    .evaluate(() => document.querySelector("div.con").innerHTML)
    .then(htmlStr => {
      // 获取新闻页面轮播图数据
      hotNews = getHotNews(htmlStr);
      //将获取到的数据返回给前端
      res.json(hotNews);
    })
    .catch(error => {
      console.log(`新闻资讯抓取失败 - ${error}`);
    })
})
//文章列表
router.get('/share', function (req, res, next) {
  let data = {
    categoryTitle: [],
    allData: []
  };
  //连接数据库,成功后执行回调
  connect.connect(function () {
    // 插入数据
    var shuju = {
      title: 'Introduction for ofo小黄车',
      content_desc: '<p>ofo小黄车是一个无桩共享单车出行平台，缔造了“无桩单车共享”模式，致力于解决城市出行问题。用户只需在微信公众号或App扫一扫车上的二维码或直接输入对应车牌号，即可获得解锁密码，解锁骑行，随取随用，随时随地，也可以共享自己的单车到ofo共享平台，获得所有ofo小黄车的终身免费使用权，以1换N.</p><p>2015年6月启动以来，ofo小黄车已连接了1000万辆共享单车，累计向全球20个国家，超250座城市、超过2亿用户提供了超过40亿次的出行服务。 [3-7] </p><p>ofo的理念是，“骑时可以更轻松”。在未来ofo希望不生产自行车，只连接自行车，让人们在全世界的每一个角落都可以通过ofo解锁自行车，满足短途代步的需求。</p>',
      first_picture: 'http://oydsbb0dn.bkt.clouddn.com/ofo.jpg',
      category_id: 3
    };
    // {
    //title: 'Introduction for 周杰伦',
    // content_desc: '<p>周杰伦（Jay Chou），1979年1月18日出生于台湾省新北市，中国台湾流行乐男歌手、音乐人、演员、导演、编剧、监制、商人。</P><p>2000年发行首张个人专辑《Jay》。2001年发行的专辑《范特西》奠定其融合中西方音乐的风格   。</P><p>2002年举行“The One”世界巡回演唱会   。2003年成为美国《时代周刊》封面人物 。</p><p>2004年获得世界音乐大奖中国区最畅销艺人奖  。2005年凭借动作片《头文字D》获得台湾电影金马奖、香港电影金像奖最佳新人奖。</P><p>2006年起连续三年获得世界音乐大奖中国区最畅销艺人奖  。2007年自编自导的文艺片《不能说的秘密》获得台湾电影金马奖年度台湾杰出电影奖。</P>',
    // first_picture: 'http://oydsbb0dn.bkt.clouddn.com/zhoujielun.jpg',
    // category_id: 1
    // },
    // {
    //  
    //   title: 'Introduction for 日本-富士山',
    //   content_desc: '<p>富士山（日文：ふじさん，英文：Mount Fuji）是日本国内最高峰，日本重要国家象征之一。横跨静冈县和山梨县的活火山，接近太平洋岸，东京西南方约80公里。</p><p>富士山被日本人民誉为“圣岳”，是日本民族的象征。作为日本的国家象征之一，在全球享有盛誉。它也经常被称作“芙蓉峰”或“富岳”以及“不二的高岭”。</p><p>自古以来，这座山的名字就经常在日本的传统诗歌“和歌”中出现。日本诗人曾用“玉扇倒悬东海天”、“富士白雪映朝阳”等诗句赞美它。</p><p>富士山是世界上最大的活火山之一。目前处于休眠状态，但地质学家仍然把它列入活火山之类。自781年有文字记载以来，共喷发了18次，最后一次喷发是在1707年，此后休眠至今。</p><p>2002年8月（日平成十四年），日本国土地理院重新测量富士山的高度，为3775.63米。2004年，浅间寺收归了富士山3360米以上的所有权， [1]  所以富士山属于私人土地，日本政府并没有该山的使用权，只有租赁权。</p><p>2013年6月22日，第37届世界遗产大会批准将日本富士山列《世界遗产名录》，富士山从而成为日本的第17处世界遗产。</p>',
    //   first_picture: 'http://oydsbb0dn.bkt.clouddn.com/fushishan.jpg',
    //   category_id: 2
    // }
    // dataList.removeData(function () {
    //   console.log('删除数据成功')
    // })
    // dataDetail.removeAllDetail(function () {
    //   console.log('删除详情数据成功')
    // })



    // dataList.insertData(shuju, function (returns) {
    //   //将插入数据后返回的_id值作为detaDetail表的detail_id字段的值
    //   dataDetail.insertdetailId(returns, function (returnData) {
    //     //向detaDetail数据库中插入all_pictureUrl和content_desc数据
    //     let data = {
    //       article_title: '小黄车的出现给社会带来了很多便利！',
    //       detail_id: returns._id.toString(),
    //       all_pictureUrl: ['http://oydsbb0dn.bkt.clouddn.com/xhc04.jpg', 'http://oydsbb0dn.bkt.clouddn.com/xhc02.jpg', 'http://oydsbb0dn.bkt.clouddn.com/xhc03.jpg'],
    //       content_desc: '<p>ofo小黄车是一个无桩共享单车出行平台，缔造了“无桩单车共享”模式，致力于解决城市出行问题。用户只需在微信公众号或App扫一扫车上的二维码或直接输入对应车牌号，即可获得解锁密码，解锁骑行，随取随用，随时随地，也可以共享自己的单车到ofo共享平台，获得所有ofo小黄车的终身免费使用权，以1换N.</p><p>2015年6月启动以来，ofo小黄车已连接了1000万辆共享单车，累计向全球20个国家，超250座城市、超过2亿用户提供了超过40亿次的出行服务。 [3-7] </p><p>ofo的理念是，“骑时可以更轻松”。在未来ofo希望不生产自行车，只连接自行车，让人们在全世界的每一个角落都可以通过ofo解锁自行车，满足短途代步的需求。</p>'
    //     }
    //     //通过detail_id更新all_pictureUrl和content_desc
    //     dataDetail.insertpictureUrlAndDesc(data, function (message) {
    //         res.send(dataDetail.Msg);
    //     })
    //   })
    // })

    //获取所有的分类
    //查询所有的数据
    category.searchCategory(function (categoryMessage) {
      dataList.searchAllDatas(function (allDataMessge) {
        data.categoryTitle = categoryMessage;
        data.allData = allDataMessge;
        //将数据返回给前端
        res.send(data);
      })
    })
  })
})

//文章分类API
router.post('/searchcategory', function (req, res, next) {
  if (req.body) {
    console.log(req.body.category_id);
    var data = {
      category_id: req.body.category_id
    }
    connect.connect(function () {
      dataList.searchCategory(data, function (message) {
        res.send(message);
      })
    })
  }
})
//模糊查询文章API
router.post('/blurrysearch', function (req, res, next) {
  if (req.body) {
    //将值转换为正则表达式对象
    var qs = new RegExp(req.body.qs);
    dataList.blurrySearch(qs, function (message) {
      res.send(message);
    })
  }
})
//删除所有的文章内容API(用于调试)
router.get('/removeArticle', function (req, res, next) {
  connect.connect(function () {
    dataDetail.removeAllDetail(function () {
      res.send('删除所有的文章成功')
    })
  })
})
//文章详情
router.get('/sharedetail/:detail_id', function (req, res, next) {
  //通过detail_id查询文章详细信息
  if (req.params.detail_id) {
    let article_id = req.params.detail_id;
    //查询数据库
    dataDetail.searchDetail(article_id, function (message) {
      res.send(message);
    })
  }
})
//插入评论API
router.post('/postcomments', function (req, res, next) {
  //通过article_id插入文章评论
  if (req.body.comment_data.article_id) {
    console.log(req.body.comment_data.article_id);
    //插入评论数据
    var commentData = {
      article_id: req.body.comment_data.article_id, //文章id
      comment_userId: req.body.comment_data.comment_userId,//评论者id。从前端cookie中取到
      comment_user: req.body.comment_data.comment_user,//评论者的名称。从前端cookie中取到
      comment_content: req.body.comment_data.comment_content,//评论内容
      reply: req.body.comment_data.reply,//被评论的id,如果数组是空值，则不是评论别人的评论
    }
    connect.connect(function () {
      comment.insertComment(commentData, function (message) {
        res.send(comment.Msg);
        console.log('插入的评论内容是', message);
      })
    })
  }
})
//获取文章评论API
router.get('/getcomments/:articleComment_id', function (req, res, next) {
  //通过detail_id查询文章的评论
  if (req.params.articleComment_id) {
    let articleComment_ids = req.params.articleComment_id;
    console.log(articleComment_ids);
    connect.connect(function () {
      comment.searchComments(articleComment_ids, function (message) {
        console.log('查询到的数据是:', message);
        res.send(message);
      })
    })
  }
})
//删除该文章的所有评论(调试)
router.get('/removecomments/:articleComment_id', function (req, res, next) {
  if (req.params.articleComment_id) {
    let articleComment_ids = req.params.articleComment_id;
    console.log(articleComment_ids);
    connect.connect(function () {
      comment.removeComment(articleComment_ids, function () {
        res.send('删除该文章的所有评论成功');
      })
    })
  }
})
//文章点赞API
router.post('/articlepraise', function (req, res, next) {
  if (req.body) {
    var data = {
      type_id: req.body.article_id,
      type: req.body.type,
      user_id: req.body.user_id,
      status: req.body.status
    }
    connect.connect(function () {
      praise.updateArticle_praise(data, function () {
        res.send('更新成功');
      })
    })
  }
})
//页面初始化的时候，文章点赞状态获取API
router.post('/getarticlepraise', function (req, res, next) {
  if (req.body) {
    var data = {
      type_id: req.body.article_id,
      type: req.body.type,
      user_id: req.body.user_id
    }
    connect.connect(function () {
      praise.getArticle_praise(data, function (message) {
        res.send(message);
      })
    })
  }
})
//删除所有的点赞信息(用于调试)
router.get('/removepraise', function (req, res, next) {
  connect.connect(function () {
    praise.removepraise(function () {
      res.send('删除所有的点赞数据成功');
    })
  })
})
module.exports = router;
