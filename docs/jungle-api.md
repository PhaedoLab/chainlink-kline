# Basic Consensus
## 1. 返回数据格式
**返回数据最外层的格式如下：**

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Number            | 0为成功，-1为失败               |
| data   | **Item**(Object) | 请求数据 |
| message   | String             | 返回值说明                      |

接下来的api接口返回数据格式中都会自动忽略最外层的数据格式，只介绍data数据。

# Jungle BackEnd
## 1. Jungle Community

### URL

- http://ip:port/api/v1/base/community

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| discord   | String | Jungle discord的url |
| twitter  | String | Jungle twitter的url |
| telegram  | String | Jungle telegram的url |

**返回样例**

```
{
    "data":{
        "twitter":"https://twitter.com/Jungle_Fi",
        "discord":"https://discord.com/invite/QhePXWPwX5",
        "medium":"https://medium.com/@junglefi.io"
    },
    "code":200,
    "message":"ok"
}
```

## 2. Jungle DEFI

### URL

- http://ip:port/api/v1/base/defi

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| chain   | no | string | arb or zks, arb by default |

### 返回值
**Item**(Object)数据格式

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| usdc   |**ItemU**(Object) | 操作USDC的url |
| eth  | **ItemE**(Object) | 操作ETH的url |

**ItemU**(Object)数据格式

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| swap   |String | swap的url |
| buy  | String | buy的url |
| bridge  | String | bridge的url |

**ItemE**(Object)数据格式

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| buy  | String | buy的url |
| bridge  | String | bridge的url |

**返回样例**

```
{
    "data":{
        "usdc":{
            "swap":"https://uniswap.org",
            "buy":"https://uniswap.org",
            "bridge":"https://uniswap.org"
        },
        "eth":{
            "buy":"https://uniswap.org",
            "bridge":"https://uniswap.org"
        }
    },
    "code":200,
    "message":"ok"
}

```

# Jungle The Graph
## 1. Jungle Total Locked

### URL
- http://ip:port/api/v1/graph/tlocked

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | Total Locked |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## 2. Jungle Trading Volume

### URL
- http://ip:port/api/v1/graph/tvolume

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | Trading Volume |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## 3. Jungle 24h Trading Volume

### URL
- http://ip:port/api/v1/graph/volume24

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | 24h Total Locked |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## 4. Jungle Total Trading Fee

### URL
- http://ip:port/api/v1/graph/ttradingfee

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | Total Trading Fee |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## 5. Jungle Total Users

### URL
- http://ip:port/api/v1/graph/tusers

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | Total Users |

**返回样例**

```
{
    "data":886,
    "code":200,
    "message":"ok"
}
```


## 6. Jungle Ledger Trading Volume

### URL
- http://ip:port/api/v1/graph/lvol24

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger id |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | Trading Volume |

**返回样例**

```
{
    "data": {
        "value": 123
    }
    "code":200,
    "message":"ok"
}
```

## 7. Jungle Ledger 24h Trading Volume

### URL
- http://ip:port/api/v1/graph/lvols

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger id |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| value   |Number | 24H Trading Volume |

**返回样例**

```
{
    "data": {
        "value": 123
    },
    "code":200,
    "message":"ok"
}
```


## 8. Jungle Ledger Trading history

### URL
- http://ip:port/api/v1/graph/trades

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger id |
| num   |Number | lastest date number |
| offset   |Number | Used for Pagination  |
| account   |string | user wallet address  |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| account   |string | user account |
| ledger   |Number | ledger number |
| currencyKey   |string | JUSD, jETH |
| timestamp   |string | timestamp |
| amount   |Number | JUSD/jETH amount |
| type   |Number | short(1), long(2), close(3) |
| totalVal   |Number | total val of long/short/close (decimals of 10**18) |

**返回样例**

