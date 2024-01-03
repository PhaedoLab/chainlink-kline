[Liquidity v1.0] Pool List提测不晚于 10月11日
[Liquidity v1.0] Pool Detail - My Share提测不晚于 10月13日提测
[Liquidity v1.0] Pool Detail - Pool Info & Performance 不晚于 10月15
[Liquidity v1.0] Pool Detail - Tables 不晚于 10月16




## [Liquidity v1.0] Pool List
- pool_name :contract
- apr :calcu :g 依赖collateral, 当前的size
- tvl :g 依赖于mint、burn的JUSD
- maxdrawdown :contract 读取JLP的价格
- uptime :g


[Liquidity v1.0] Pool Detail - Pool Info & Performance
### metrics
- pool_name :contract
- market :contract
- equity :g
- holder :g
- LP :contract
- uptime :g
- LP Token :contract


### plot
- tvl :g
- apr :g
- maxdrawdown :contract


## [Liquidity v1.0] Pool Detail - Tables
- history :g
- position :real-contract
- trades :g

## [Liquidity v1.0] Pool Detail - My Share
- myshare :real-contract