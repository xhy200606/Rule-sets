async function operator(proxies) {
  return proxies.map(p => {
    // 在原有的节点名称前面拼接前缀
    p.name = "顶级-" + p.name;
    return p;
  });
}
