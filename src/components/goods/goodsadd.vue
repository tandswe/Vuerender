<template>
  <div class="tmpl">
    <!-- 面包屑 -->
    <div class="abread bt-line">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>返回上一层</el-breadcrumb-item>
        <el-breadcrumb-item>购物商城</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operation">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!-- 标题 -->
        <el-row>
          <el-col :span="14">
            <el-form-item label="商品标题" >
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
  
            <el-form-item label="所属类别" prop="category">
              <el-select v-model="ruleForm.category_id" placeholder="所属类别">
                <el-option v-for="item in list" :label="item.title" :value="item.category_id">
                  <span v-for="sub in (item.class_layer-1)">&nbsp;</span>
                  <span v-if="item.class_layer>1">--</span>{{item.title}}
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- 开关 -->
            <el-form-item label="是否发布">
              <el-switch v-model="ruleForm.status" on-text="是" on-color="#4DB3FF" off-text="不是">
              </el-switch>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐类型">
              <el-switch v-model="ruleForm.is_slide" on-text="轮播图" on-color="#4DB3FF" off-text="轮播图">
              </el-switch>
              <el-switch v-model="ruleForm.is_top" on-text="置顶" on-color="#4DB3FF" off-text="置顶">
              </el-switch>
              <el-switch v-model="ruleForm.is_hot" on-text="推荐" on-color="#4DB3FF" off-text="推荐">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="封面上传">
              <el-upload class="upload-demo" action="http://127.0.0.1:8899/admin/article/uploadimg" :file-list="ruleForm.imgList" list-type="picture"
                :on-success="imgUploaded">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="相册上传">
              <el-upload class="upload-demo" action="http://127.0.0.1:8899/admin/article/uploadfile" :file-list="ruleForm.fileList" :on-success="fileUplaoded"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
       
          <el-row>
            <el-col>
              <el-form-item label="内容摘要" prop="zhaiyao">
                <el-input v-model="ruleForm.zhaiyao"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="自己文章" prop="content">
                <quill-editor :content="ruleForm.content" @change="onEditorChange($event)">
                </quill-editor>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 登录 -->
          <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor';
  export default {
    // 这里是渲染富文本框
    components: {
      quillEditor
    },
    data() {
      return {
        list: [],//这里是储存所属类别 
        // 
        ruleForm: {
          "title": "1",
          "sub_title": "2",
          "goods_no": "NZ0000000002",
          category_id: 43, // 小问题：category_id要是一个数值类型，如果变成字符串类型的话，则页面显示不正常
          "stock_quantity": 200,
          "market_price": 1000,
          "sell_price": 800,
          "status": true,
          "is_slide": true,
          "is_top": false,
          "is_hot": true,
          "zhaiyao": "",
          "content": "",
          "imgList": [
            // {
              // "name": "wTgAWDLpQReTQ-ZOMdlAk4vF.jpg",
              // "url": "http://127.0.0.1:8899/imgs/wTgAWDLpQReTQ-ZOMdlAk4vF.jpg",
              // "shorturl": "/imgs/wTgAWDLpQReTQ-ZOMdlAk4vF.jpg"
            // }
          ],
          "fileList": [
            // {
              // "name": "HN5d4_wrbsUk5KQNjzYSGGwm.jpg",
              // "url": "http://127.0.0.1:8899/imgs/HN5d4_wrbsUk5KQNjzYSGGwm.jpg",
              // "shorturl": "/imgs/HN5d4_wrbsUk5KQNjzYSGGwm.jpg"
            // }
          ]
        },
        rules: {
          title: [
            // 表示商品标题非空验证，通过失去焦点的时候触发
            { required: true, message: '请输入商品标题', trigger: 'blur' },
          ],
          zhaiyao:[
          { required: true, message: '请输入内容摘要', trigger: 'blur' },
          ],
          content:[
          { required: true, message: '请输入自己的内容', trigger: 'blur' },
          ]
        },
      }
    },
    mounted() {
      this.getlist();
    },
    methods: {
      // 多张图片上传
      fileUplaoded(responese, file, filelist) {
        console.log(responese);
        this.ruleForm.fileList.push(responese)
      },
      // 图片上传成功的时候的函数
      imgUploaded(responese, file, filelist) {
        console.log(responese);
        this.ruleForm.imgList = [responese]
      },
      // 重置表单
      resetForm(formName) {
        console.log(111);
        this.$refs[formName].resetFields();
        //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      },
      // 点击时跳转
      submitForm(formName) {
        // console.log( this.ruleForm);
        // 对整个表单进行校验的方法  如果是等于true  证明表单都是正确的
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.post("/admin/goods/add/goods", this.ruleForm)

              .then(res => {

                if (res.data.status == 1) {
                  // 这里是emlemntUI中的mssae消息提醒
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                    duration: 1000
                  })
                } else {
                  // 这里是用vue 官网的路由  那里的跳转写法 
                  // 11
                  this.$router.push({name:'goodslist'});
                }

              });
          } else {
            // console.log('error submit');
            return flase;
          }
        })
      },
      // 这里接收到数据库里面的 所属类别
      getlist() {
        var url = "/admin/category/getlist/goods"
        this.$ajax.get(url).then(res => {
          // console.log(res);
          this.list = res.data.message
          
        })

      },
      // 这里是富文本的事件
      onEditorChange(ev) {
        this.ruleForm.content = ev.html;
      },
     
   
    
    }
  }
</script>
<style scoped>
  .operation {
    border: 1px solid rgba(0, 0, 0, .1);
    padding: 10px;
    margin: 15px 0 0;
    border-radius: 10px;
  }

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