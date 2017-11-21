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

// 3.0.2 实例化对象并且定义路由规则
var router = new VueRouter({
    routes:[
        // 默认跳转的路由规则
        {name:'default',path:'/',redirect:'/admin'},
        // 登录
        {name:'login',path:'/login',component:login},
        // 布局
        {name:'layout',path:'/admin',component:layout,
        children:[
            // 商品列表
            {name:'goodslist',path:'goodslist',component:goodslist}
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

// 3.0 实例化vue对象
new Vue({
    el:'#app',
    router,  //绑定路由对象使它生效
    // render:function(create){create(App)}
    // 将app组件编译将这个组件中的内容填充到 el:指向的app这个div中
    render:create=>create(App)
});