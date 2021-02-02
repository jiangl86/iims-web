const XmglList = () =>
    import ('views/xmgl/List')
const XmglModuleList = () =>
    import ('views/xmgl/ModuleList')



const xmglRoutes = [
    //安委会组织机构相关页面
    {
        path: 'xmgl',
        name: 'XmglList',
        component: XmglList,
    },
    {
        path: 'xmgl/modules',
        name: 'XmglModuleList',
        component: XmglModuleList,
    },

]

export default xmglRoutes