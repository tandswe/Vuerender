<template>
    <div class="tmpl">
        <!-- 导航 -->
        <el-row>
            <el-col :span="24">
                <div class="abread bt-line">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>购物商城</el-breadcrumb-item>
                        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-col>
        </el-row>
        <!-- 按钮 -->
        <el-row>
            <el-col :span="24">
                <div class="abread bt-line">
                    <el-row>
                        <el-col :span="6">
                            <!--按钮和搜索框  -->
                            <el-button size="small">全选</el-button>
                            <router-link to="/admin/goodsadd">
                                <el-button size="small" >新增</el-button>
                            </router-link>
                            
                            <el-button size="small">删除</el-button>
                        </el-col>

                        <el-col :offset="12" :span="6">
                            <!-- 搜索框 -->
                            <el-input icon="search" placeholder="请输入搜索内容" @keyup.enter.native="getlist" v-model="searchValue" :on-icon-click="getlist">
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row>
            <el-col :span="24">
                <div>
                    <el-table ref="multipleTable" :data="list" border tooltip-effect="dark" style="width: 100%">
                        <!-- type="selection":这一列是一个checkbox勾选框 -->
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="title" label="标题">
                            <template scope="scope">
                                <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">
                                        <div slot="content">
                                                <img :src="scope.row.imgurl" width="100" height="100"alt="">
                                            </div>
                                        <a href="javascript:;">{{scope.row.title}}</a>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="categoryname" label="所属类别" width="100">
                        </el-table-column>
                        <el-table-column prop="stock_quantity" label="库存" width="100">
                        </el-table-column>
                        <el-table-column prop="market_price" label="市场价" width="100">
                        </el-table-column>
                        <el-table-column prop="sell_price" label="销售价" width="100">
                        </el-table-column>
                        <el-table-column label="属性" width="120">
                            <!-- scope:代表但是当前:data中的指向的某个对象，可以通过 scope -->
                            <template scope="scope">
                                <!-- 取得是list中的对象中的user_name这个属性的值 -->
                                <i v-bind="{class:'el-icon-picture '+(scope.row.is_slide==1?'':'unlinght') }"></i>
                                <i v-bind="{class:'el-icon-upload '+(scope.row.is_top==1?'':'unlinght') }"></i>
                            </template>
                        </el-table-column>

                        <!-- template：是属于当前列的模板，可以有程序员自己编写这一列的样式 -->
                        <el-table-column label="操作" width="120">
                            <template scope="scope">
                                <a href="#">修改</a>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
            </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row>
            <el-col :span="24">
                <div class="abread">
                    <el-pagination @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="pageIndex" :page-sizes="[1, 5, 10, 20]"
                        :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalcount">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        data() {
            return {
                pageSize: 10, //这里是每个页面的容量
                pageIndex: 1, //这里是当前的页码数  默认是1
                totalcount: 0, //这是总的页数
                searchValue: "",
                list: [],

            };
        },
        methods: {
            getlist() {
                this.list = [];
                var url =
                    "/admin/goods/getlist?pageIndex=" +
                    this.pageIndex +
                    "&pageSize=" +
                    this.pageSize +
                    "&searchvalue=" +
                    this.searchValue;

                this.$ajax.get(url).then(res => {
                    this.list = res.data.message;
                    // console.log(res.data.message);
                    // 找到总页数赋值
                    this.totalcount = res.data.totalcount;
                });
            },
            pageIndexChange(currentPage) {
                //   console.log(currentPage);
                // 将用户选择的当前页索引赋值给pageindex
                this.pageIndex = currentPage;
                // 重新获取新数据
                this.getlist();
            },
            // 获取当前的页容量 pagesize
            pageSizeChange(size) {
                //   console.log(size);
                this.pageSize = size;
                // 重新获取新数据
                this.getlist();
            }

        },
        mounted() {
            // 当页面进入的时候就请求数据
            this.getlist();
        }
    };
</script>
<style scoped>
    .unlinght {
        color: rgba(0, 0, 0, 0.3);
    }

    .goodstip {
        padding: 3px;
    }

    .abread {
        padding: 10px;
    }

    .ls.el-icon-picture,
    .ls.el-icon-upload,
    .ls.el-icon-star-on {
        opacity: 0.5;
        font-size: 18px;
    }

    .ls.el-icon-picture.imgactive,
    .ls.el-icon-upload.imgactive,
    .ls.el-icon-star-on.imgactive {
        opacity: 1;
        font-size: 18px;
    }

    .listedit {
        color: #2a72c5;
        font-size: 12px;
    }
</style>
