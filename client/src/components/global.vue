<script>
export default {
  //定义获取cookie方法
  getCookie: function(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; "); //通过'; '分隔字符串
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split("=");
      if (arr[0] == name) return arr[1];
    }
    return "";
  }
};
</script>