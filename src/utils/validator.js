import baseUtils from './baseUtils'
//正则
export const numberPattern = /^(\-|\+)?\d+(\.\d+)?$/; //正数、负数、和小数
export const idCardNumberPattern = /^(\d{15}|\d{17}[\dxX])$/; //身份证号码正则
export const cnPattern = /^[\u4e00-\u9fa5]{0,}$/; //中文
export const phoneNumberPattern = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/ //手机号正则

//方法处理
export const methodHandler ={
  isCn(value){
    return this.matchExp(cnPattern,value);
  },
  isPhoneNumber(value){
    return this.matchExp(phoneNumberPattern,value);
  },
  isIdCardNumber(value){
    return this.matchExp(idCardNumberPattern,value);
  },
  isNumberString(value){
    if(baseUtils.isNull(value)){
      return false
    }
    if(!numberPattern.test(value)){
      return false;
    }else{
      return true;
    }
    return false;
  },
  matchExp(pattern,value){
    if(baseUtils.isNull(value) || baseUtils.isNull(pattern)){
      return false
    }
    if(!pattern.test(value)){
      return false;
    }else{
      return true;
    }
    return false;
  },
  /**
   * @param item 组装的数据item
   * @param originalList 原始的数据集合
   * @param data
   */
  factorContrastData(item,dataList){
    let contrastFactor = item.contrastFactor
    let contrastValue = item.contrastFactor
    let itemName = item.itemName
    //console.log('赋值之前的dataList :' + JSON.stringify(dataList))
    if(dataList && dataList.length > 0 ){
      //console.log('过滤前的dataList :' + JSON.stringify(dataList))
      //先删除原来的数据
      dataList = dataList.filter((value,index,array)=>{return value.itemName != itemName;})
      //console.log('过滤之后的dataList :' + JSON.stringify(dataList))
      if(!baseUtils.isNull(contrastFactor) && !baseUtils.isNull(contrastValue)){
        dataList.push(item);
      }
    }else{
      dataList = new Array();
      dataList.push(item);
    }
    //console.log('经过处理后的dataList : '+JSON.stringify(dataList))
    return dataList;
  },
}
export default {
  numberPattern:numberPattern,
  idCardNumberPattern:idCardNumberPattern,
  phoneNumberPattern:phoneNumberPattern,
  matchExp:methodHandler.matchExp,
  isNumberString:methodHandler.isNumberString,
  isIdCardNumber:methodHandler.isIdCardNumber,
  isPhoneNumber:methodHandler.isPhoneNumber,
  isCn:methodHandler.isCn,
  factorContrastData:methodHandler.factorContrastData,
};
