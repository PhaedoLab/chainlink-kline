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
| lastid   |string | last id of last batch |
| old   |Number | 1 means getting old datas than lastid; 0 means getting new datas than lastid  |

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
        "trades":[
            {
                "account":"0x46e70392352eafadaa0a5d7fa337fb5e0ff558db",
                "ledger":"0",
                "currencyKey":"jETH",
                "timestamp":"1688375914",
                "amount":"11958605340188387",
                "type":"2"
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