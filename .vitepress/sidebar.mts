export default {
    '/notes/kubernetes/': [
        {
            text: 'kubernetes',
            items: [
                {text: 'Index', link: '/guide/'},
                {text: 'One', link: '/guide/one'},
                {text: 'Two', link: '/guide/two'}
            ]
        }
    ],
    '/notes/istio/': [
        {
            text: 'istio',
            items: [
                {text: 'Index', link: '/guide/'},
                {text: 'One', link: '/guide/one'},
                {text: 'Two', link: '/guide/two'}
            ]
        }
    ],
    '/notes/operator/docker': [
        {
            text: 'docker基础',
            collapsed: false,
            items: [
                {text: 'docker基础', link: '/notes/operator/docker/test'},
                {text: 'docker部署', link: '/notes/operator/docker/test1'},
                {text: 'docker搭建', link: '/notes/operator/docker/test2'}
            ]
        },
        {
            text: 'docker故障排查案例',
            collapsed: false,
            items: [
                {text: 'docker基础', link: '/notes/operator/docker/test'},
                {text: 'docker部署', link: '/notes/operator/docker/test1'},
                {text: 'docker搭建', link: '/notes/operator/docker/test2'}
            ]
        }
    ],
    '/notes/operator/linux': [
        {
            text: 'linux',
            items: [
                {text: 'Index', link: '/guide/'},
                {text: 'One', link: '/guide/one'},
                {text: 'Two', link: '/guide/two'}
            ]
        }
    ],
    '/notes/operator/ansible': [
        {
            text: 'ansible',
            items: [
                {text: 'Index', link: '/guide/'},
                {text: 'One', link: '/guide/one'},
                {text: 'Two', link: '/guide/two'}
            ]
        }
    ],
    '/notes/operator/network': [
        {
            text: 'iptables基础',
            collapsed: false,
            items: [
                {
                    items: [
                        {
                            text: "iptables概念",
                            link: "/notes/operator/network/basic"
                        },
                        {
                            text: "iptables命令",
                            link: "/notes/operator/network/basic"
                        },
                    ]
                },
            ]
        },
        {
            text: "iptables故障排查案例",
            collapsed: false,
            items: [
                {
                    text:"iptables流量拦截故障",
                    link: "/notes/operator/network/iptables/iptables01"
                },
                {
                    text:"iptables增加日志功能分析",
                    link: "/notes/operator/network/iptables/iptables02"
                }
            ]
        }
    ],
    '/notes/training/': [
        {
            text: '培训相关',
            items: [
                {text: '1.20250102期数', link: '/notes/training/20250102'},
                {text: '2.20250103期数', link: '/notes/training/20250103'},
                {text: '3.20250104期数', link: '/notes/training/20250104'},
                {text: '4.20250105期数', link: '/notes/training/20250104'},
            ]
        }
    ]
}