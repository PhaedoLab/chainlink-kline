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