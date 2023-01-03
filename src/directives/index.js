// 负责管理所有的自定义指令

export const imagerror = {
    // 指令对象,会在当前的dom元素插入到节点之后执行
    inserted(dom,options){
            //  dom 表示当前 指令的dom对象
            //  dom 认为此时就是图片
            //  当图片有地址，但是地址没有加载成功的时候，会报错，会触发一个事件 => onerror
            dom.onerror = function(){
                // dom 可以注册err事件
                dom.src = options.value
            }
    }
}