```
{
    "data":{
        "count":{
            "count":40,
            "timestamp":1689936278798
        },
        "result":[
            {
                "id":"0x8807c4ddeb892205d93e4f7d2ed119dfb133368c308b528333e47790befb71cd04000000",
                "account":"0xc6edc770fcaf2d80506a7ba96354d2dfadeb6d0f",
                "ledger":"0",
                "currencyKey":"TOTAL",
                "timestamp":"1689737555",
                "amount":"0",
                "totalVal":"29935928451728892360",
                "type":"3",
                "pnl":"-97448273314749157"
            }
        ]
    },
    "code":0,
    "message":"ok"
}
```


## 9. History K lines


### URL
- http://ip:port/api/v1/kline/candles

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| token   |string | token name, ETH/BTC/LINK |
| period   |string | time interval, (5m, 15m, 1h, 4h, 1d) |
| limit   |number | k lines number |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| period   |string | time interval |
| prices   |Array of Object | t: timestamp; o: open; c: close; h: high; l: low |
| updateAt   |string | update tiemstamp |

**返回样例**

```
example: 
http://127.0.0.1:3002api/v1/kline/candles?token=ETH&period=5m&limit=1

{
    "data":{
        "prices": [
            {
            "t": 1682566200,
            "o": 1903.01,
            "c": 1901.94,
            "h": 1904.285,
            "l": 1901.94
            }
        ],
        "period": "5m",
        "updatedAt": 1682566443
    }
    "code":0,
    "message":"ok"
}
```


## 10. Token lastest price


### URL
- http://ip:port/api/v1/kline/prices

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| token   |string | token name, ETH/BTC/LINK |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| token   |string | token name |
| price   |Number | token price, multi by 10**18 |
| updateAt   |string | update tiemstamp |

**返回样例**

```
{
    "data":{
        "token": "BTC",
        "price": "5446636125000000000000000000000",
        "updateAt": 1682561762
    },
    "code":0,
    "message":"ok"
}
```

## 11. Token 24h price
### URL
- http://ip:port/api/v1/kline/prices24

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| token   |string | token name, ETH/BTC/LINK |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| price24b   |number | price 24h before |
| price   |Number | token price, multi by 10**18 |
| h   |number | 24 hour high |
| l   |number | 24 hour low |

**返回样例**

```
{
    "data":{
        "price":"188285530869",
        "price24b":186308550000,
        "h":190475000000,
        "l":184801000000
    },
    "code":0,
    "message":"ok"
}
```

## 12. User Ledger Trading history

### URL
- http://ip:port/api/v1/graph/utrades

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger id |
| account   |string | user wallet address, in lower case  |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| account   |string | user account |
| ledger   |Number | ledger number |
| currencyKey   |string | JUSD, jETH |
| timestamp   |string | timestamp |
| size   |Number | Trade total volume |
| type   |Number | short(1), long(2), close(3) |
| pnl   |Number | trade pnl |
| fee   |Number | trade fee |

**返回样例**

```
{
    "data":{
        "count":2,
        "result":[
            {
                "timestamp":"1689737555",
                "ledger":"0",
                "type":"3",
                "assets":[
                    {
                        "currency_key":"jBTC",
                        "amount":"663160416862780",
                        "price":"30062000000000000000000"
                    },
                    {
                        "currency_key":"JUSD",
                        "amount":"10000000000000000000",
                        "price":"1000000000000000000"
                    }
                ],
                "price":"30062000000000000000000",
                "size":"29935928451728892360",
                "pnl":"-97448273314749157",
                "fee":"29935928451728892"
            },
            {
                "timestamp":"1688983900",
                "ledger":"0",
                "type":"2",
                "assets":[
                    {
                        "currency_key":"jBTC",
                        "amount":"331526519328435",
                        "price":"30163499500000000000000"
                    }
                ],
                "price":"30163499500000000000000",
                "size":"10009999999999989458",
                "pnl":"-10000000000000000",
                "fee":"10000000000000000"
            }
        ]
    },
    "code":0,
    "message":"ok"
}
```

## 13. User Liquidation

### URL
- http://ip:port/api/v1/graph/liquidation

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |

**请求参数**

| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger id |
| account   |string | user wallet address, in lower case  |

