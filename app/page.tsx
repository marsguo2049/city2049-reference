"use client";

import { useEffect, useMemo, useState } from "react";

type Medium = "书" | "电影 / 剧集" | "游戏";
type Work = { id: string; title: string; original?: string; creator: string; year: string; medium: Medium; topics: string[]; color: string; question: string; note: string; project?: string };

const mediumGuide: Record<Medium, { action: string; lens: string }> = {
  "书": { action: "提取概念", lens: "趋势、制度与关键假设" },
  "电影 / 剧集": { action: "观察情景", lens: "角色、冲突与失败模式" },
  "游戏": { action: "体验决策", lens: "资源约束、反馈与取舍" },
};

const topics = [
  { id: "all", label: "全部未来", symbol: "✦" }, { id: "overview", label: "未来总览", symbol: "◉" },
  { id: "city", label: "城市与交通", symbol: "▥" }, { id: "ai", label: "AI 与人", symbol: "⌁" },
  { id: "robots", label: "机器人与自动化", symbol: "⚙" }, { id: "climate", label: "气候与韧性", symbol: "≈" },
  { id: "governance", label: "治理与监控", symbol: "◇" }, { id: "space", label: "太空与基础设施", symbol: "○" },
  { id: "everyday", label: "未来日常", symbol: "⌂" },
];

