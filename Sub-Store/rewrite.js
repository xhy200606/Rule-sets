/**
 * Sub-Store 组合订阅脚本 - 完整全量版
 * 作用：生成包含完整策略组、规则集和 Rule Providers 的 Clash 配置文件
 */

function produce(proxies) {
  const config = {
    "proxy-groups": [
      // 1. 业务分流组 (使用 anchor 引用 default 策略)
      { name: "AI", type: "select", proxies: ["所有-手动", "所有-自动", "美国-故转", "东亚-故转", "直连", "拒绝"] },
      { name: "Claude", type: "select", proxies: ["AI", "所有-手动", "美国-故转", "拒绝"] },
      { name: "GitHub", type: "select", proxies: ["所有-手动", "所有-自动", "国外", "直连"] },
      { name: "Telegram", type: "select", proxies: ["所有-手动", "所有-自动", "国外"] },
      { name: "Media", type: "select", proxies: ["所有-手动", "所有-自动", "国外"] },
      { name: "Video", type: "select", proxies: ["所有-手动", "所有-自动", "香港-故转", "美国-故转"] },
      { name: "Streaming", type: "select", proxies: ["Video", "所有-手动"] },
      { name: "Amazon", type: "select", proxies: ["所有-手动", "所有-自动", "美国-故转", "直连"] },
      { name: "Scholar", type: "select", proxies: ["所有-手动", "所有-自动", "直连"] },
      { name: "Crunchyroll", type: "select", proxies: ["所有-手动", "所有-自动", "美国-故转"] },
      { name: "Nvidia", type: "select", proxies: ["所有-手动", "所有-自动", "美国-故转", "直连"] },
      { name: "Steam", type: "select", proxies: ["所有-手动", "所有-自动", "直连"] },
      { name: "Games", type: "select", proxies: ["所有-手动", "所有-自动", "直连"] },
      { name: "Crypto", type: "select", proxies: ["所有-手动", "所有-自动", "国外"] },
      { name: "Apple", type: "select", proxies: ["直连", "所有-手动", "所有-自动"] },
      { name: "Google", type: "select", proxies: ["所有-手动", "所有-自动", "国外"] },
      { name: "Microsoft", type: "select", proxies: ["直连", "所有-手动", "所有-自动"] },
      { name: "Custom", type: "select", proxies: ["所有-手动", "所有-自动", "国外"] },
      { name: "Block", type: "select", proxies: ["拒绝", "直连"] },
      { name: "国外", type: "select", proxies: ["所有-手动", "所有-自动", "香港-故转", "美国-故转"] },
      { name: "国内", type: "select", proxies: ["直连", "所有-手动"] },
      { name: "其他", type: "select", proxies: ["所有-手动", "所有-自动", "国外", "直连"] },

      // 2. 核心过滤器组 (include-all 确保所有节点进入)
      { name: "所有-手动", type: "select", "include-all": true, filter: "^((?!(直连|拒绝)).)*$" },
      { name: "所有-自动", type: "url-test", "include-all": true, tolerance: 50, interval: 300, filter: "^((?!(直连|拒绝)).)*$" },

      // 3. 地区故转/手动/自动组
      { name: "东亚-故转", type: "fallback", interval: 300, proxies: ["东亚-手动", "东亚-自动"] },
      { name: "东亚-手动", type: "select", "include-all": true, filter: "(?i)香港|HK|台湾|TW|韩国|KR|日本|JP" },
      { name: "东亚-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)香港|HK|台湾|TW|韩国|KR|日本|JP" },

      { name: "香港-故转", type: "fallback", interval: 300, proxies: ["香港-手动", "香港-自动"] },
      { name: "香港-手动", type: "select", "include-all": true, filter: "(?i)香港|HK|HongKong" },
      { name: "香港-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)香港|HK|HongKong" },

      { name: "台湾-故转", type: "fallback", interval: 300, proxies: ["台湾-手动", "台湾-自动"] },
      { name: "台湾-手动", type: "select", "include-all": true, filter: "(?i)台湾|TW|Taiwan" },
      { name: "台湾-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)台湾|TW|Taiwan" },

      { name: "日本-故转", type: "fallback", interval: 300, proxies: ["日本-手动", "日本-自动"] },
      { name: "日本-手动", type: "select", "include-all": true, filter: "(?i)日本|JP|Japan|东京|大阪" },
      { name: "日本-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)日本|JP|Japan|东京|大阪" },

      { name: "新加坡-故转", type: "fallback", interval: 300, proxies: ["新加坡-手动", "新加坡-自动"] },
      { name: "新加坡-手动", type: "select", "include-all": true, filter: "(?i)新加坡|SG|Singapore|坡" },
      { name: "新加坡-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)新加坡|SG|Singapore|坡" },

      { name: "美国-故转", type: "fallback", interval: 300, proxies: ["美国-手动", "美国-自动"] },
      { name: "美国-手动", type: "select", "include-all": true, filter: "(?i)美国|US|United States|洛杉矶|纽约" },
      { name: "美国-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)美国|US|United States|洛杉矶|纽约" },

      { name: "英国-故转", type: "fallback", interval: 300, proxies: ["英国-手动", "英国-自动"] },
      { name: "英国-手动", type: "select", "include-all": true, filter: "(?i)英国|UK|London|伦敦" },
      { name: "英国-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "(?i)英国|UK|London|伦敦" },

      { name: "其他-故转", type: "fallback", interval: 300, proxies: ["其他-手动", "其他-自动"] },
      { name: "其他-手动", type: "select", "include-all": true, filter: "^((?!(直连|拒绝|香港|HK|台湾|TW|日本|JP|新加坡|SG|韩国|KR|美国|US|英国|UK)).)*$" },
      { name: "其他-自动", type: "url-test", "include-all": true, tolerance: 50, filter: "^((?!(直连|拒绝|香港|HK|台湾|TW|日本|JP|新加坡|SG|韩国|KR|美国|US|英国|UK)).)*$" },

      { name: "直连", type: "select", proxies: ["DIRECT"] },
      { name: "拒绝", type: "select", proxies: ["REJECT"] }
    ],

    // 4. 规则引擎
    "rules": [
      "RULE-SET,Block / Domain,Block",
      "RULE-SET,ChatGPT / Domain,AI",
      "RULE-SET,Claude / Domain,Claude",
      "RULE-SET,Meta AI / Domain,AI",
      "RULE-SET,Perplexity / Domain,AI",
      "RULE-SET,Copilot / Domain,AI",
      "RULE-SET,Gemini / Domain,AI",
      "RULE-SET,Groq / Domain,AI",
      "RULE-SET,Grok / Domain,AI",
      "RULE-SET,GitHub / Domain,GitHub",
      "RULE-SET,Telegram / Domain,Telegram",
      "RULE-SET,Telegram / IP,Telegram",
      "RULE-SET,WhatsApp / Domain,Media",
      "RULE-SET,Facebook / Domain,Media",
      "RULE-SET,Reddit / Domain,Media",
      "RULE-SET,Twitter / Domain,Media",
      "RULE-SET,Apple / Domain,Apple",
      "RULE-SET,Microsoft / Domain,Microsoft",
      "RULE-SET,OKX / Domain,Crypto",
      "RULE-SET,Bybit / Domain,Crypto",
      "RULE-SET,Binance / Domain,Crypto",
      "RULE-SET,Youtube / Domain,Video",
      "RULE-SET,TikTok / Domain,Video",
      "RULE-SET,Netflix / Domain,Streaming",
      "RULE-SET,Disney / Domain,Streaming",
      "RULE-SET,Spotify / Domain,Streaming",
      "RULE-SET,Amazon / Domain,Amazon",
      "RULE-SET,Steam / Domain,Steam",
      "RULE-SET,Google / Domain,Google",
      "RULE-SET,Nvidia / Domain,Nvidia",
      "RULE-SET,Scholarncn / Domain,Scholar",
      "RULE-SET,Custom / Domain,Custom",
      "RULE-SET,Proxy / Domain,国外",
      "RULE-SET,Direct / Domain,国内",
      "RULE-SET,China / Domain,国内",
      "RULE-SET,China / IP,国内,no-resolve",
      "MATCH,其他"
    ],

    // 5. 规则提供者
    "rule-providers": {
      "ChatGPT / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/openai.mrs" },
      "Claude / Domain": { type: "http", behavior: "classical", format: "text", interval: 86400, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Claude/Claude.list" },
      "GitHub / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/github.mrs" },
      "Telegram / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/telegram.mrs" },
      "Telegram / IP": { type: "http", behavior: "ipcidr", format: "text", interval: 86400, url: "https://gh-proxy.com/github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geoip/telegram.list" },
      "Youtube / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/youtube.mrs" },
      "China / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/cn.mrs" },
      "China / IP": { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geoip/cn.mrs" },
      "Microsoft / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/microsoft.mrs" },
      "Google / Domain": { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/google.mrs" },
      "Block / Domain": { type: "http", behavior: "classical", format: "text", interval: 86400, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Block.list" },
      "Custom / Domain": { type: "http", behavior: "classical", format: "text", interval: 86400, url: "https://gh-proxy.com/raw.githubusercontent.com/xhy200606/Rule-sets/refs/heads/main/list/custom.list" }
      // 更多 Rule-providers 可按此格式自行添加
    }
  };

  return {
    ...config,
    proxies: proxies
  };
}
