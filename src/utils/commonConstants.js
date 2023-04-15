import baseUtils from './baseUtils'
import request from './request'
//根据字典类型查询字典的URL
export const QUERY_DICTIONARY_BY_TYPE_URL = 'api/v1/businessDictionary/queryDictionaryByType'
//查询所有用户简略信息URL
export const ALL_AUTH_USER_SKETCH_URL = 'api/v1/authUser/queryAllAuthUserSketch'
//查询所有角色
export const ALL_AUTH_ROLE_URL = 'api/v1/authRole/queryAllRoles'
//查询所有老人信息
export const ALL_OLD_SKETCH_URL = 'api/v1/oldSketch/allOldSketch'
//查询所有床位信息
export const ALL_BED_SKETCH_URL = 'api/v1/bedSketch/allBedSketch'
//查询执行角色的用户
export const AUTH_USER_ROLE_SKETCH = 'api/v1/authUser/queryUserSketchByRoleCode'
//行政区域
export const DISTRICT_CODE_URL = 'api/v1/districtCode/queryByParams'
//当前长整时间
export const CURRENT_LONG_TIME = 'api/v1/platform/currenLongTime'
//OSS地址
export const OSS_URL = 'http://corp-data-public.oss-cn-chengdu.aliyuncs.com/'
//查询所有服务信息
export const ALL_SERVICE_CONFIG_URL = 'api/v1/templateService/allServiceSketch'
//是否选项
export const yesOrNoOptions = [
  {
    'text':'是',
    'value':true
  },
  {
    'text':'否',
    'value':false
  },
]

//服务状态
export const allStatusOption = [
  {
    'text':'等待响应',
    'value':'1'
  },
  {
    'text':'已响应',
    'value':'2'
  },
  {
    'text':'已完成',
    'value':'3'
  },
  {
    'text':'已取消',
    'value':'9'
  },
]

