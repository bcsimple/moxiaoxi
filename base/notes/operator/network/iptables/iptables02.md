#### 使用iptables LOG 去追踪流量在各个表链中的流向

在日常运维当中我们有的时候需要定位流量穿过哪些iptables 表和链 方可进行精准拦截

#### 1.脚本如下:

脚本可配置默认配置raw nat filter核心表 因为日常运维当中 这几个表经常会增加相关规则,所以你也可以根据自身需求修改

```shell
cat <<EOF addLog.sh

#!/usr/bin/env bash

tables=(raw nat filter)
#tables=(raw mangle nat filter)

raw=(PREROUTING OUTPUT )
mangle=(PREROUTING INPUT FORWARD OUTPUT POSTROUTING)
nat=(PREROUTING INPUT OUTPUT POSTROUTING)
filter=(INPUT  FORWARD OUTPUT)

function Execute() {
  Action=$1
  for table in "${tables[@]}";do
    TMP="$table"[@]
    TempB=(${!TMP})
    for chain in "${TempB[@]}";do
      if [[ $Action == "I" ]];then
          echo "iptables -t ${table} -$Action $chain 1 -j LOG --log-prefix ${table}-`echo "$chain" | tr [A-Z] [a-z]` "
          continue
      fi
          echo "iptables -t ${table} -$Action  $chain  -j LOG --log-prefix ${table}-`echo "$chain" | tr [A-Z] [a-z]` "
    done
  done

}

function AddIptablesRule() {
  Execute "I"
}

function DelIptablesRule() {
  Execute "D"
}

function PrintIptablesRule() {
  for i in "${tables[@]}" ;do iptables -t $i -vnL | grep -i log  ;done
}

case $1 in
  add|a|A)
    AddIptablesRule
  ;;
  del|d|D|delete)
    DelIptablesRule
  ;;
  p)
    PrintIptablesRule
  ;;
  *)
    echo "error params, A|D"
    ;;
esac

<<EOF
#添加执行权限
chmod +x addLog.sh
```

#### 2.使用说明

##### 2.1 新增LOG

```shell
./addLog.sh A | sh
```

##### 2.2 删除LOG

```shell
./addLog.sh  D | sh 
```

##### 2.3 查看生效规则

```shll
./addLog.sh p
```



#### 3.查看

```shell
]# dmesg | grep 9090

Mar 20 16:16:12 cilium-node03 kernel: [751773.032405] raw-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:12 cilium-node03 kernel: [751773.032420] nat-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:12 cilium-node03 kernel: [751773.032424] filter-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:12 cilium-node03 kernel: [751773.032427] nat-postroutingIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:12 cilium-node03 kernel: [751773.032441] raw-preroutingIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:12 cilium-node03 kernel: [751773.032445] filter-inputIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34556 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:13 cilium-node03 kernel: [751774.041222] raw-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34557 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:13 cilium-node03 kernel: [751774.041230] filter-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34557 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:13 cilium-node03 kernel: [751774.041295] raw-preroutingIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34557 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:13 cilium-node03 kernel: [751774.041299] filter-inputIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34557 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:15 cilium-node03 kernel: [751776.053444] raw-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34558 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:15 cilium-node03 kernel: [751776.053477] filter-outputIN= OUT=lo SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34558 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:15 cilium-node03 kernel: [751776.053557] raw-preroutingIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34558 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
Mar 20 16:16:15 cilium-node03 kernel: [751776.053565] filter-inputIN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=127.0.0.1 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=34558 DF PROTO=TCP SPT=50514 DPT=9090 WINDOW=65495 RES=0x00 SYN URGP=0 
```



