async function operator(proxies) {
  return proxies.map(p => {
    // 1. 去掉原名称中所有的 Emoji 图标和多余空格
    // 这里的正则涵盖了国旗图标、表情符号等常见 Unicode 范围
    const pureName = p.name
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
      .trim();

    // 2. 统一加上“赔钱-”前缀
    p.name = "赔钱-" + pureName;

    return p;
  });
}