const works: Work[] = [
  { id: "2049", title: "2049：未来10000天的可能", creator: "凯文·凯利、吴晨", year: "2025", medium: "书", topics: ["overview", "ai", "city", "everyday"], color: "#ff5c35", question: "如果把未来 25 年摊开来看，哪些变化最值得先建立坐标？", note: "最适合作为入口。它把 AI、镜像世界、机器人、自动驾驶、航天与生命科学放进同一张近未来图景中。", project: "City2049 总览" },
  { id: "coming-wave", title: "浪潮将至", original: "The Coming Wave", creator: "穆斯塔法·苏莱曼、迈克尔·巴斯卡", year: "2023", medium: "书", topics: ["overview", "ai", "governance"], color: "#263238", question: "当 AI 与合成生物技术扩散，社会靠什么保持掌控？", note: "不是技术清单，而是一次关于能力扩散、国家治理与遏制困境的系统推演。", project: "不确定性演化" },
  { id: "klara", title: "克拉拉与太阳", original: "Klara and the Sun", creator: "石黑一雄", year: "2021", medium: "书", topics: ["ai", "robots", "everyday"], color: "#f0bd37", question: "机器理解爱以后，人类还凭什么定义‘真实’？", note: "从一位人工智能伙伴的目光出发，把算法伦理落到陪伴、替代与家庭选择之中。" },
  { id: "ministry", title: "未来事务部（暂译）", original: "The Ministry for the Future", creator: "金·斯坦利·罗宾逊", year: "2020", medium: "书", topics: ["climate", "governance", "overview"], color: "#1f7a62", question: "气候危机若要真正被治理，需要怎样的制度组合？", note: "把碳货币、国际机构、灾害与政治阻力编织成一场宏观但不轻松的制度实验。", project: "应急无人机集群" },
  { id: "walkable-city", title: "步行城市", original: "Walkable City", creator: "杰夫·斯佩克", year: "2012", medium: "书", topics: ["city", "everyday"], color: "#4f79c7", question: "一座城市怎样从‘能走’变成‘人愿意走’？", note: "未来城市不只由新技术构成。街道尺度、混合功能与步行体验，决定了技术服务的是谁。", project: "City2049 城市层" },
  { id: "three-body", title: "三体", creator: "刘慈欣", year: "2006", medium: "书", topics: ["space", "governance", "overview"], color: "#111827", question: "在时间尺度和生存压力突然放大后，人类如何协同？", note: "它提供的不是未来预测，而是关于技术跃迁、战略威慑与文明选择的巨大思想实验。", project: "轨道网络设计" },
  { id: "psalm", title: "献给荒野的赞美诗（暂译）", original: "A Psalm for the Wild-Built", creator: "贝琪·钱伯斯", year: "2021", medium: "书", topics: ["robots", "climate", "everyday"], color: "#b06a42", question: "如果机器离开了生产，人还需要用效率证明自己的价值吗？", note: "一幅温柔的太阳朋克未来：修复生态之后，机器人与人类重新讨论需求、工作和意义。" },
  { id: "circle", title: "圆环", original: "The Circle", creator: "戴夫·艾格斯", year: "2013", medium: "书", topics: ["governance", "ai", "everyday"], color: "#d64045", question: "当透明被包装成善意，私人生活还剩下什么？", note: "适合与技术乐观主义对读，提醒我们平台、便利与社会压力如何共同侵蚀边界。" },
  { id: "blade-runner", title: "银翼杀手 2049", original: "Blade Runner 2049", creator: "丹尼斯·维伦纽瓦", year: "2017", medium: "电影 / 剧集", topics: ["city", "ai", "robots", "climate"], color: "#d95f2d", question: "高度自动化、气候受损的城市，还能保留怎样的人性？", note: "用城市空间、人工生命与记忆制造出一幅极强的反面参照：未来很先进，但未必宜居。", project: "City2049 视觉参照" },
  { id: "her", title: "她", original: "Her", creator: "斯派克·琼斯", year: "2013", medium: "电影 / 剧集", topics: ["ai", "everyday", "city"], color: "#df553f", question: "当 AI 成为最懂你的人，亲密关系会被增强还是架空？", note: "一部非常安静的近未来电影。真正值得参考的是技术如何无缝进入城市、穿戴设备与情绪生活。" },
  { id: "black-mirror", title: "黑镜", original: "Black Mirror", creator: "查理·布鲁克", year: "2011—", medium: "电影 / 剧集", topics: ["ai", "governance", "everyday", "overview"], color: "#1c1c1c", question: "一个看似合理的产品，怎样一步步把社会推向荒谬？", note: "适合作为‘失败模式库’：每个单元都把一种技术激励机制推到极端。", project: "项目风险清单" },
  { id: "wall-e", title: "机器人总动员", original: "WALL·E", creator: "安德鲁·斯坦顿", year: "2008", medium: "电影 / 剧集", topics: ["robots", "climate", "everyday"], color: "#b99a58", question: "自动化替我们完成一切以后，人类会失去什么能力？", note: "把垃圾、消费、照护机器人与城市废墟放在一起，是理解‘便利的系统代价’最直观的作品之一。", project: "厨房机器人" },
  { id: "extrapolations", title: "外推", original: "Extrapolations", creator: "斯科特·Z·伯恩斯", year: "2023", medium: "电影 / 剧集", topics: ["climate", "city", "governance", "everyday"], color: "#356859", question: "气候变化不是末日瞬间，而会怎样改写每十年的日常？", note: "用跨年代的故事观察金融、迁移、健康与家庭，让抽象气候指标获得时间感。", project: "气候韧性场景" },
  { id: "forallmankind", title: "为全人类", original: "For All Mankind", creator: "罗纳德·D·摩尔等", year: "2019—", medium: "电影 / 剧集", topics: ["space", "governance", "robots"], color: "#255ca8", question: "如果太空竞赛从未停止，技术路线和国际秩序会怎样分叉？", note: "优秀的另类历史样本：它展示一个早期决策如何持续改变产业、人才与基础设施。", project: "轨道网络设计" },
  { id: "minority-report", title: "少数派报告", original: "Minority Report", creator: "史蒂文·斯皮尔伯格", year: "2002", medium: "电影 / 剧集", topics: ["governance", "ai", "city"], color: "#607d8b", question: "预测犯罪的系统，能否在事情发生前判定一个人有罪？", note: "它把预测准确性、程序正义、城市感知系统和个体自由放在同一个冲突里。" },
  { id: "creator", title: "AI 创世者", original: "The Creator", creator: "加里斯·爱德华斯", year: "2023", medium: "电影 / 剧集", topics: ["ai", "robots", "governance"], color: "#82735c", question: "当人工智能成为一个文明，安全叙事还能代表正义吗？", note: "适合观察人机冲突如何被地缘政治化，也提供了不同于冷硬赛博朋克的未来亚洲视觉。" },
  { id: "cities-skylines", title: "都市：天际线", original: "Cities: Skylines", creator: "Colossal Order", year: "2015", medium: "游戏", topics: ["city", "climate"], color: "#2c78bd", question: "道路、分区、公共服务与税收之间究竟怎样互相牵动？", note: "最直观的城市系统沙盘。它不等于真实规划，却很适合训练反馈回路与容量约束的直觉。", project: "City2049 城市层" },
  { id: "watch-dogs", title: "看门狗：军团", original: "Watch Dogs: Legion", creator: "Ubisoft Toronto", year: "2020", medium: "游戏", topics: ["city", "governance", "ai"], color: "#e65175", question: "传感器、无人机和自治交通构成的城市，会被谁控制？", note: "对 City2049 很关键的参照：同一套智能基础设施既可以服务城市，也可以成为监控与权力工具。", project: "City2049 世界观" },
  { id: "frostpunk", title: "冰汽时代", original: "Frostpunk", creator: "11 bit studios", year: "2018", medium: "游戏", topics: ["climate", "governance", "city"], color: "#4e6f82", question: "资源濒临枯竭时，效率、秩序和人性如何取舍？", note: "把能源调度与伦理选择绑在一起。每一项优化都可能提高生存率，也可能改变社会本身。", project: "应急资源调度" },
  { id: "detroit", title: "底特律：化身为人", original: "Detroit: Become Human", creator: "Quantic Dream", year: "2018", medium: "游戏", topics: ["robots", "ai", "governance", "everyday"], color: "#2d91c2", question: "如果机器人拥有感受，所有权与劳动关系是否必须重写？", note: "互动分支让玩家亲自承担选择后果，适合思考机器人进入家庭、服务业和公共安全之后的制度问题。", project: "异构智能体仿真" },
  { id: "surviving-mars", title: "火星求生", original: "Surviving Mars", creator: "Haemimont Games", year: "2018", medium: "游戏", topics: ["space", "robots", "city"], color: "#b54e35", question: "在封闭而遥远的环境里，哪些基础设施必须先建？", note: "把选址、供应链、冗余、维护与人口增长放在同一张图上，是轨道与基地网络设计的好参考。", project: "轨道网络设计" },
  { id: "terra-nil", title: "伊始之地", original: "Terra Nil", creator: "Free Lives", year: "2023", medium: "游戏", topics: ["climate", "city", "everyday"], color: "#5f8d4e", question: "建设的终点，是否可以是让人类设施从生态中退场？", note: "一款反向城市建造游戏：目标不是扩张，而是修复生态并回收自己留下的机器。", project: "城市更新与韧性" },
  { id: "papers-please", title: "请出示文件", original: "Papers, Please", creator: "Lucas Pope", year: "2013", medium: "游戏", topics: ["governance", "everyday"], color: "#7f1d1d", question: "当制度压力被变成一套操作流程，普通人如何参与其中？", note: "它让玩家感受规则、绩效、同情与生计的冲突，是研究‘指标如何塑造行为’的极简案例。" },
  { id: "cyberpunk", title: "赛博朋克 2077", original: "Cyberpunk 2077", creator: "CD PROJEKT RED", year: "2020", medium: "游戏", topics: ["city", "ai", "governance", "everyday"], color: "#d8bf23", question: "技术高度发达却由公司统治的城市，会如何分配机会与风险？", note: "夜之城是一份密度极高的反面城市样本：移动、医疗、身体改造与公共空间都被市场重新定义。", project: "City2049 反面参照" },
];

