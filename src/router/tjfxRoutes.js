const TjfxIndex = () =>
    import ('views/tjfx/Index')
const InterfaceStatistic = () =>
    import ('views/tjfx/InterfaceStatistic')



const tjfxRoutes = [
    //统计分析相关页面
    {
        path: 'tjfx',
        name: 'TjfxIndex',
        component: TjfxIndex,
        children: [{
            path: 'jktj',
            name: 'InterfaceStatistic',
            component: InterfaceStatistic,
        }]
    },
]

export default tjfxRoutes