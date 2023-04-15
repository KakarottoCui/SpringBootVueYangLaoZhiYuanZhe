<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="角色"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.roleName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="创建时间"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <range-date @change="handleDateChange" ref="createTime"></range-date>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button v-hasPermission="['role:add']" ghost type="primary" @click="addItem">新增</a-button>
        <a-button v-hasPermission="['role:delete']" @click="batchDelete">删除</a-button>
        <!--<a-dropdown v-hasPermission="['role:export']">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exprotExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>-->
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
        <template slot="remark" slot-scope="text, record">
          <a-popover placement="topLeft">
            <template slot="content">
              <div style="max-width: 200px">{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="toleCode" slot-scope="text, record">
          <a-popover placement="topLeft">
            <template slot="content">
              <div style="max-width: 200px">{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon style="font-size: 20px" v-hasPermission="['role:update']" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="itemEdit(record)" title="修改"></a-icon>
        </template>
      </a-table>
      <!-- 新增信息 -->
      <ItemAdd
        @close="handleItemAddClose"
        @success="handleItemAddSuccess"
        :addVisible="itemData.addVisible">
      </ItemAdd>
      <!-- 修改信息 -->
      <ItemEdit
        ref="ItemEdit"
        :itemEditData="itemData.data"
        @close="handleEditClose"
        @success="handleRoleEditSuccess"
        :editVisible="itemData.editVisible">
      </ItemEdit>
    </div>
  </a-card>
</template>

<script>
import RangeDate from '@/components/datetime/RangeDate'
import ItemAdd from './ItemAdd'
import ItemEdit from './ItemEdit'

export default {
  name: 'Role',
  components: {
    RangeDate:RangeDate,
    ItemAdd:ItemAdd,
    ItemEdit:ItemEdit
  },
  data () {
    return {
      advanced: false,
      itemData:{ //行信息
        data:{},
        particularsVisible:false,
        editVisible: false,
        addVisible:false,
      },
      queryParams: {
        beginTime: '',
        endTime: ''
      },
      dataSource: [],
      sortedInfo: null,
      paginationInfo: null,
      selectedRowKeys: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading: false
    }
  },
  computed: {
    columns () {
      return [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          align:'center',
        },
        {
          title: '角色代码',
          dataIndex: 'roleCode',
          align:'center',
          scopedSlots: { customRender: 'toleCode' },
          width: 350
        },
        {
          title: '描述',
          dataIndex: 'remark',
          align:'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align:'center',
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          align:'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align:'center',
          scopedSlots: { customRender: 'operation' }
      }
      ]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    addItem () {
      console.log('新增信息')
      this.itemData.addVisible = true
    },
    handleItemAddClose () {
      this.itemData.addVisible = false
    },
    handleItemAddSuccess () {
      this.itemData.addVisible = false
      this.$message.success('新增成功')
      this.search()
    },
    //修改
    itemEdit (record) {
      this.itemData.data = record
      this.itemData.editVisible = true
    },
    handleRoleEditSuccess () {
      this.itemData.editVisible = false
      this.$message.success('修改成功')
      this.search()
    },
    handleEditClose () {
      this.itemData.editVisible = false
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
        title: '请确认当前角色没有使用!!!',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          let mainIdList = []
          for (let key of that.selectedRowKeys) {
            mainIdList.push(that.dataSource[key].authRoleId)
          }
          that.$delete('api/v1/authRole/batchDeleteItem/' + mainIdList.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
            this.search();
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exprotExcel () {
      this.$exportData('api/v1/export/exportAuthRole', {
        ...this.queryParams
      })
    },
    search () {
      this.fetch({
        ...this.queryParams
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
      // 重置查询参数
      this.queryParams = {}
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这两个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    fetch (params = {}) {
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
      //发送POST请求，查询角色
      this.$postBodyRequest('api/v1/authRole/queryAuthRoleByPage', {
          ...params
        }).then((r) => {
        let data = r.data.data
        const pagination = { ...this.pagination }
        this.dataSource = this.$setDataSource(this.dataSource,data);
        this.pagination = this.$setPagination(pagination,data);
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*webpack 会以~符号作为前缀的路径视为依赖模块去解析*/
  @import "~@static/less/Common";
</style>