const projectBridges = [
  { name: "应急无人机集群", prompt: "极端事件中，空中与地面资源如何协同？", refs: "《未来事务部（暂译）》×《外推》×《冰汽时代》", mark: "01" },
  { name: "异构智能体仿真", prompt: "机器人进入真实环境后，算法会遇到什么？", refs: "《克拉拉与太阳》×《底特律：化身为人》", mark: "02" },
  { name: "电梯与厨房调度", prompt: "自动化如何真正服务人的日常，而非只追求效率？", refs: "《机器人总动员》×《献给荒野的赞美诗》", mark: "03" },
  { name: "轨道网络设计", prompt: "远距离基础设施怎样兼顾效率、冗余与生存？", refs: "《三体》×《为全人类》×《火星求生》", mark: "04" },
  { name: "City2049 城市层", prompt: "什么让一座未来城市既聪明，又值得生活？", refs: "《步行城市》×《她》×《都市：天际线》", mark: "05" },
  { name: "不确定性演化", prompt: "我们如何探索多个未来，而不是假装只会发生一个？", refs: "《浪潮将至》×《黑镜》×《为全人类》", mark: "06" },
  { name: "机场与城市交通调度", prompt: "容量、连接与自动化如何共同影响出行延误？", refs: "《步行城市》×《都市：天际线》×《看门狗：军团》", mark: "07" },
  { name: "算力基础设施选址", prompt: "算力、电力与城市空间如何协同扩张并应对饱和？", refs: "《浪潮将至》×《外推》×《未来事务部（暂译）》", mark: "08" },
];

