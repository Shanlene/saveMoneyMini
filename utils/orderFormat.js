var util = require('./util.js');

/**
 *
 * @param obj (leanCloud查询返回对象)
 * @returns formatObj
 */
function orderFormate(obj) {
    var retObj = {};
    retObj.author = obj.get('author');
    retObj.id = obj.id;
    retObj.title = obj.get('title');
    retObj.content = obj.get('content');
    retObj.url = obj.get('url');
    retObj.pictures = obj.get('pictures');
    retObj.comments = obj.get('comments');
    retObj.description = obj.get('description');
    retObj.updatedAt = obj.updatedAt;
    retObj.createdAt = obj.createdAt;
    retObj.formatDate = util.formatTime(obj.updatedAt);
    retObj.QRCode = obj.get('QRCode');
    retObj.mallKinds = obj.get('mallKinds');
    //  出入openid
    // const openid = wx.getStorageSync('openid')
    retObj.openid = obj.get('openid');
    return retObj;
}

module.exports = {
    orderFormat: orderFormate
}