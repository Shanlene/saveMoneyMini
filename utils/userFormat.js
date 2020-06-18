/**
 *
 * @param obj (leanCloud查询返回对象)
 * @returns formatObj
 */
var util = require('./util.js');
function userFormat(obj) {
    var retObj = {};
    retObj.id = obj.id;
    retObj.likeList = obj.get('likeList');
    retObj.openid = obj.get('openid');
    return retObj;
}

module.exports = {
    userFormat: userFormat
}