function WorkCard({ work, onOpen }: { work: Work; onOpen: (work: Work) => void }) {
  const mediumClass = work.medium === "书" ? "is-read" : work.medium === "游戏" ? "is-play" : "is-watch";
  const topicSymbol = topics.find((item) => item.id === work.topics[0])?.symbol ?? "✦";
  return <button type="button" className="work-card" onClick={() => onOpen(work)} aria-label={`查看《${work.title}》`}>
    <span className="card-index">{String(works.indexOf(work) + 1).padStart(2, "0")}</span>
    <span className={`card-art ${mediumClass}`} style={{ "--card-color": work.color } as React.CSSProperties}><span className="art-orbit" /><span className="art-grid" /><span className="art-symbol">{topicSymbol}</span><span className="art-type">{work.medium === "书" ? "READ" : work.medium === "游戏" ? "PLAY" : "WATCH"}</span></span>
    <span className="card-meta"><span>{work.medium}</span><span>{work.year}</span></span><strong>{work.title}</strong>
    {work.original && <small>{work.original}</small>}<span className="card-question">{work.question}</span><span className="card-more">查看条目 <b>↗</b></span>
  </button>;
}

export default function Home() {
  const [topic, setTopic] = useState("all"); const [medium, setMedium] = useState<"全部" | Medium>("全部"); const [query, setQuery] = useState(""); const [selected, setSelected] = useState<Work | null>(null);
  const filtered = useMemo(() => works.filter((work) => (topic === "all" || work.topics.includes(topic)) && (medium === "全部" || work.medium === medium) && `${work.title} ${work.original ?? ""} ${work.creator} ${work.question} ${work.note}`.toLowerCase().includes(query.trim().toLowerCase())), [topic, medium, query]);
  const activeTopic = topics.find((item) => item.id === topic)?.label ?? "全部未来";
  const hasFilters = topic !== "all" || medium !== "全部" || query.trim() !== "";
  const resetFilters = () => { setTopic("all"); setMedium("全部"); setQuery(""); };
  const surpriseMe = () => { const pool = filtered.length ? filtered : works; setSelected(pool[Math.floor(Math.random() * pool.length)]); };
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [selected]);

  return <main>
    <header className="site-header"><a className="brand" href="#top" aria-label="City2049 未来参考首页"><span className="brand-dot" /><span>CITY2049</span><em>未来参考</em></a><nav aria-label="页面导航"><a href="#map">未来地图</a><a href="#bridges">项目索引</a><a href="#about">关于</a></nav></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">A CULTURAL MAP OF POSSIBLE FUTURES</p><h1>未来很远，<br /><i>从这里出发。</i></h1><p className="hero-lead">不是预测 2049 年会发生什么，而是借由书、电影、剧集与游戏，探索未来可能成为的许多种样子。</p><div className="hero-actions"><a className="primary-button" href="#map">开始探索 <span>↓</span></a><button type="button" className="text-button" onClick={surpriseMe}>随机探索 ↗</button></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="sun"><span>2049</span></div><div className="building b-one"><i /><i /><i /></div><div className="building b-two"><i /><i /><i /><i /></div><div className="building b-three"><i /><i /></div><div className="rail"><span /></div><div className="future-label l-one">READ / WATCH / PLAY</div><div className="future-label l-two">MULTIPLE FUTURES<br />ONE CITY</div></div><div className="hero-footnote"><span>Vol. 01</span><span>Curated for City2049</span><span>2026 → 2049</span></div></section>
    <section className="manifesto" id="about"><p className="section-kicker">为什么是“参考”</p><div><h2>未来不是一个答案，<br />而是一组值得追问的问题。</h2><p>当你担心 AI 会取代人、好奇城市会不会完全自动化，或想知道气候危机下如何生存，这里不会给出唯一答案。它会给你一组互相补充、甚至互相反驳的作品——让技术乐观、制度警惕与人的日常重新出现在同一张地图上。</p></div><aside><b>{works.length}</b><span>个参考条目</span><b>08</b><span>个未来命题</span></aside></section>
    <section className="map-section" id="map"><div className="section-heading"><div><p className="section-kicker">FUTURE MAP / 未来地图</p><h2>你今天想理解<br />哪一种未来？</h2></div><p>从一个命题进入，再跨过媒介的边界。每一张卡片都说明：它提出了什么问题，以及为什么值得成为 City2049 的参考。</p></div>
      <div className="topic-strip" aria-label="未来主题">{topics.map((item) => <button type="button" key={item.id} className={topic === item.id ? "active" : ""} onClick={() => setTopic(item.id)} aria-pressed={topic === item.id}><span>{item.symbol}</span>{item.label}</button>)}</div>
      <div className="filter-row"><div className="medium-filter" aria-label="媒介筛选">{(["全部", "书", "电影 / 剧集", "游戏"] as const).map((item) => <button type="button" key={item} className={medium === item ? "active" : ""} onClick={() => setMedium(item)} aria-pressed={medium === item}>{item}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索作品、作者或问题" aria-label="搜索作品" /></label><span className="result-count" aria-live="polite">{String(filtered.length).padStart(2, "0")} RESULTS</span></div>
      <div className="filter-status"><p><span>当前地图</span><b>{activeTopic}</b><i>·</i><b>{medium === "全部" ? "全部媒介" : medium}</b>{query.trim() && <><i>·</i><b>“{query.trim()}”</b></>}</p>{hasFilters && <button type="button" onClick={resetFilters}>重置筛选 ↺</button>}</div>
      <div className="work-grid">{filtered.map((work) => <WorkCard key={work.id} work={work} onOpen={setSelected} />)}</div>{!filtered.length && <div className="empty-state"><b>这一格暂时还是空白。</b><span>试试换一个主题，或直接重置全部筛选。</span><button type="button" onClick={resetFilters}>重置筛选</button></div>}
    </section>
    <section className="start-path"><div className="path-number">01</div><div><p className="section-kicker">第一次来，从这里开始</p><h2>一条 4 站的未来入门路径</h2></div><ol><li><span>建立坐标</span><b>《2049：未来10000天的可能》</b></li><li><span>看见城市</span><b>《她》或《银翼杀手 2049》</b></li><li><span>亲手决策</span><b>《都市：天际线》或《冰汽时代》</b></li><li><span>带回现实</span><b>选择一个 City2049 项目继续追问</b></li></ol></section>
    <section className="bridge-section" id="bridges"><div className="section-heading light"><div><p className="section-kicker">FROM STORY TO SYSTEM</p><h2>从故事，<br />回到你的项目。</h2></div><p>作品提供世界观、冲突与边界条件；OR 项目把这些想象变成可以调整参数、比较策略和验证结果的系统。</p></div>
      <div className="reference-method" aria-label="从文化作品到研究参考的方法"><article><span>01 / 想象</span><h3>发现问题</h3><p>从作品中记录场景、角色、冲突与失败模式。</p></article><article><span>02 / 建模</span><h3>形成假设</h3><p>把启发翻译为变量、目标、约束与情景参数。</p></article><article><span>03 / 验证</span><h3>回到证据</h3><p>再用论文、真实数据与实验验证；文化作品本身不是学术证据。</p></article></div>
      <div className="bridge-list">{projectBridges.map((bridge) => <article key={bridge.mark}><span>{bridge.mark}</span><h3>{bridge.name}</h3><p>{bridge.prompt}</p><small>{bridge.refs}</small></article>)}</div></section>
    <footer><div><span className="brand-dot" /> <b>CITY2049 · 未来参考</b></div><p>为尚未到来的城市，保存今天的想象。部分尚无简体中文版的作品采用暂译，并保留英文原名。</p><a href="#top">回到顶部 ↑</a></footer>
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><article className="prescription" role="dialog" aria-modal="true" aria-labelledby="prescription-title" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setSelected(null)} aria-label="关闭">×</button><div className="rx-mark">REFERENCE<span>未来条目</span></div><div className="rx-art" style={{ "--card-color": selected.color } as React.CSSProperties}><span>{selected.medium === "书" ? "READ" : selected.medium === "游戏" ? "PLAY" : "WATCH"}</span></div><div className="rx-meta"><span>{selected.medium}</span><span>{selected.year}</span><span>{selected.creator}</span></div><h2 id="prescription-title">{selected.title}</h2>{selected.original && <p className="rx-original">{selected.original}</p>}<div className="rx-question"><span>它在追问</span><strong>{selected.question}</strong></div><p className="rx-note">{selected.note}</p><div className="rx-use"><span>参考用法</span><b>{mediumGuide[selected.medium].action}</b><p>{mediumGuide[selected.medium].lens}</p></div>{selected.project && <div className="rx-project"><span>可连接项目</span><b>{selected.project}</b></div>}<div className="rx-tags">{selected.topics.map((id) => <span key={id}>{topics.find((item) => item.id === id)?.label ?? id}</span>)}</div></article></div>}
  </main>;
}
