const JkglIndex = () =>
    import ('views/jkgl/Index')



const jkglRoutes = [
    //安委会组织机构相关页面
    {
        path: 'jkgl',
        name: 'JkglIndex',
        component: JkglIndex,
    },
]

export default jkglRoutes