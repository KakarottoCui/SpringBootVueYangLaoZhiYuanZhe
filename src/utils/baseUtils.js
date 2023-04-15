//正则
export const numberPattern = /^(\-|\+)?\d+(\.\d+)?$/; //正数、负数、和小数
export const idCardNumberPattern = /^(\d{15}|\d{17}[\dxX])$/; //身份证号码正则
export const cn = /^[\u4e00-\u9fa5]{0,}$/; //中文
export const phoneNumberPattern = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/ //手机号正则
export const imagePrefix = 'http://ant-fun-web.oss-cn-chengdu.aliyuncs.com/' //图片拼接前缀
const baseUtils = {
  randomString(){
    return Math.random().toString(36).slice(-8)
  },
  handleImageUrl(url){
    if(this.$isNull(url)){
      return '';
    }
    return imagePrefix+url
  },
  phoneNumberPattern(){
    return phoneNumberPattern
  },
  cn(){
    return cn;
  },
  idCardNumberPattern(){
    return idCardNumberPattern;
  },
  numberPattern(){
    return numberPattern;
  },
  //设置页面分页参数防止空
  setPagination(pagination,data){
    if(!baseUtils.isNullOrEmptyArray(data.rows)){
      pagination.total = data.total;
    }else{
      pagination.total = 0;
    }
    return pagination;
  },
  //设置Table组件deDataSource
  setDataSource(dataSource,data){
    if(!baseUtils.isNullOrEmptyArray(data.rows)){
      dataSource = data.rows
    }else{
      dataSource = [];
    }
    return dataSource;
  },
  ///判断数组是否为空
  isNullOrEmptyArray(array){
    return (null == array || array.length <= 0);
  },
  ///判断对象是否为空
  isNull(object){
    if (typeof object === 'object') {
      let keys = Object.values(object)
      if(keys.length > 0){
        return false;
      }
      return true
    }else {
      return object === '' || object === null || object === undefined
    }
    //return (null == object || object == 'undefined' || object ==  '' || NaN == object);
  },
  rejectEmptyParams(obj) { // 剔除对象的空属性
    let data = new Object();
    Object.getOwnPropertyNames(obj).forEach((item, index) => {
      if (obj.hasOwnProperty(item)) { // 判断对象中是否有这个属性
        let data = obj[item];
        /*console.log('data : '+ data)
        console.log('this.$isNull(data) : '+ this.$isNull(data))*/
        if(!this.$isNull(data)){
          //delete obj[item]
          data[item] = data
        }
      }
    })
    return data;
  },
  //从数组里面删除一个数据
  deleteItemFromArray(array,item) {
    let index = array.indexOf(item);
    array.splice(index, 1)
  },
  isIdCardNumber(value){
    return this.matchExp(idCardNumberPattern,value);
  },
  isNumberString(value){
    if(this.$isNull(value)){
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
    if(this.$isNull(value) || this.$isNull(pattern)){
      return false
    }
    if(!pattern.test(value)){
      return false;
    }else{
      return true;
    }
    return false;
  },
  isPlainObject(obj) { //是否是纯粹对象
    if(typeof obj !== 'object' || obj === null) return false;
    let proto = obj
    while(Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) === proto
  },
  isString(obj){ //判断对象是否是字符串
    return Object.prototype.toString.call(obj) === "[object String]";
  },
  handleTypeByValue(value,optionList){
    //console.log('optionList:'+JSON.stringify(optionList))
    if(this.$isNull(value)){
      console.log('返回空')
      return '无'
    }
    if(this.$isNull(optionList)){
      console.log('optionList返回空')
      return '';
    }
    let result =
        optionList.find(item => item.value == value);
    //console.log('result:'+JSON.stringify(result))
    if(!this.$isNull(result)){
      return result.text
    }else{
      return '无'
    }
  },
}
export default baseUtils;
