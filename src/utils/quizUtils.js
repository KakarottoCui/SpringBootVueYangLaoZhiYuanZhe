//问卷调查相关JS


import baseUtils from './baseUtils'
import md5 from 'js-md5'
import moment from 'moment'

const wjAppKey = 'wjn10op5sliemcuhwg' //问卷网AppKey
const wjUser = 'me。20369691' //问卷网User
const wjAppSecret = 'qzpb5ka8ui1hytce72oxnjfwgdls3604m9' //问卷网AppKey


const quizUtils = {

  /**
   * 返回数据分析结果链接
   * @param shortId 项目短ID
   */
  dataAnalysisResultsUrl(shortId){
    if(baseUtils.isNull(shortId)){
      return '';
    }
    let current = moment().unix();
    console.log('当前unix时间戳: '+current)
    let url = 'http://apitest.wenjuan.com/openapi/v3/get_basic_chart/?wj_appkey='+wjAppKey+'&wj_user='+wjUser+'&wj_short_id='+shortId+'&wj_timestamp='+current+'&wj_signature=';
    let needSign = wjAppKey+shortId+current+wjUser+wjAppSecret
    console.log('需要签名的字符串: '+needSign)
    let sign = md5(needSign)
    console.log('签名后的字符串: '+sign)
    url = url + sign
    console.log('拼接后的URL: '+url)
    return url;
  },

  /**
   * 返回数据报表结果链接
   * @param shortId 项目短ID
   */
  dataReportUrl(shortId){
    if(baseUtils.isNull(shortId)){
      return '';
    }
    let current = moment().unix();
    console.log('当前unix时间戳: '+current)
    let url = 'http://apitest.wenjuan.com/openapi/v3/get_report_chart/?wj_appkey='+wjAppKey+'&wj_user='+wjUser+'&wj_short_id='+shortId+'&wj_timestamp='+current+'&wj_signature=';
    let needSign = wjAppKey+shortId+current+wjUser+wjAppSecret
    console.log('需要签名的字符串: '+needSign)
    let sign = md5(needSign)
    console.log('签名后的字符串: '+sign)
    url = url + sign
    console.log('拼接后的URL: '+url)
    return url;
  },

  /**
   * 返回数据报表结果链接
   * @param shortId 项目短ID
   */
  dataAddUrl(){
    let current = moment().unix();
    console.log('当前unix时间戳: '+current)
    let url = 'http://apitest.wenjuan.com/openapi/v3/create_proj/?wj_appkey='+wjAppKey+'&wj_user='+wjUser+'&wj_timestamp='+current+'&wj_signature=';
    let needSign = wjAppKey+current+wjUser+wjAppSecret
    console.log('需要签名的字符串: '+needSign)
    let sign = md5(needSign)
    console.log('签名后的字符串: '+sign)
    url = url + sign
    console.log('拼接后的URL: '+url)
    return url;
  }

}

export default quizUtils;
