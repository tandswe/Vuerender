 //查找node_modules中的vue这个包
import Vue from 'vue';

// 2.0 导入app.vue组件对象
import App from './App.vue';   //当前目录下面查找app.vue这个组件


// 3.0 导入vue-router这个路由模块进行整个系统的路由控制
// 3.0.1 导入vue-router这个包
import VueRouter from 'vue-router';

// 3.0.0 将VueRouter对象通过Vue.use()使用一下
Vue.use(VueRouter);

// 3.0.2 导入组件对象  这里是要找到下面设定路由的组件
import layout from './components/layout.vue';
import login from './components/account/login.vue';


// 商品相关的组件
import goodslist from './components/goods/goodslist.vue';
import goodsadd from './components/goods/goodsadd.vue';
import goodsedit from './components/goods/goodsedit.vue';


// 3.0.2 实例化对象并且定义路由规则
var router = new VueRouter({
    routes:[
        // 默认跳转的路由规则
        {name:'default',path:'/',redirect:'/admin'},
        // 登录
        {name:'login',path:'/login',component:login,meta:{nologin:true}},
        // 布局
        {name:'layout',path:'/admin',component:layout,
        children:[
            // 商品列表
            {name:'goodslist',path:'goodslist',component:goodslist,meta:{mno:'1-2'}},
            {name:'goodsadd',path:'goodsadd',component:goodsadd,meta:{mno:'1-1'}},
            {name:'goodsedit',path:'goodsedit/:goodsid',component:goodsedit,meta:{mno:'1-1'}}
        ]
    }
    ]
});

// 4.0 导入vue的一个组件库:element-ui
import elementUI from 'element-ui';

// 导入默认样式(由于咱们自己修改了样式所以要替换默认样式)
import '../static/them_rms/index.css';

// 导入自己编写的全局样式
import '../static/css/site.css';

// 绑定到vue中
Vue.use(elementUI);

// 4这里要优化你的ajax代码
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8899';
Vue.prototype.$ajax=axios;
// 5.0.2 配置axios在请求数据服务接口的时候，允许带cookie(凭证)
axios.defaults.withCredentials = true;
// 6 在vue-router对象上添加一个全局守卫，在任何组件渲染出来之前都需要先执行这个守卫函数
router.beforeEach((to,from,next)=>{
    // console.log(to);
    // console.log(from);
    // 这里是给点击管理的时候一定的优化
    if(to.meta.mno){
        localStorage.setItem('currentMID',to.meta.mno)
    }
     // 判断如果进入的是登录页面，由于登录的路由规则上有一个  meta:{nologin:true} 而其他规则上没有
    // 所以可以判断 to.meta.nologin 的值如果是为true则跳过登录检查，否则进入登录检查
    if(to.meta.nologin){
        next();

        // 阻断下面代码的继续运行
        return;
    }

    // 进入任何组件都会触发这个请求，进行登录判断
    axios.get('/admin/account/islogin').then(res=>{       
        if(res.data.code =='nologin'){
            // 表示没有登录，则跳转到登录页面
            router.push({name:'login'});
        }else{
            // 登录成功
             // 调用next()继续渲染组件
            next();
        }
    });
})
// 3.0 实例化vue对象
new Vue({
    el:'#app',
    router,  //绑定路由对象使它生效
    // render:function(create){create(App)}
    // 将app组件编译将这个组件中的内容填充到 el:指向的app这个div中
    render:create=>create(App)
});