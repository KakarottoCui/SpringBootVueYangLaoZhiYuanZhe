<template>
  <div :class="[multiPage === true ? 'multi-page':'single-page', 'not-menu-page', 'user-profile']">
    <a-card title="">
      <a href="javascript:void(0)" slot="extra" @click="updateProfile">修改资料</a>
      <a-row :gutter="8">
        <a-col :span="6">
          <a-row style="text-align: center">
            <img style="width: 10rem;border-radius: 2px" alt="头像" :src="avatar">
          </a-row>
          <a-row style="text-align: center">
            <a-button icon="edit" style="margin-top:1rem" @click="updateAvatar">修改头像</a-button>
          </a-row>
        </a-col>
        <a-col :span="12" style="font-size: 3rem">
          <p>账户：{{user.userName}}</p>
          <p :title="user.roleName">角色：{{user.roleName? user.roleName: '暂无角色'}}</p>
          <p>电话：{{user.phoneNumber ? user.phoneNumber : '暂未绑定电话'}}</p>
          <p>性别：{{user.gender ? user.gender : '暂未设置性别'}}</p>
          <p>地址：{{sketch.address ? sketch.address : '暂无地址'}}</p>
          <p>年龄：{{sketch.age ? sketch.age : '暂无年龄'}}</p>
          <p v-if="user.email">邮箱：{{user.email ? user.email : '暂未绑定邮箱'}}</p>
          <!--部门暂时不显示-->
          <p v-if="user.deptName">部门：{{user.deptName? user.deptName: '暂无部门'}}</p>
          <p>描述：{{user.description}}</p>
        </a-col>
      </a-row>
    </a-card>
    <update-avatar
      @cancel="handleUpdateAvatarCancel"
      @success="handleUpdateAvatarSuccess"
      :user="user"
      :updateAvatarModelVisible="updateAvatarModelVisible">
    </update-avatar>
    <update-profile
      ref="updateProfile"
      @success="handleProfileEditSuccess"
      @close="handleProfileEditClose"
      :profileEditVisible="profileEditVisible">
    </update-profile>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import UpdateAvatar from './UpdateAvatar'
import UpdateProfile from './UpdateProfile'

export default {
  name: 'Profile',
  components: {UpdateAvatar, UpdateProfile},
  data () {
    return {
      updateAvatarModelVisible: false,
      profileEditVisible: false,
      userId: ''
    }
  },
  computed: {
    ...mapState({
      multiPage: state => state.setting.multiPage,
      user: state => state.account.user,
      sketch: state => state.account.sketch
    }),
    avatar () {
      return `static/avatar/${this.user.avatar}`
    },
  },
  methods: {
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    handleUpdateAvatarCancel () {
      this.updateAvatarModelVisible = false
    },
    handleUpdateAvatarSuccess (avatar) {
      this.updateAvatarModelVisible = false
      this.$message.success('更换头像成功')
      let user = this.user
      user.avatar = avatar
      this.setUser(user)
    },
    updateAvatar () {
      this.updateAvatarModelVisible = true
      this.authUserId = this.user.authUserId
    },
    updateProfile () {
      this.$refs.updateProfile.setFormValues(this.user)
      this.profileEditVisible = true
    },
    handleProfileEditClose () {
      this.profileEditVisible = false
    },
    handleProfileEditSuccess () {
      this.profileEditVisible = false
      this.$message.success('修改成功')
    }
  }
}
</script>
<style lang="less">
  .user-profile {
    .ant-card-body {
      padding: 1rem 0 !important;
      p {
        font-size: .9rem !important;
        margin-bottom: .6rem !important;
      }
    }
  }
</style>
