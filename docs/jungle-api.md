# Jungle BackEnd
## Jungle Community

### URL

- http://ip:port/api/v1/base/community

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | **Item**(Object) | 请求数据 |
| message   | String             | 返回值说明                      |

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

## Jungle DEFI

### URL

- http://ip:port/api/v1/base/defi

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | **Item**(Object) | 请求数据 |
| message   | String             | 返回值说明                      |

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| usdc   |**ItemU**(Object) | 操作USDC的url |
| eth  | **ItemE**(Object) | 操作ETH的url |

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
| swap   |String | swap的url |
| buy  | String | buy的url |
| bridge  | String | bridge的url |

**Item**(Object)数据格式

| 参数名     | 必选 | 类型          | 说明                                               |
| ---------- | ---- | ----------- | -------------------------------------------------- |
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
## Jungle Total Locked

### URL
- http://ip:port/api/v1/graph/tlocked

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | Number | 请求数据 |
| message   | String             | 返回值说明                      |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## Jungle Trading Volume

### URL
- http://ip:port/api/v1/graph/tvolume

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | Number | 请求数据 |
| message   | String             | 返回值说明                      |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## Jungle 24h Trading Volume

### URL
- http://ip:port/api/v1/graph/volume24

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | Number | 请求数据 |
| message   | String             | 返回值说明                      |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## Jungle Total Trading Fee

### URL
- http://ip:port/api/v1/graph/ttradingfee

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | Number | 请求数据 |
| message   | String             | 返回值说明                      |

**返回样例**

```
{
    "data":680000000,
    "code":200,
    "message":"ok"
}
```

## Jungle Total Users

### URL
- http://ip:port/api/v1/graph/tusers

### 请求格式

GET方式，须带上http请求头

**http请求头**

| HTTP header  | 必选 | 说明             |
| ------------ | ---- | ---------------- |
| Content-Type | 是   | application/json |


### 返回值
**数据格式**
请求成功则返回json格式串，格式如下

| 参数名 | 类型               | 说明                        |
| ------ | ------------------ | --------------------------- |
| code   | Integer            | 0为成功，-1为失败               |
| data   | Number | 请求数据 |
| message   | String             | 返回值说明                      |

**返回样例**

```
{
    "data":886,
    "code":200,
    "message":"ok"
}
```