//服务状态
export const allApprovedStatus = [
  {
    'text':'待审核',
    'value':'1'
  },
  {
    'text':'已同意',
    'value':'2'
  },
  {
    'text':'已拒绝',
    'value':'3'
  }
]
//是否查询所有
export const needAllStatusOptions = [
  {
    'text':'是',
    'value':'true'
  },
  {
    'text':'否',
    'value':'false'
  },
]
//物品是否热门
export const itemHotStatusOptions = [
  {
    'text':'热门',
    'value':'HOT'
  },
  {
    'text':'非热门',
    'value':'UN_HOT'
  },
]
//APP的板块名称
export const itemStatusOptions = [
  {
    'text':'上架',
    'value':'ITEM_STATUS_ON'
  },
  {
    'text':'下架',
    'value':'ITEM_STATUS_OFF'
  },
]
//APP的板块名称
export const panelOptions = [
  {
    'text':'主页',
    'value':'MAIN'
  },
  {
    'text':'页面内',
    'value':'PAGE'
  },
]
//审核状态
export const auditStatusOption = [
  {
    'text':'通过',
    'value':'APPROVED'
  },
  {
    'text':'驳回',
    'value':'REJECT'
  },
  {
    'text':'待处理',
    'value':'WAIT_HANDLE'
  },
  {
    'text':'最终通过',
    'value':'ULTIMATE_APPROVED'
  },
  {
    'text':'最终驳回',
    'value':'ULTIMATE_REJECT'
  }
]
//支付状态
export const payStatusOption = [
  {
    'text':'全职',
    'value':1
  },
  {
    'text':'兼职',
    'value':2
  },
]
//性别
export const genderOption = [
  {
    'text':'男性',
    'value':'man'
  },
  {
    'text':'女性',
    'value':'woman'
  },
]
export const sketchColumns = [
  {
    title: '简略信息',
    dataIndex: 'sketchContent',
    align:'center',
  }
]
export const tagColumns = [
  {
    title: '简略信息',
    dataIndex: 'tagContent',
    align:'center',
  }
]
//当前地图中心点
export const platformMapCenter = [
  104.068823, 30.657167
]
//分页查询对比条件
export const contrastFactorOption = [
  {
    'text':'等于',
    'value':'EQUALS',
  },
  {
    'text':'大于',
    'value':'GREATER_THAN',
  },
  {
    'text':'大于等于',
    'value':'GREATER_THAN_OR_EQUAL_TO',
  },
  {
    'text':'小于等于',
    'value':'LESS_THAN_OR_EQUAL_TO',
  },
  {
    'text':'小于',
    'value':'LESS_THAN',
  }
]
export const dataBeginAndEndTimeFormat = 'YYYY-MM' //时间格式
//发送post请求
export const postBodyRequest = async (url,params) => {
  let res = await request.postBodyRequest(url,
    params
  )
  if(res){
    return res
  }else{
    return {}
  }
}
//发送get请求
export const getRequest = async (url,params) => {
  let res = await request.get(url,
    params
  )
  if(res){
    return res
  }else{
    return {}
  }
}
//根据字典类型查询字典
export const queryDictionaryByType  = async (dictType) => {
  let res = await request.get(QUERY_DICTIONARY_BY_TYPE_URL,
    {
      "dictType":dictType
    }
  )
  if(res){
    let data = res.data.data;
    let optionList = new Array();
    if(data) {
      data.map(item => {
        let option = {
          'text': item.dictValue,
          'value': item.businessDictionaryId
        }
        optionList.push(option);
      })
    }
    return optionList;
  }else{
    return new Array();
  }
}
export const methodHandler = {
  //处理图片URL
  handleImageUrl(url){
    if(baseUtils.isNull(url)){
      return '';
    }
    let handledUrl = OSS_URL+url
    return handledUrl
  },
  async yearOption(){
    let optionArray = new Array();
    for(let index = 1900;index<=2100;index++) {
      let option = {
        'text': index,
        'value': index
      }
      optionArray.push(option);
    }
    return optionArray
  },
  async mapSearchOptions(){
    let result = await postBodyRequest(DISTRICT_CODE_URL,{
      itemStatus:'ITEM_STATUS_ON'
    });
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.districtName,
          'value':item.districtCode
        }
        resultArray.push(option);
      })
    }
    //console.log('resultArray: '+JSON.stringify(resultArray))
    return resultArray;
  },
  async currenLongTime(){
    let result = await getRequest(CURRENT_LONG_TIME,{});
    let data = result.data;
    if(data){
      return data
    }else{
      return ''
    }
  },
  async authUserRoleSketchOption(roleCode){
    console.log('roleCode:'+roleCode)
    let result = await getRequest(AUTH_USER_ROLE_SKETCH,{
      roleCode:roleCode
    });
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.userName,
          'value':item.authUserId
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
  //查询所有用户ID
  async authAuthRoleOption(){
    let result = await getRequest(ALL_AUTH_ROLE_URL,{});
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.roleName,
          'value':item.authRoleId
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
  //所用用户ID
  async authUserIdOption(){
    let result = await getRequest(ALL_AUTH_USER_SKETCH_URL,{});
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.userName,
          'value':item.authUserId
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
  //查询所有床位
  async allBedSketchOption(param){
    let reqParam = {}
    if(param){
      reqParam = {...param}
    }
    let result = await postBodyRequest(ALL_BED_SKETCH_URL,{
      ...reqParam
    });
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.bedNum,
          'value':item.bedSketchId,
          'useStatus':item.useStatus
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
  async allOldSketchOption(){
    let result = await getRequest(ALL_OLD_SKETCH_URL,{});
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.realName,
          'value':item.oldSketchId
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
  async allServiceOption(){
    let result = await getRequest(ALL_SERVICE_CONFIG_URL,{});
    let data = result.data.data;
    let resultArray = new Array();
    if(data && data.length>0){
      data.map(item => {
        let option = {
          'text':item.serviceName,
          'value':item.serviceTemplateId
        }
        resultArray.push(option);
      })
    }
    return resultArray;
  },
}
export default {
  payStatusOption:payStatusOption,
  genderOption:genderOption,
  auditStatusOption:auditStatusOption,
  platformMapCenter:platformMapCenter,
  contrastFactorOption:contrastFactorOption,
  dataBeginAndEndTimeFormat:dataBeginAndEndTimeFormat,
  authUserIdOption:methodHandler.authUserIdOption,
  authAuthRoleOption:methodHandler.authAuthRoleOption,
  authUserRoleSketchOption:methodHandler.authUserRoleSketchOption,
  allOldSketchOption:methodHandler.allOldSketchOption,
  allServiceOption:methodHandler.allServiceOption,
  allBedSketchOption:methodHandler.allBedSketchOption,
  yearOption:methodHandler.yearOption,
  mapSearchOptions:methodHandler.mapSearchOptions,
  currenLongTime:methodHandler.currenLongTime,
  sketchColumns:sketchColumns,
  tagColumns:tagColumns,
  panelOptions:panelOptions,
  itemStatusOptions:itemStatusOptions,
  itemHotStatusOptions:itemHotStatusOptions,
  needAllStatusOptions:needAllStatusOptions,
  yesOrNoOptions:yesOrNoOptions,
  handleImageUrl:methodHandler.handleImageUrl,
  allStatusOption:allStatusOption,
  allApprovedStatus:allApprovedStatus
};

