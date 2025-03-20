

#### 主题:  一条流量拦截引起的思考?



> [!TIP]
>
> - 访问localhost 和 127.0.0.1 有什么不同? 为什么流量无法拦截
> - linux主机解析为什么ipv6优先级比ipv4优先级高





##### 1.拦截命令如下:

```shell
iptables -t raw -A PREROUTING -s 127.0.0.1 -p tcp --dport 9090 -j DROP
```

**分析命令**

- -t 执行表
- -A append 追加
- -s 原地址
- -p 执行协议
- --dport 目标端口
- -j DROP 设置动作为DROP 

就是相当于不管你从哪个网卡进也不管你从哪个网卡出  只要你的原地址是127.0.0.1 tcp协议目标端口是9090 统一丢掉

比如我们有一个web服务开启9090端口

测试方式:

- curl localhost:9090   结果: 正常访问
- curl 127.0.0.1:9090   结果:  hang住 无法访问



**分析:**

​	正常思路就是我们认识中localhost不就是127.0.0.1 看似这两种方式是一样 理想状态下都是不可访问的 但是偏偏出现了意外 localhost是可以进行访问的? 是无法拦截还是怎么样?



#####  2.排查思路

###### 2.1 抓包 

```shell
#一个终端
]# curl 127.0.0.1:9090 
      #hang住
#另外一个终端
]# tcpdump -i lo -enn -p tcp
18:17:52.604658 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv4 (0x0800), length 74: 127.0.0.1.36502 > 127.0.0.1.9090: Flags [S], seq 3172559520, win 65495, options [mss 65495,sackOK,TS val 3940571284 ecr 0,nop,wscale 7], length 0
18:17:53.624350 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv4 (0x0800), length 74: 127.0.0.1.36502 > 127.0.0.1.9090: Flags [S], seq 3172559520, win 65495, options [mss 65495,sackOK,TS val 3940572303 ecr 0,nop,wscale 7], length 0

#一个终端
]# curl localhost:9090 
]# hello world  # 相应报文

#另外一个终端
]# tcpdump -i lo -enn -p tcp
18:18:24.277973 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 94: ::1.60572 > ::1.9090: Flags [S], seq 1558289436, win 65476, options [mss 65476,sackOK,TS val 1556521519 ecr 0,nop,wscale 7], length 0
18:18:24.277987 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 94: ::1.9090 > ::1.60572: Flags [S.], seq 1760226079, ack 1558289437, win 65464, options [mss 65476,sackOK,TS val 1556521519 ecr 1556521519,nop,wscale 7], length 0
18:18:24.278002 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.60572 > ::1.9090: Flags [.], ack 1, win 512, options [nop,nop,TS val 1556521519 ecr 1556521519], length 0
18:18:24.279148 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 164: ::1.60572 > ::1.9090: Flags [P.], seq 1:79, ack 1, win 512, options [nop,nop,TS val 1556521520 ecr 1556521519], length 78
18:18:24.279171 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.9090 > ::1.60572: Flags [.], ack 79, win 511, options [nop,nop,TS val 1556521520 ecr 1556521520], length 0
18:18:24.279539 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 214: ::1.9090 > ::1.60572: Flags [P.], seq 1:129, ack 79, win 512, options [nop,nop,TS val 1556521520 ecr 1556521520], length 128
18:18:24.279784 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.60572 > ::1.9090: Flags [.], ack 129, win 511, options [nop,nop,TS val 1556521521 ecr 1556521520], length 0
18:18:24.281304 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.60572 > ::1.9090: Flags [F.], seq 79, ack 129, win 512, options [nop,nop,TS val 1556521522 ecr 1556521520], length 0
18:18:24.281395 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.9090 > ::1.60572: Flags [F.], seq 129, ack 80, win 512, options [nop,nop,TS val 1556521522 ecr 1556521522], length 0
18:18:24.281404 00:00:00:00:00:00 > 00:00:00:00:00:00, ethertype IPv6 (0x86dd), length 86: ::1.60572 > ::1.9090: Flags [.], ack 130, win 512, options [nop,nop,TS val 1556521522 ecr 1556521522], length 0

```



上面我们可以看到

- 当访问 127.0.0.1:9090的时候 抓包里面的 source ip 和 dst ip都是 127.0.0.1
- 当访问 localhost:9090的时候 抓包里面的 source ip 和 dst ip都是 ::1 **而不是127.0.0.1** 但是我们的规则里面确是127.0.0.1 所以不能拦截掉



###### 2.2 ping测试

```shell
]# ping localhost
PING localhost(ip6-localhost (::1)) 56 data bytes
64 bytes from ip6-localhost (::1): icmp_seq=1 ttl=64 time=0.028 ms
64 bytes from ip6-localhost (::1): icmp_seq=2 ttl=64 time=0.047 ms
^C
--- localhost ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.028/0.037/0.047/0.009 ms
```

上面可以看出当使用ping解析localhost的时候确是也是::1 而不是我们想象中的127.0.0.1



###### 2.3 查看/etc/hosts配置文件

```shell
]# cat /etc/hosts
127.0.0.1       localhost
127.0.1.1       zs-virtual-machine

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

可以看出来确是是 有解析127.0.0.1 同时下面对于ipv6 也解析到了 ::1 



##### 3.提出问题并解答

###### 3.1 为什么ping的时候不去解析localhost 为127.0.0.1 而是::1 

​	因为默认情况下再不需要更改主机配置的时候 系统在开启ipv6的时候  ipv6的优先级会比ipv4更高 所以我们就看到 localhost 解析为 ::1 同时不管在/etc/hosts中的顺序是怎么样 

###### 3.2 如何改变ipv4优先解析 或者 强制ipv4解析

- 关闭ipv6

    - sysctl -w net.ipv6.conf.all.disable_ipv6=1
    - sysctl -w net.ipv6.conf.default.disable_ipv6=1

- 提升ipv4优先级   **修改 `/etc/gai.conf`**

    如果你希望 `localhost` 优先解析为 `127.0.0.1`（IPv4），可以修改 `/etc/gai.conf` 文件：

    1. 打开 `/etc/gai.conf`：

        ```
        sudo nano /etc/gai.conf
        ```

    2. 取消注释以下行（如果存在）：

        ```
        precedence ::ffff:0:0/96  100
        ```

        这会将 IPv4 地址的优先级提高到 100，高于默认的 IPv6 优先级。

###### 3.3 规则如何优化一下

如果我们再不是用3.2的方式 想要去禁止则可以增加ipv6 iptables规则

```shell
]# ip6tables  -t raw -A PREROUTING -s ::1 -p tcp --dport 9090 -j DROP
```



##### 4. 思考一下 为什么需要再raw表的PREROUTING链上进行操作?



![image-20250320183305419](/Users/zhangshun/Documents/Document/小程序/basic-test/项目/vitepress-02/base/notes/operator/network/iptables/iptables01.assets/image-20250320183305419.png)





