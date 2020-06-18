/**
 *
 * @param obj (leanCloud查询返回对象)
 * @returns formatObj
 */
var util = require('./util.js');
function discountFormat(obj) {
    var retObj = {};
    retObj.id = obj.id;
    retObj.blog = obj.get('blog')
    retObj.date = util.formatTime(obj.get('date')),
   
    retObj.href = obj.get('href')
    retObj.userid = obj.get('userid')
    retObj.updatedAt = obj.updatedAt;
    retObj.createdAt = obj.createdAt;
    retObj.formatDate = util.formatTime(obj.updatedAt);
    retObj.imgsrc = obj.get('imgSrc')
    return retObj;
}

module.exports = {
    discountFormat: discountFormat
}