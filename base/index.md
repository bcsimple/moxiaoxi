---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "MoXiaoXi Notes"
  text: "笔记知识库"
#  tagline: My great project tagline
  image:  { light: "/index/index-light.png", dark: "/index/index-dark.png",alt: "logo" }
  actions:
    - theme: brand
      text: kubernetes笔记
      link: /notes/kubernetes/kubernetes.html
    - theme: alt
      text: 培训笔记
      link: /notes/training/training.html

features:
  - title: Kubernetes Notes
    link: "/notes/kubernetes/kubernetes"
    details: kubernetes笔记汇总
    icon:  { light: "/index/k8s-light.svg",dark: "/index/k8s-dark.svg",alt: "", width: "", height: "" }
  - title: Istio Notes
    link: "/notes/istio/istio"
    details: 服务网格笔记汇总
    icon:  { light: "/index/istio-light.svg",dark: "/index/istio-dark.svg",alt: "", width: "", height: "" }
  - title: Operation Notes
    link: "/notes/operator/docker/docker"
    details: 日常运维及故障处理笔记汇总
    icon:  { light: "/index/operator-light.svg",dark: "/index/operator-dark.svg",alt: "", width: "", height: "" }
  - title: 培训文档入口
    link: "/notes/training/training"
    details: 培训markdown文档汇总
    icon:  { light: "/index/edu-light.svg",dark: "/index/edu-dark.svg",alt: "", width: "", height: "" }

---

