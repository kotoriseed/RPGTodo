# RPGTodo

一个将 TODO 任务管理与 RPG 游戏元素相结合的 Web 应用，让你的每日任务完成过程更有趣味和成就感！

## 功能特色

- **任务管理**: 创建、编辑、删除任务，支持子任务嵌套
- **任务属性**: 难度等级（简单/普通/困难/史诗/传说）、任务类型（每日/每周/自定义）、截止日期
- **RPG 风格界面**: 像素艺术风格的 UI 设计，任务以游戏任务面板形式展示
- **角色成长**: 完成任务获得经验值和金币，角色可以升级
- **Boss 战**: 每周根据完成任务数量挑战 Boss，回顾任务完成情况
- **本地存储**: 数据保存在浏览器本地，无需注册登录

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **数据存储**: LocalStorage

## 本地部署指南（适合新手）

### 第一步：安装 Node.js

本项目需要 Node.js 运行环境。

**Windows 系统：**

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS（长期支持版）安装包
3. 双击安装包，一路点击"下一步"完成安装
4. 安装完成后，打开"命令提示符"或"PowerShell"，输入以下命令验证安装：
   ```bash
   node -v
   npm -v
   ```
   如果显示版本号，说明安装成功

**Mac 系统：**

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本的 macOS 安装包
3. 双击安装包完成安装
4. 打开"终端"，输入 `node -v` 验证安装

### 第二步：下载项目代码

**方式一：使用 Git（推荐）**

1. 首先安装 Git：访问 [Git 官网](https://git-scm.com/downloads) 下载安装
2. 打开终端（Windows 用 PowerShell，Mac 用终端），执行：
   ```bash
   git clone https://github.com/kotoriseed/RPGTodo.git
   ```

**方式二：直接下载 ZIP**

1. 访问项目页面：https://github.com/kotoriseed/RPGTodo
2. 点击绿色的 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压下载的 ZIP 文件

### 第三步：安装项目依赖

1. 打开终端，进入项目目录：
   ```bash
   cd RPGTodo
   ```

2. 安装项目依赖（需要联网，耐心等待）：
   ```bash
   npm install
   ```

### 第四步：启动项目

安装完成后，运行以下命令启动开发服务器：

```bash
npm run dev
```

终端会显示类似以下内容：

```
  VITE v6.4.1  ready in 238 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 第五步：访问应用

打开浏览器（推荐 Chrome 或 Edge），在地址栏输入：

```
http://localhost:5173
```

即可看到 RPGTodo 应用界面！

---

## 常见问题

### Q: 运行 `npm install` 报错怎么办？

A: 可能是网络问题，可以尝试使用国内镜像源：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### Q: 端口被占用怎么办？

A: Vite 默认使用 5173 端口，如果被占用会自动使用下一个可用端口。你也可以手动指定端口：

```bash
npm run dev -- --port 3000
```

### Q: 如何停止运行的服务器？

A: 在终端按 `Ctrl + C` 即可停止。

### Q: 数据会丢失吗？

A: 数据保存在浏览器的 LocalStorage 中，只要不清除浏览器数据就不会丢失。但建议定期备份重要任务信息。

## 构建生产版本

如果需要部署到服务器，可以构建生产版本：

```bash
npm run build
```

构建完成后，静态文件会生成在 `dist` 目录，可以部署到任何静态文件服务器。

## 项目结构

```
RPGTodo/
├── src/
│   ├── components/     # Vue 组件
│   ├── views/          # 页面视图
│   ├── stores/         # 状态管理
│   ├── services/       # 业务服务
│   ├── types/          # TypeScript 类型定义
│   └── utils/          # 工具函数
├── public/             # 静态资源
├── index.html          # 入口 HTML
├── package.json        # 项目配置
└── vite.config.ts      # Vite 配置
```

## 开源协议

本项目采用 ISC 协议开源。

## 贡献

欢迎提交 Issue 和 Pull Request！
