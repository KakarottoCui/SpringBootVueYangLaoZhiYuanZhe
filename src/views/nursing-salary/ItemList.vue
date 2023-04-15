<template>
    <a-card :bordered="false" class="card-area">
        <ItemFactor @handleSearch="handleSearch" @reset="reset"></ItemFactor>
        <div>
            <div class="operator" style="width: auto">
                <a-dropdown v-hasPermission="['volunteerInfo:export']">
                    <a-menu slot="overlay" v-if="showMoreStatus">
                        <a-menu-item key="export-data" @click="exportExcel">导出数据</a-menu-item>
                    </a-menu>
                    <a-button>
                        更多操作
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-button v-hasPermission="['volunteerInfo:batchDelete']" @click="batchDelete">删除</a-button>
                <a-button type="primary" @click="addItem" v-hasPermission="['volunteerInfo:add']">发布招募信息</a-button>
                <ImportExcel v-hasPermission="['volunteerInfo:importData']" ref="ImportExcel" :importUrl="importUrl"
                    :acceptFile="acceptFile" @importSuccess="handleImportSuccess" @importError="handleImportError" />
            </div>
            <!-- 表格区域 -->
            <a-table ref="TableInfo" :columns="dataColumns" :dataSource="dataSource" :pagination="pagination"
                :loading="loading" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange" :scroll="{ x: 1000 }" size="small">
                <template slot="remark" slot-scope="text, record">
                    <a-popover placement="topLeft">
                        <template slot="content">
                            <div style="max-width: 200px">{{text}}</div>
                        </template>
                        <p style="width: 200px;margin-bottom: 0">{{text}}</p>
                    </a-popover>
                </template>
                <template slot="operation" slot-scope="text, record">
                    <a-icon style="font-size: 20px" v-hasPermission="['volunteerInfo:edit']" type="edit" theme="twoTone"
                        twoToneColor="#4a9ff5" @click="itemEdit(record)" title="修改"></a-icon>
                    <a-icon style="font-size: 20px" type="eye" theme="twoTone" twoToneColor="#42b983"
                        @click="view(record)" title="数据详情"></a-icon>
                </template>
                <!--数据列动态选择渲染-->
<!--                <template slot="filterDropdown" slot-scope="text, record">
                    <a-row style="margin-left: 20px" type="flex" justify="space-between">
                        <a-checkbox @change="onColumnCheckAllChange">
                            全选
                        </a-checkbox>
                    </a-row>
                    <a-checkbox-group @change="onColumnPlainChange" :defaultValue="columnShowList">
                        <a-row type="flex" justify="space-between">
                            <a-col style="margin-left: 20px" v-for="(item,index) in dataColumns" :key="item.index"
                                :span="4" :order="item.index">
                                <a-checkbox :value="item.dataIndex" :disabled="item.disabled">
                                    {{item.title}}
                                </a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </template>-->
                <!--图片查看的模版-->
                <template slot="imageTags" slot-scope="text, record">
                    <img :src="record.surfaceImage" @click="handleTagImgChange(record.surfaceImage)"
                        style="width: 30px;height: 30px" />
                </template>
                <template slot="typeTags" slot-scope="text, record">
                    <a-tag color="blue">{{handleTypeByValue(record.type,payStatusOption)}}</a-tag>
                </template>
                <template slot="operatorTags" slot-scope="text, record">
                    <a-tag color="green">{{handleTypeByValue(record.operatorId,authUserIdOption)}}</a-tag>
                </template>
            </a-table>
        </div>
        <a-modal :visible="previewImageVisible" :footer="null" @cancel="handleImagePreviewCancel">
            <img alt="example" style="width: 100%" :src="previewImageUrl" />
        </a-modal>
        <!--数据详情-->
        <ItemParticulars :particularsData="itemData.data" :particularsVisible="itemData.particularsVisible"
            @close="handleParticularsClose">
        </ItemParticulars>
        <ItemEdit ref="ItemEdit" :itemEditData="itemData.data" :editVisible="itemData.editVisible"
            @close="handleEditClose" @success="handleEditSuccess">
        </ItemEdit>
        <!-- 信息新增-->
        <ItemAdd @close="handleItemAddClose" @success="handleItemAddSuccess" :addVisible="itemData.addVisible">
        </ItemAdd>
    </a-card>
