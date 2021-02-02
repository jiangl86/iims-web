const YhglList = () =>
    import ('views/yhgl/List')



const yhglRoutes = [
    //安委会组织机构相关页面
    {
        path: 'yhgl',
        name: 'YhglList',
        component: YhglList,
    },
]

export default yhglRoutes