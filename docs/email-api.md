## 注册邮箱
参数
account: 钱包地址
email：邮箱地址
general: 0表示未选择，1表示选择
trading: 0表示未选择，1表示选择

curl -H "Content-Type: application/json" -X POST -d '{"account": "123", "email": "faria.chen@ingroup.chat", "general": "1", "trading": "0" }' 'http://statistic.enchanter.fi/api/v1/base/registe'


## 更新邮箱信息
参数
account: 钱包地址
email：邮箱地址
general: 0表示未选择，1表示选择
trading: 0表示未选择，1表示选择

curl -H "Content-Type: application/json" -X POST -d '{"account": "1234", "email": "faria.chen@ingroup.chat", "general": "1", "trading": "1" }' 'http://statistic.enchanter.fi/api/v1/base/update'

## 验证邮箱
参数
account: 钱包地址
code：验证码

curl -H "Content-Type: application/json" -X POST -d '{"account": "1234", "code": "8d22c3bc5cd879907d3cee4dc934228cc4dd252ee56c364ececc9366e413fad9"}' 'http://statistic.enchanter.fi/api/v1/base/verify'

## 获取邮箱的信息
参数
account: 钱包地址
curl 'http://statistic.enchanter.fi/api/v1/base/getemail?account=1234'


## 开仓时发送邮件
参数
email：邮箱地址
poolname: 资产池
timestamp: 开仓时间戳，单位是ms级别
amount: 开仓资产数量
name: 开仓资产名称

curl -H "Content-Type: application/json" -X POST -d '{"poolname": "1234", "email": "faria.chen@ingroup.chat", "timestamp": "1691736488000", "amount": "100", "name": "ETH" }' 'http://statistic.enchanter.fi/api/v1/base/eoepn'


## 平仓时发送邮件
参数
email：邮箱地址
poolname: 资产池
timestamp: 开仓时间戳，单位是ms级别
amount: 平仓资产数量
name: 平仓资产名称

curl -H "Content-Type: application/json" -X POST -d '{"poolname": "1234", "email": "faria.chen@ingroup.chat", "timestamp": "1691736488000", "amount": "100", "name": "ETH" }' 'http://statistic.enchanter.fi/api/v1/base/eclose'