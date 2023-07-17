
/**
 * 根据时间戳 获得自定义时间格式
 * var date = jutils.formatDate(new Date(1634002035*1000),"YYYY-MM-DD HH:ii:ss"); 2021-10-12 09:27:15
 * var date = jutils.formatDate(new Date(1634002035*1000),"YYYY-MM-DD 周W");  2021-10-12 周二
 * var date = jutils.formatDate(new Date(1634002035*1000),"HH:ii:ss"); 09:27:15
 */
export function formatDate(date,formatstr){
  var arrweek=["日","一","二","三","四","五","六"];
  var str=formatstr.replace(/yyyy|YYYY/,date.getFullYear()).replace(/yy|YY/,
  $addZero(date.getFullYear() % 100,2)).replace(/mm|MM/,$addZero(date.getMonth() + 1,
  2)).replace(/m|M/g,date.getMonth() + 1).replace(/dd|DD/,$addZero(date.getDate(),2)).replace(/d|D/g,
  date.getDate()).replace(/hh|HH/,$addZero(date.getHours(),2)).replace(/h|H/g,
  date.getHours()).replace(/ii|II/,$addZero(date.getMinutes(),2)).replace(/i|I/g,
  date.getMinutes()).replace(/ss|SS/,$addZero(date.getSeconds(),2)).replace(/s|S/g,
  date.getSeconds()).replace(/w|g/,$addZero(date.getDay(),2)).replace(/W/g,arrweek[date.getDay()]);
  return str;
}
function $addZero(v,size){
  for(var i=0,len=size-(v+"").length;i<len;i++){
    v="0"+v;
  }
  return v+""
}

/**
 *  输入天数，获取该天日期、周数
 *  type:week、all、day
 */
export function getNowFormatDate(dayNum, type = "all", dateTime = null) {
  var arrweek=["日","一","二","三","四","五","六"];
  // 如果为null,则格式化当前时间为时间戳
  if (!dateTime) dateTime = +new Date();
  // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
  if (dateTime.toString().length == 10) dateTime *= 1000;
  const timestamp = +new Date(Number(dateTime));

  const one_day = 86400000; // 24 * 60 * 60 * 1000;
  const addVal = dayNum * one_day + timestamp;

  //x天后的日期
  const date = new Date(addVal);
  //格式化日期
  const filters = n => {
    return n < 10 ? (n = '0' + n) : n;
  };
  const month = filters(date.getMonth() + 1);//获取月份 0~11的整数
  const day = filters(date.getDate());//获取天数 1~31的整数
  const hours = filters(date.getHours());
  const minutes = filters(date.getMinutes());
  const seconds = filters(date.getSeconds());
  const week = "周" + arrweek[date.getDay()];

  const lastTime = `${date.getFullYear()}-${month}-${day}`;
  switch (type) {
    case "week":
      return week;
      break;
    case "day":
      return day;
      break;
    default:
      return lastTime;
      break;
  }
}