</template>
<script>
    import ImportExcel from '@/components/import/ImportExcel'
    import ItemEdit from './ItemEdit'
    import ItemAdd from './ItemAdd'
    import ItemFactor from './ItemFactor'
    import ItemParticulars from './ItemParticulars'
    import moment from 'moment'
    import baseUtils from '@/utils/baseUtils'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    moment.locale('zh-cn')

    export default {
        name: 'ItemList',
        components: {
            ImportExcel: ImportExcel,
            ItemAdd: ItemAdd,
            ItemEdit: ItemEdit,
            ItemFactor: ItemFactor,
            ItemParticulars: ItemParticulars,
            baseUtils: baseUtils,
        },
        data() {
            return {
                payStatusOption: this.$commonConstants.payStatusOption,
                authUserIdOption: [],
                showMoreStatus: false,
                pageUrl: 'api/v1/volunteerInfo/queryByPage', //分页查询链接
                exportUrl: 'api/v1/volunteerInfo/exportData', //导出链接
                acceptFile: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                importUrl: process.env.BASE_API + 'api/v1/volunteerInfo/importData', //文件时上传,
                itemData: { //行信息
                    data: {},
                    particularsVisible: false,
                    editVisible: false,
                    addVisible: false
                },
                loading: false,
                validateStatus: '', //校验状态
                help: '', //提示信息
                previewImageVisible: false, //预览图片的弹出框
                previewImageUrl: '', //预览图片的URL
                advanced: false,
                dataSource: [],
                //选中的列
                columnShowList: [],
                //最终要显示的列
                columns: [],
                dataColumns: [{
                        title: '序号',
                        dataIndex: 'id',
                        width: 100,
                        fixed: 'left',
                        align: 'center',
                        showStatus: true,
                        disabled: true,
                        scopedSlots: {
                            filterDropdown: 'filterDropdown',
                        },
                    },
                    {
                        title: '主要工作内容',
                        dataIndex: 'mainInfo',
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '招募人数',
                        dataIndex: 'num',
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '兼职类型',
                        dataIndex: 'type',
                        scopedSlots: {
                            customRender: 'typeTags'
                        },
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '服务时间',
                        dataIndex: 'serviceTime',
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '发布时间',
                        dataIndex: 'updateTime',
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '发布人',
                        dataIndex: 'operatorId',
                        scopedSlots: {
                            customRender: 'operatorTags'
                        },
                        showStatus: true,
                        disabled: false,
                    },
                    {
                        title: '发布人联系方式',
                        dataIndex: 'phone',
                        showStatus: false,
                        disabled: false,
                    },
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        scopedSlots: {
                            customRender: 'operation'
                        },
                        align: 'center',
                        fixed: 'right',
                        width: 150,
                        showStatus: true,
                        disabled: true,
                    }
                ],
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
                expressForm: this.$form.createForm(this),
                queryParams: {},
            }
        },
        created() {
            //this.setOtherData()
        },
        computed: {
            ...mapState({
                currentUser: state => state.account.user
            }),
        },
        mounted() {
            this.fetch()
        },
        methods: {
            //设置需要显示的列
            setColumns() {
                let data = this.dataColumns
                //console.log("this.dataColumns : "+JSON.stringify(this.dataColumns));
                if (data.length > 0) {
                    this.columns.splice(0, this.columns.length)
                    this.columnShowList.splice(0, this.columnShowList.length)
                    data.map(item => {
                        let showStatus = item.showStatus
                        let dataIndex = item.dataIndex
                        if (showStatus) {
                            this.columns.push(item)
                            this.columnShowList.push(dataIndex)
                        }
                    })
                }
            },
            onColumnCheckAllChange(e) {
                let checked = e.target.checked
                let data = this.dataColumns
                console.log('e.target.checked  : ' + e.target.checked)
                if (checked) {
                    if (data.length > 0) {
                        this.columns.splice(0, this.columns.length)
                        this.columnShowList.splice(0, this.columnShowList.length)
                        data.map(item => {
                            let dataIndex = item.dataIndex
                            this.columns.push(item)
                            this.columnShowList.push(dataIndex)
                        })
                    }
                } else {
                    this.setColumns();
                }
            },
            onColumnPlainChange(checkedValues) {
                let data = checkedValues
                if (data && data.length > 0) {
                    //console.log('选中的列 ', JSON.stringify(data));
                    this.dataColumns.map(item => {
                        let dataIndex = String(item.dataIndex)
                        //console.log('需要被查找的数据数据:dataIndex: '+dataIndex)
                        //console.log('需要被查找的数据数据:data.indexOf(dataIndex): '+data.indexOf(dataIndex))
                        if (dataIndex && data.indexOf(dataIndex) > -1) {
                            //console.log('查找到需要定位的数据:dataIndex: '+dataIndex)
                            item.showStatus = true
                        } else {
                            item.showStatus = false
                        }
                    })
                    this.setColumns();
                }
            },
            handleSearch(queryParams) {
                if (!baseUtils.isNull(queryParams)) {
                    this.queryParams = queryParams
                }
                //console.log('接受子组件传输过来的查询条件queryParams: '+JSON.stringify(queryParams))
                this.fetch({
                    ...this.queryParams
                })
            },
            /*handleRegionChange(value){
                console.log(JSON.stringify(value))
                if(baseUtils.isNull(value)){
                    this.queryParams.regionId = null;
                    return;
                }
                let key = value.key;
                this.queryParams.regionId = key
            },*/
            handlerReportTypeChange(value) {
                this.queryParams.reportType = value
            },
            handleImportSuccess() { //处理导入成功
                console.log('导入成功')
                this.fetch(...this.queryParams)
            },
            handleImportError() {

                this.$message.error('导入失败')
            },
            async setOtherData() {
                this.authUserIdOption = await this.$commonConstants.authUserIdOption()
                this.setColumns(); //设置数据列
            },
            handleTypeByValue(value, optionList) {
                console.log('optionList : ' + JSON.stringify(optionList))
                console.log('value : ' + value)
                if (baseUtils.isNull(value)) {
                    return '无'
                }
                if (!optionList || !optionList.length > 0) {
                    return '';
                }
                let resultList =
                    optionList.filter(item => item.value == value);
                console.log(JSON.stringify(resultList))
                if (resultList && resultList.length > 0) {
                    return resultList[0].text;
                } else {
                    return '无'
                }
            },
            handleItemAddClose() {
                console.log('handleItemAddClose')
                this.itemData.addVisible = false
            },
            handleItemAddSuccess() {
                console.log('handleItemAddSuccess')
                this.itemData.addVisible = false
                this.$message.success('新增成功')
                this.search()
            },
            addItem() { //新增数据
                this.itemData.addVisible = true
            },
            handleEditSuccess() {
                this.itemData.editVisible = false
                this.$message.success('更新成功')
                this.search()
            },
            handleEditClose() {
                this.itemData.editVisible = false
                this.search()
            },
            moment,
            //处理下拉菜单点击
            handleStatusSelectChange(value) {
                if (baseUtils.isNull(value)) {
                    this.queryParams.activityStatus = ''; //如果不选择的话是需要清除查询条件的的
                    return;
                }
                console.log(value); // { key: "lucy", label: "Lucy (101)" }
                this.queryParams.activityStatus = value.key;
            },
            //查看数据信息
            view(record) {
                this.itemData.data = record
                this.itemData.particularsVisible = true
            },
            handleParticularsClose() {
                this.itemData.particularsVisible = false
            },

            handleTagImgChange(url) {
                this.previewImageVisible = true
                this.previewImageUrl = url
            },

            handleImagePreviewCancel() {
                this.previewImageVisible = false
                this.previewImageUrl = ''
            },

            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys
            },
            toggleAdvanced() {
                this.advanced = !this.advanced
                if (!this.advanced) {
                    this.queryParams.fieldName = ''
                }
            },
            //设置数据内容
            itemEdit(record) {
                this.itemData.data = record
                this.itemData.editVisible = true
            },
            //批量删除
            batchDelete() {
                if (!this.selectedRowKeys.length) {
                    this.$message.warning('请选择需要删除的记录')
                    return
                }
                let that = this
                this.$confirm({
                    title: '确定删除所选中的记录?',
                    content: '当您点击确定按钮后，这些记录将会被彻底删除',
                    centered: true,
                    onOk() {
                        let mainIdList = []
                        for (let key of that.selectedRowKeys) {
                            mainIdList.push(that.dataSource[key].volunteerInfoId)
                        }
                        that.$delete('api/v1/volunteerInfo/batchDeleteItem/' + mainIdList.join(',')).then(
                    () => {
                            that.$message.success('删除成功')
                            that.selectedRowKeys = []
                            that.search()
                        })
                    },
                    onCancel() {
                        that.selectedRowKeys = []
                    }
                })
            },
            exportExcel() {
                this.$exportData(this.exportUrl, {
                    ...this.queryParams
                })
            },
            search() {
                this.fetch({
                    ...this.queryParams
                })
            },
            reset() {
                // 取消选中
                this.selectedRowKeys = []
                // 重置分页
                this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
                if (this.paginationInfo) {
                    this.paginationInfo.current = this.pagination.defaultCurrent
                    this.paginationInfo.pageSize = this.pagination.defaultPageSize
                }
                this.paginationInfo = null
                // 重置查询参数
                this.queryParams = {}
                this.fetch()
            },
            handleTableChange(pagination, filters, sorter) {
                this.paginationInfo = pagination
                this.fetch({
                    ...this.queryParams
                })
            },
            fetch(params = {}) {
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
                this.$postBodyRequest(this.pageUrl, {
                    ...params
                }).then((r) => {
                    let data = r.data.data
                    const pagination = {
                        ...this.pagination
                    }
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