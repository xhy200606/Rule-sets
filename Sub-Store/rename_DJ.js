async function operator(proxies) {
  return proxies.map(p => {
    // 1. 匹配节点名称中的 Emoji (通常机场图标都在开头)
    const emojiRegex = /[\u{1F1E6}-\u{1F1FF}{2}|\u{1F300}-\u{1F9FF}]/u;
    const match = p.name.match(emojiRegex);
    
    let emoji = "";
    let pureName = p.name;

    if (match) {
      emoji = match[0]; // 提取到的图标
      pureName = p.name.replace(emoji, "").trim(); // 去掉图标后的纯名字
    }

    // 2. 重新组合：图标 + 顶级- + 剩余名字
    p.name = `${emoji}顶级-${pureName}`;
    
    return p;
  });
}
