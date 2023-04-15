<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="10" :sm="20" >
              <a-form-item
                  label="登录账号"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 10, offset: 2}">
                <a-input v-model="queryParams.userName"/>
              </a-form-item>
            </a-col>
            <!--<a-col :md="12" :sm="24" >
              <a-form-item
                label="部门"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 2}">
                <dept-input-tree @change="handleDeptChange"
                                 ref="deptTree">
                </dept-input-tree>
              </a-form-item>
            </a-col>-->
            <template v-if="advanced">
              <a-col :md="14" :sm="24" >
                <a-form-item
                    label="创建时间"
                    :labelCol="{span: 4}"
                    :wrapperCol="{span: 18, offset: 2}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
             <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" ghost @click="addItem" v-hasPermission="['user:add']">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="['user:delete']">删除</a-button>
        <a-dropdown v-hasAnyPermission="['authUser:resetPassword','user:export']">
          <a-menu slot="overlay">
            <a-menu-item v-hasPermission="['authUser:resetPassword']" key="password-reset" @click="resetPassword">密码重置</a-menu-item>
            <!--<a-menu-item v-hasPermission="['user:export']" key="export-data" @click="exportExcel">导出Excel</a-menu-item>-->
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <!-- 表格区域 -->
      <a-table
          ref="TableInfo"
          :bordered="true"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
          :scroll="{ x: 1000 }"
          size="small">
        <template slot="email" slot-scope="text, record">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon style="font-size: 20px" v-hasPermission="['user:update']" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="itemEdit(record)" title="修改用户"></a-icon>
          <a-icon style="font-size: 20px" v-hasPermission="['user:view']" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <a-modal :visible="previewImageVisible" :footer="null" @cancel="handleImagePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
    <!--详情-->
    <UserParticulars
        :particularsData="itemData.data"
        :particularsVisible="itemData.particularsVisible"
        @close="handleParticularsClose">
    </UserParticulars>
    <!-- 修改 -->
    <ItemEdit
        ref="ItemEdit"
        :itemEditData="itemData.data"
        :editVisible="itemData.editVisible"
        @close="handleEditClose"
        @success="handleEditSuccess">
    </ItemEdit>
    <!-- 新增-->
    <ItemAdd
        @close="handleItemAddClose"
        @success="handleItemAddSuccess"
        :addVisible="itemData.addVisible">
    </ItemAdd>
  </a-card>
</template>
<script>

//导入组件
import UserParticulars from './ItemParticulars'
import RangeDate from '@/components/datetime/RangeDate'
import ItemAdd from './ItemAdd'
import ItemEdit from './ItemEdit'
import baseUtils from '@/utils/baseUtils'

export default {
  name: 'ItemList',
  //挂载组件
  components: {baseUtils,UserParticulars, ItemAdd, ItemEdit, RangeDate},
  data () {
    return {
      apiUrl:{
        pageUrl:'api/v1/authUser/queryUserByPage',//分页查询链接
        updateUrl:'api/v1/authUser/updateAuthUser',//更新链接
        addUrl:'api/v1/authUser/addAuthUser'//新增链接
      },
      itemData: {
        particularsVisible: false,
        data:{},
        editVisible: false,
        addVisible:false
      },
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      advanced: false,
      previewImageVisible: false, //预览图片的弹出框
      previewImageUrl: '', //预览图片的URL
      dataSource: [],
      selectedRowKeys: [],
      paginationInfo: null,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      queryParams: {},
    }
  },
  created () {
    this.setOtherData()
  },
  computed: {
    columns () {
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          dataIndex: 'id',
          align:'center',
          width: 100,
          fixed: 'left'
        },
        {
          title: '登录账号',
          dataIndex: 'userName',
          align:'center',
        },
        {
          title: '真实姓名',
          dataIndex: 'realName',
          align:'center',
        },
        {
          title: '电话',
          dataIndex: 'phoneNumber',
          align:'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align:'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align:'center',
          scopedSlots: { customRender: 'operation' }
        }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    async setOtherData(){

    },
    handleTypeByValue(value,optionList){
      if(baseUtils.isNull(value)){
        return '无'
      }
      if(!optionList || !optionList.length >0){
        return '';
      }
      let resultList  =
          optionList.filter(item => item.value == value);
      console.log(JSON.stringify(resultList))
      if(resultList && resultList.length > 0){
        return resultList[0].text;
      }else{
        return '无'
      }
    },
    handleImagePreviewCancel(){
      this.previewImageVisible = false
      this.previewImageUrl = ''
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.beginTime = ''
        this.queryParams.endTime = ''
      }
    },
    view (record) {
      this.itemData.data = record
      this.itemData.particularsVisible = true
    },
    addItem () {
      this.itemData.addVisible = true
    },
    handleItemAddClose () {
      this.itemData.addVisible = false
    },
    handleItemAddSuccess () {
      this.itemData.addVisible = false
      this.$message.success('新增用户成功，初始密码为123456')
      this.search()
    },
    itemEdit (record) {
      this.itemData.data = record
      this.itemData.editVisible = true
    },
    handleEditClose () {
      this.itemData.editVisible = false
      this.search()
    },
    handleEditSuccess () {
      this.itemData.editVisible = false
      this.itemData.data = {}
      this.$message.success('更新成功')
      this.search()
    },
    handleParticularsClose () {
      this.itemData.particularsVisible = false
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.beginTime = value[0]
        this.queryParams.endTime = value[1]
      }
    },
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      let that = this
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          let mainIdList = [];
          for (let key of that.selectedRowKeys) {
            mainIdList.push(that.dataSource[key].authUserId)
          }
          that.$delete('api/v1/authUser/batchDeleteItem/' + mainIdList.join(',')).then(() => {
            that.$message.success('删除成功');
            that.selectedRowKeys = [];
            that.search();
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    resetPassword () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要重置密码的用户')
        return
      }
      let that = this
      this.$confirm({
        title: '确定重置选中用户密码?',
        content: '当您点击确定按钮后，这些用户的密码将会重置为123456',
        centered: true,
        onOk () {
          let userNameList = []
          for (let key of that.selectedRowKeys) {
            userNameList.push(that.dataSource[key].userName)
          }
          that.$get('api/v1/authUser/resetPassword', {
            userNameList: userNameList.join(',')
          }).then(() => {
            that.$message.success('重置用户密码成功')
            that.selectedRowKeys = []
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exportExcel () {
      let {sortedInfo, filteredInfo} = this
      let sortField, sortOrder
      // 查询当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field
        sortOrder = sortedInfo.order
      }
      this.$exportData('user/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    //条件分页搜索
    search () {
      this.fetch({
        ...this.queryParams,
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {}
      // 清空部门树选择
      this.$refs.deptTree.reset()
      // 清空时间选择
      if (this.advanced) {
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter
      this.itemData.particularsVisible = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }

      //发送请求
      this.$postBodyRequest(this.apiUrl.pageUrl, {
        ...params //取出所有的查询参数
      }).then((r) => {
        let data = r.data.data
        const pagination = { ...this.pagination }
        pagination.total = baseUtils.isNull(data.total) ? 0 : data.total
        this.loading = false
        this.dataSource = data.rows
        this.pagination = pagination
        this.setOtherData();
      })
    }
  }
}
</script>
<style lang="less" scoped>
/*webpack 会以~符号作为前缀的路径视为依赖模块去解析*/
@import "~@static/less/Common";
</style>
