<template>
  <a-drawer
    title="新增菜单"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="menuAddVisible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='菜单名称' v-bind="formItemLayout">
        <a-input v-model="menu.menuName"
                 v-decorator="['menuName',
                   {rules: [
                    { required: true, message: '菜单名称不能为空'},
                    { max: 10, message: '长度不能超过10个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='菜单URL'
                   v-bind="formItemLayout">
        <a-input v-model="menu.path"
                 v-decorator="['path',
                 {rules: [
                  { required: true, message: '菜单URL不能为空'},
                  { max: 200, message: '长度不能超过200个字符'}
                ]}]"/>
      </a-form-item>
      <a-form-item label='组件地址'
                   v-bind="formItemLayout">
        <a-input v-model="menu.component"
                 v-decorator="['component',
                 {rules: [
                  { required: true, message: '组件地址不能为空'},
                  { max: 200, message: '长度不能超过200个字符'}
                ]}]"/>
      </a-form-item>
      <a-form-item label='相关权限' v-bind="formItemLayout">
        <a-input v-model="menu.perms"
                 v-decorator="['perms',
                   {rules: [
                    { max: 50, message: '长度不能超过50个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='菜单图标'
                   v-bind="formItemLayout">
        <a-input ref="icons" v-model="menu.icon" placeholder="点击右侧按钮选择图标">
          <a-icon v-if="menu.icon" slot="suffix" type="close-circle" @click="deleteIcons"/>
          <a-icon slot="addonAfter" type="setting" style="cursor: pointer" @click="chooseIcons"/>
        </a-input>
      </a-form-item>
      <a-form-item label='菜单排序' v-bind="formItemLayout">
        <a-input-number v-model="menu.orderNum" style="width: 100%"/>
      </a-form-item>
      <a-form-item label='上级菜单'
                   style="margin-bottom: 2rem"
                   v-bind="formItemLayout">
        <a-tree
          :key="menuTreeKey"
          :checkable="true"
          :checkStrictly="true"
          @check="handleCheck"
          @expand="handleExpand"
          :expandedKeys="expandedKeys"
          :treeData="menuTreeData">
        </a-tree>
      </a-form-item>
    </a-form>
    <div class="drawer-bottom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="2" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃修改？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <icons
      @choose="handleIconChoose"
      @close="handleIconCancel"
      :iconChooseVisible="iconChooseVisible">
    </icons>
  </a-drawer>
</template>
<script>
import Icons from './Icons'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'MenuAdd',
  components: {Icons},
  props: {
    menuAddVisible: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      menuTreeKey: +new Date(),
      menu: {
        icon: ''
      },
      checkedKeys: [],
      expandedKeys: [],
      menuTreeData: [],
      iconChooseVisible: false
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.menuTreeKey = +new Date()
      this.expandedKeys = this.checkedKeys = []
      this.menu = {}
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    expandAll () {
      this.expandedKeys = this.allTreeKeys
    },
    closeAll () {
      this.expandedKeys = []
    },
    handleExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    chooseIcons () {
      this.iconChooseVisible = true
    },
    handleIconCancel () {
      this.iconChooseVisible = false
    },
    handleIconChoose (value) {
      this.menu.icon = value
      this.iconChooseVisible = false
    },
    deleteIcons () {
      this.menu.icon = ''
    },
    handleSubmit () {
      let checkedArr = Object.is(this.checkedKeys.checked, undefined) ? this.checkedKeys : this.checkedKeys.checked
      if (checkedArr.length > 1) {
        this.$message.error('最多只能选择一个上级菜单，请修改')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          if (checkedArr.length) {
            this.menu.parentId = checkedArr[0]
          } else {
            this.menu.parentId = ''
          }
          // 0 表示菜单 1 表示按钮
          this.menu.type = '0'
          //提交菜单新增信息
          this.$postBodyRequest('api/v1/authMenu/addMenu', {
            ...this.menu
          }).then(() => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    menuAddVisible () {
      if (this.menuAddVisible) {
        this.$postBodyRequest('api/v1/authMenu/queryAllAuthMenuTreeList', {
          type: '0'
        }).then((r) => {
          let data = r.data.data
          this.menuTreeData = data.rows.children
          this.allTreeKeys = data.ids
        })
      }
    }
  }
}
</script>
