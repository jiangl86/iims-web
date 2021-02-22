const YhglList = () =>
    import ('views/yhgl/List')
const RzglList = () =>
    import ('views/rzgl/List')



const xtglRoutes = [
    //安委会组织机构相关页面
    {
        path: 'yhgl',
        name: 'YhglList',
        component: YhglList,
    },
    {
        path: 'rzgl',
        name: 'RzglList',
        component: RzglList,
    },
]

export default xtglRoutes