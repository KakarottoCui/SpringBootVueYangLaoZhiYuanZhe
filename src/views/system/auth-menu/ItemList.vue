<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.menuName"/>
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
        <a-popconfirm
          title="请选择创建类型"
          okText="按钮"
          cancelText="菜单"
          @cancel="() => createMenu()"
          @confirm="() => createButton()">
          <a-icon slot="icon" type="question-circle-o" style="color: orangered" />
          <a-button type="primary" v-hasPermission="['menu:add']" ghost>新增</a-button>
        </a-popconfirm>
        <a-button v-hasPermission="['menu:delete']" @click="batchDelete">删除</a-button>
        <a-dropdown v-hasPermission="['menu:export']">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exprotExccel">导出Excel</a-menu-item>
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
              :key="key"
              :dataSource="dataSource"
              :pagination="pagination"
              :loading="loading"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="handleTableChange"
              :scroll="{ x: 1500 }"
              size="small">
        <template slot="icon" slot-scope="text, record">
         <a-icon :type="text" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon style="font-size: 20px" v-hasPermission="['menu:update']" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <a-badge style="font-size: 20px" v-hasNoPermission="['menu:update']" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增菜单 -->
    <menu-add
      @close="handleMenuAddClose"
      @success="handleMenuAddSuccess"
      :menuAddVisible="menuAddVisible">
    </menu-add>
    <!-- 修改菜单 -->
    <menu-edit
      ref="menuEdit"
      @close="handleMenuEditClose"
      @success="handleMenuEditSuccess"
      :menuEditVisible="menuEditVisible">
    </menu-edit>
    <!-- 新增按钮 -->
    <button-add
      @close="handleButtonAddClose"
      @success="handleButtonAddSuccess"
      :buttonAddVisible="buttonAddVisible">
    </button-add>
    <!-- 修改按钮 -->
    <button-edit
      ref="buttonEdit"
      @close="handleButtonEditClose"
      @success="handleButtonEditSuccess"
      :buttonEditVisible="buttonEditVisible">
    </button-edit>
  </a-card>
</template>

<script>
import RangeDate from '@/components/datetime/RangeDate'
import MenuAdd from './MenuAdd'
import MenuEdit from './MenuEdit'
import ButtonAdd from './ButtonAdd'
import ButtonEdit from './ButtonEdit'

export default {
  name: 'Menu',
  components: {ButtonAdd, ButtonEdit, RangeDate, MenuAdd, MenuEdit},
  data () {
    return {
      advanced: false,
      key: +new Date(),
      queryParams: {},
      filteredInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      pagination: {
        defaultPageSize: 10000000,
        hideOnSinglePage: true,
        indentSize: 100
      },
      loading: false,
      menuAddVisible: false,
      menuEditVisible: false,
      buttonAddVisible: false,
      buttonEditVisible: false
    }
  },
  computed: {
    columns () {
      let {filteredInfo} = this
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '名称',
          dataIndex: 'text',
          align:'center',
          width: 200,
          fixed: 'left'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align:'center',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          align:'center',
          customRender: (text, row, index) => {
            switch (text) {
              case '0':
                return <a-tag color="cyan"> 菜单 </a-tag>
              case '1':
                return <a-tag color="pink"> 按钮 </a-tag>
              default:
                return text
            }
          },
          filters: [
            {text: '按钮', value: '1'},
            {text: '菜单', value: '0'}
          ],
          filterMultiple: false,
          filteredValue: filteredInfo.type || null,
          onFilter: (value, record) => record.type.includes(value)
        },
        {
          title: '地址',
          dataIndex: 'path',
          align:'center',
        },
        {
          title: 'Vue组件',
          dataIndex: 'component',
          align:'center',
        },
        {
          title: '权限',
          dataIndex: 'permission',
          align:'center',
        },
        {
          title: '排序',
          dataIndex: 'order',
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
          width: 120,
          scopedSlots: {customRender: 'operation'},
          fixed: 'right'
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
    handleMenuEditClose () {
      this.menuEditVisible = false
    },
    handleMenuEditSuccess () {
      this.menuEditVisible = false
      this.$message.success('修改菜单成功')
      this.fetch()
    },
    handleButtonEditClose () {
      this.buttonEditVisible = false
    },
    handleButtonEditSuccess () {
      this.buttonEditVisible = false
      this.$message.success('修改按钮成功')
      this.fetch()
    },
    edit (record) {
      if (record.type === '0') {
        this.$refs.menuEdit.setFormValues(record)
        this.menuEditVisible = true
      } else {
        this.$refs.buttonEdit.setFormValues(record)
        this.buttonEditVisible = true
      }
    },
    handleButtonAddClose () {
      this.buttonAddVisible = false
    },
    handleButtonAddSuccess () {
      this.buttonAddVisible = false
      this.$message.success('新增按钮成功')
      this.fetch()
    },
    createButton () {
      this.buttonAddVisible = true
    },
    handleMenuAddClose () {
      this.menuAddVisible = false
    },
    handleMenuAddSuccess () {
      this.menuAddVisible = false
      this.$message.success('新增菜单成功')
      this.fetch()
    },
    createMenu () {
      this.menuAddVisible = true
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
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
        content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
        centered: true,
        onOk () {
          that.$delete('api/v1/authMenu/deleteMenu/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.fetch()
            this.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exprotExccel () {
      let {filteredInfo} = this
      this.$exportData('menu/excel', {
        ...this.queryParams,
        ...filteredInfo
      })
    },
    search () {
      let {filteredInfo} = this
      this.fetch({
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置查询参数
      this.queryParams = {}
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这两个参数赋值给Vue data，用于后续使用
      this.filteredInfo = filters
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      this.loading = true
      this.$postBodyRequest('api/v1/authMenu/queryAllAuthMenuTreeList', {
        ...params
      }).then((r) => {
        let data = r.data.data
        // console.log(JSON.stringify(data.rows))
        // console.log(JSON.stringify(data))
        this.loading = false
        if (Object.is(data.rows.children, undefined)) {
          this.dataSource = data.rows
        } else {
          this.dataSource = data.rows.children
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/*webpack 会以~符号作为前缀的路径视为依赖模块去解析*/
  @import "~@static/less/Common";
</style>
