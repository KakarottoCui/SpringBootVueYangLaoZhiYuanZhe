import request from './request'
import {message, Modal, notification} from 'ant-design-vue'
import store from '@/store'
export const handleToStartStatusUrl = 'api/v1/auditProcess/handleToStartStatus' //把流程直接处理为最初开始的状态
export const handleAuditUrl = 'api/v1/auditProcess/handleProcess' //处理审核提交的URL
export const showAuditRecordUrl = 'api/v1/auditProcess/queryRecordByItemId' //查询审核记录的URL

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
//返回当前用户
export const currentUser = async() => {
  return store.state.account.user
}
export const methodHandler = {
  //查询审核记录
  async showAuditRecord(itemId){
    if(!itemId){
      return new Array();
    }
    let params = {
      itemId:itemId
    }
    let result = await request.get(showAuditRecordUrl,params);
    //console.log('data : '+JSON.stringify(result))
    let data = result.data.data;
    let itemList = new Array();
    if(data){
      data.map(item => {
        //this.auditRecordList.push(item);
        itemList.push(item)
      })
    }
    //console.log('itemList : '+JSON.stringify(itemList))
    return itemList;
  },
  //提交审核
  async submitAudit(itemId,auditType){
    if(!itemId){
      return {};
    }
    if(!auditType){
      return {};
    }
    //从表单里面拿到值
    let result = await postBodyRequest(handleAuditUrl, {
      auditType:auditType,
      auditStatus:'APPROVED',
      itemId:itemId,
      auditRemark:'提交审核'
    })
    let data = result.data
    if(data){
      message.success('操作成功')
      return data;
    }else{
      message.error('提交审核出现错误')
      return {}
    }
  },
  //把流程直接处理为最初开始的状态
  async itemAuditToStart(itemId,auditType){
    if(!itemId){
      return {};
    }
    if(!auditType){
      return {};
    }
    let result = await postBodyRequest(handleToStartStatusUrl, {
      auditType:auditType,
      auditStatus:'WAIT_HANDLE',
      itemId:itemId,
      auditRemark:'驳回审核'
    })
    let data = result.data
    if(data){
      message.success('操作成功')
      return data;
    }else{
      message.error('驳回到最初审核流程出现错误')
      return {}
    }
  },
  async recordWaitHandleShow(currentStep,auditStatus){
    let roleCode = await currentUser.roleCode;
    console.log('roleCode : '+roleCode)
    if(roleCode == currentStep){
      if(auditStatus == 'WAIT_HANDLE'){
        return true;
      }else{
        return false
      }
    }else{
      return false;
    }
  },
}

export default {
  itemAuditToStart:methodHandler.itemAuditToStart,
  submitAudit:methodHandler.submitAudit,
  showAuditRecord:methodHandler.showAuditRecord,
  recordWaitHandleShow:methodHandler.recordWaitHandleShow,
};
