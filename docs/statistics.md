# Statistics Backend API
## 1. Histograms

### URL

- http://ip:port/api/v1/graph/histogram

### 请求格式

POST方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**http请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| start   |Number | 开始时间戳 |
| end   |Number | 结束时间戳 |
| dtype   |String | 数据类型，有六种类型，tvl, vol, traders, trades, tradingfee, insufund，如果不填的话，会给出所有六种类型的数据 |


### 返回值

**Data**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| data   | Array Of Item(Object) | 数据部分 |
| decimals  | Number | incre和cumul部分的精度，默认18 |

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| timestamp   | Number | 零点时间戳，代表某一天，一般是当天零点的时间戳 |
| tvl  | String | tvl增量 |
| ttvl  | String | tvl累积量 |
| vol  | String | vol增量 |
| tvol  | String | vol累积量 |
| tradingfee  | String | tradingfee增量 |
| ttradingfee  | String | tradingfee累积量 |
| traders  | String | traders增量 |
| ttraders  | String | traders累积量 |
| trades  | String | trades增量 |
| ttrades  | String | trades累积量 |
| insufund  | String | insufund增量 |
| tinsufund  | String | insufund累积量 |


**返回样例**

```
{
    "data":{
        "data":[
            {
                "tvl":"0",
                "vol":"2344361045677352504384",
                "tradingfee":"1533199531516743164",
                "traders":"0",
                "trades":"41",
                "insufund":"0",
                "ttvl":"204060000000000000000000",
                "tvol":"51322750227731205070341",
                "ttradingfee":"36097415622722930230",
                "ttraders":"17",
                "ttrades":"245",
                "tinsufund":"0",
                "timestamp":"1693497600"
            },
            {
                "tvl":"0",
                "vol":"1706467316765465216129",
                "tradingfee":"1039795835877732596",
                "traders":"1",
                "trades":"16",
                "insufund":"0",
                "ttvl":"204060000000000000000000",
                "tvol":"53029217544496670286470",
                "ttradingfee":"37137211458600662826",
                "ttraders":"18",
                "ttrades":"261",
                "tinsufund":"0",
                "timestamp":"1693584000"
            }
        ],
        "decimals":18
    },
    "code":0,
    "message":"ok"
}
```

## 2. Tables

### URL

- http://ip:port/api/v1/graph/tables

### 请求格式

POST方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**http请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| start   |Number | 开始时间戳 |
| end   |Number | 结束时间戳 |
| dtype  | String | 数据类型，有opos/cpos/pos/nliqu/abliqu/liqu六种，分别代表开仓/关仓/开关仓/正常清算/异常清算/清算 |
| page   |Number | 页数，从0开始  |
| pagesize   |Number | 每页的数据大小  |
| account   |String | 账户地址，如果为空说明不限定地址  |
| network   |String | 网络名称，有Arbitrum / zkSync两个，目前只有Arbitrum  |
| account   |String | 账户地址，如果为空说明不限定地址  |
| ledger  | number | 债务池id |

### 返回值

**Data**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| data   | Object Of Item(Object) | 数据部分 |
| decimals  | Number | incre和cumul部分的精度，默认18 |
| count  | Number | 总体数据量多少 |

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| timestamp   | Number | 本条数据产生的时间戳 |
| address  | String | 钱包地址 |
| network  | String | 网络名称，有Arbitrum / zkSync两个，目前只有Arbitrum |
| debtpool  | String | 债务池名称 |
| ledger  | number | 债务池id |
| type  | String | 类型，包括open/close/nliqu/abliqu四种类型  |
| synths  | Array Of Synth(Object) | 合成资产 |
| size  | String | 资产规模 |
| tradingfee  | String | 交易费 |
| remain  | String | Only for Liqu |
| collateral  | String | Only for Liqu  |
| snapshot  | Object of Snapshot | Only for Liqu  |

**Synth**(Object)数据格式
| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| name   | String | token名称 |
| amount  | String | token数量 |
| price  | String | token价格 |

**Snapshot**(Object)数据格式
| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| tdebt   | String | 总债务 |
| adebt  | String | 活跃债务 |
| collateral  | String | 质押金额  |
| pnl  | String | 未实现盈亏  |
| pnlrate  | number |  未实现盈亏比例 |
| debtratio  | number | 债务比例  |


**返回样例**

```

## open position
{
    "data": {
      "data": {
        "timestamp":1693878062573,
        "address":"0x123",
        "network":"Arbitrum",
        "debtpool":"ETH-USD",
        "type":"open",
        "synths": [
          {
            "name": "jETH",
            "amount": "100000000000000",
            "price": "12000000000",
          }        
        ],
        "size":"100000000000000",
        "tradingfee":"100000000000000",
      },
      "decimals": 18
    }
    "code":200,
    "message":"ok"
}

## liquidation
{
    "data": {
      "data": {
        "timestamp":1693878062573,
        "address":"0x123",
        "network":"Arbitrum",
        "debtpool":"ETH-USD",
        "type":"nliqu",
        "synths": [
          {
            "name": "jETH",
            "amount": "100000000000000",
            "price": "12000000000",
          }        
        ],
        "size":"100000000000000",
        "tradingfee":"100000000000000",
        "remain":"100000000000000",
        "collateral":"100000000000000",
        "snapshot": {
          "tdebt": "12000000000",
          "adebt": "100000000000000",
          "collateral": "12000000000",
        },
      },
      "decimals": 18
    }
    "code":200,
    "message":"ok"
}
```

## 3. Download Tables

### URL

- http://ip:port/api/v1/graph/downloadtables

### 请求格式

POST方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**http请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| start   |Number | 开始时间戳 |
| end   |Number | 结束时间戳 |
| dtype  | String | 数据类型，有opos/cpos/pos/liqu四种，分别代表开仓/关仓/开关仓/清算 |
| account   |String | 账户地址，如果为空说明不限定地址  |
| network   |String | 网络名称，有Arbitrum / zkSync两个，目前只有Arbitrum  |
| debtpool  | String | 债务池名称 |

### 返回值

同**Tables**返回