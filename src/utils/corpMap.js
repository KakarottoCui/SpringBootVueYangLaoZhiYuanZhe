import baseUtils from './baseUtils'
import request from './request'
import {message} from 'ant-design-vue'
export const corpCountUrl = 'api/v1/corpBaseData/countCorpMap'//企业地图统计URL


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
export const methodHandler ={
  //查询企业地图信息
  async queryCorpMap(params = {}){
    console.log("params : "+JSON.stringify(params))
    let result = await postBodyRequest(corpCountUrl, {
      ...params
    })
    let data = result.data.data
    if(data){
      return data;
    }else{
      message.error('查询企业地图信息出现错误')
      return {}
    }
  },
}


export default {
  queryCorpMap:methodHandler.queryCorpMap,
};