### 返回值
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| ledger   |Number | ledger number |
| collateral   |Number | User collateral |
| size   |Number | Trade total volume |
| trades   |Object | Each Synth of the Liquidation |
| snapshot   |Object | Snapshot of Liquidation |
| remain_value   |Number | trade pnl |
| fee   |Number | trade fee |


**Snapshot**
| 参数名     |  类型          | 说明                                               |
| ---------- |  ----------- | -------------------------------------------------- |
| debt   |Number | User Debt |
| total_debt   |Number | Total Debt |
| debt_ratio   |Number | Debt Ratio |
| pnl   |Number | P & L |
| pnlrate   |Number | p & L Ratio |


**返回样例**

```
{
    "data":{
        "count":{
            "count":1,
            "timestamp":1690118865450
        },
        "result":[
            {
                "timestamp":"1690096497",
                "ledger":"0",
                "normal":true,
                "collateral":"200000000000000000000",
                "size":"100000000000000000000",
                "trades":[
                    {
                        "currencyKey":"jBTC",
                        "keyPrice":"1000000000000000000",
                        "amount":"100000000000000000000",
                        "totalVal":"100000000000000000000",
                        "pnl":"-1",
                        "fee":"-1"
                    }
                ],
                "snapshot":{
                    "debt":"300000000000000000000",
                    "total_debt":"300000000000000000000",
                    "debt_ratio":1,
                    "pnl":"-200500000000000000000",
                    "pnlrate":-1.0025
                },
                "remain_value":"500000000000000000",
                "fee":"500000000000000000"
            }
        ]
    },
    "code":0,
    "message":"ok"
}
```

## 14. Mulit language

### URL
- http://ip:port/api/v1/base/multi_ling

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
返回的data值就是一个Map，包含了所有的key，value。但是是两层的，所有的key格式都是`module_function_xx_xx`，module是一层的key。

**返回样例**

```
{
    "data":{
        "Common":{
            "Common_Connect":"Connect Wallet",
            "Common_Swicth_NetWork":"Switch network to",
            "Common_AddTo_Wallet":"Add to Wallet"
        },
        "Navbar":{
            "Navbar_Menu_Dashboard":"Dashboard",
            "Navbar_Menu_Trade":"Trade"
        }
    },
    "code":0,
    "message":"ok"
}
```


## 15. Metrics

### URL
- http://ip:port/api/v1/base/metrics

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**返回样例**

```
{
    "data":{
        "trader":{
            "traders":9,
            "traders24":0
        },
        "coll":{
            "coll":"14564671165186229599889",
            "coll24":"0"
        },
        "tvl":{
            "tvl24":"0",
            "tvl":"205287000000000000000000"
        },
        "vol":{
            "vol24":"0",
            "vol":"24055758230149888626999"
        },
        "fee":{
            "fee24":"0",
            "fee":"24055758230149888598"
        }
    },
    "code":0,
    "message":"ok"
}
```



# Contract API
## 1. 债务池持仓
Belong to Story: 
- [Trade v1.0] Pool Assets, Position, Trades and Liquidation

目标数据：
- Collateral: 10,000.00 JUSD
- Synth: jETH
- Amount: 1.5000
- Synth Value: $3,000.00

接口：
- JungleWrapper::userAllSynthInfo(ledger, user) 获取Synth, Amount, Synth Value
- JUSD::ledgerStackedUSD(ledger, user) 获取当前ledger的collateral



## 2. 所有债务池信息
目标数据：
- ledgers: number[]
- ledgerNames: string[]
- collaterals: number[]
- multis: boolean[]
- activeDebt: number[][]，内层数组的长度是5，分别是：
    - sType: 0表示crypto；1表示股票；2表示外汇
    - startDayOfWeek: 交易起始Day 1-7
    - startHourOfDay: 交易起始Hour 0-23
    - endDayOfWeek: 交易结束Day 1-7
    - endHourOfDay: 交易结束Hour 0-23

接口：
- JungleWrapper::allLedgers()