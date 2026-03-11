# Requirements Document

## Introduction

RPGTodo 是一个将 TODO 事项与 RPG 游戏任务面板相结合的 Web 应用。通过游戏化的方式提升用户管理日常任务的效率和乐趣，让任务完成过程更具成就感。

## Glossary

- **任务 (Task)**: 用户创建的 TODO 事项，包含难度、描述、目标、奖励、截止日期等属性
- **子任务 (Subtask)**: 嵌套在父任务下的任务，用于分解复杂任务
- **任务难度 (Task Difficulty)**: 任务的难易程度，影响奖励数值
- **任务奖励 (Task Reward)**: 完成任务后角色获得的虚拟奖励（经验值、金币等）
- **角色 (Character)**: 用户在系统中的虚拟角色形象，通过完成任务成长
- **Boss战 (Boss Battle)**: 周期性结算活动，展示近期任务完成情况
- **每日任务 (Daily Task)**: 每天重置的任务
- **每周任务 (Weekly Task)**: 每周重置的任务
- **自定义任务 (Custom Task)**: 用户自定义截止时间的任务

## Requirements

### REQ-001: 任务管理

**User Story:** AS 用户, I want 创建和管理任务, so that 我可以规划我的日常待办事项

#### Acceptance Criteria

1. WHEN 用户点击"新建任务"按钮, 系统 SHALL 显示任务创建表单
2. WHEN 用户填写任务信息并提交, 系统 SHALL 创建新任务并显示在任务列表中
3. WHEN 用户点击任务, 系统 SHALL 显示任务详情页面
4. WHEN 用户修改任务信息并保存, 系统 SHALL 更新任务数据
5. WHEN 用户删除任务, 系统 SHALL 从列表中移除该任务及其所有子任务

### REQ-002: 任务属性

**User Story:** AS 用户, I want 为任务设置详细属性, so that 任务更具游戏化特色

#### Acceptance Criteria

1. WHEN 用户创建或编辑任务, 系统 SHALL 提供以下属性字段：任务难度、任务描述、任务目标、任务奖励、截止日期
2. WHEN 用户选择任务难度, 系统 SHALL 根据难度自动计算推荐奖励数值
3. WHEN 用户选择任务类型, 系统 SHALL 提供每日任务、每周任务、自定义任务三种选项
4. WHEN 用户设置任务为每日/每周任务, 系统 SHALL 在周期结束时自动重置任务状态

### REQ-003: 任务嵌套

**User Story:** AS 用户, I want 创建子任务, so that 我可以将复杂任务分解为可管理的小任务

#### Acceptance Criteria

1. WHEN 用户在任务详情页点击"添加子任务", 系统 SHALL 显示子任务创建表单
2. WHEN 用户创建子任务, 系统 SHALL 将子任务关联到父任务并在父任务下展示
3. WHILE 子任务未全部完成, 系统 SHALL 显示父任务为"进行中"状态
4. WHEN 所有子任务完成, 系统 SHALL 自动将父任务标记为"已完成"
5. WHEN 用户删除父任务, 系统 SHALL 同时删除所有关联的子任务

### REQ-004: RPG任务面板渲染

**User Story:** AS 用户, I want 任务以RPG游戏风格展示, so that 完成任务更有乐趣和沉浸感

#### Acceptance Criteria

1. WHEN 用户查看任务列表, 系统 SHALL 以RPG任务面板风格渲染任务卡片
2. WHEN 任务显示, 系统 SHALL 展示任务标题、难度星级、奖励预览、截止时间
3. WHEN 用户完成任务, 系统 SHALL 播放完成动画并显示获得的奖励
4. WHILE 任务即将到期, 系统 SHALL 以醒目样式提醒用户

### REQ-005: 角色系统

**User Story:** AS 用户, I want 拥有一个可成长的角色, so that 我的任务完成能够转化为可见的成就感

#### Acceptance Criteria

1. WHEN 用户首次使用系统, 系统 SHALL 为用户创建初始角色
2. WHEN 用户完成任务, 系统 SHALL 为角色增加对应经验值和金币
3. WHEN 角色经验值达到升级阈值, 系统 SHALL 提升角色等级并展示升级特效
4. WHEN 用户查看角色面板, 系统 SHALL 显示角色等级、经验值、金币数量
5. WHEN 用户积累足够金币, 系统 SHALL 允许用户购买虚拟装备或道具

### REQ-006: Boss战结算

**User Story:** AS 用户, I want 通过Boss战查看我的任务完成情况, so that 我可以回顾和激励自己的表现

#### Acceptance Criteria

1. WHEN 到达结算周期, 系统 SHALL 触发Boss战事件
2. WHILE Boss战进行中, 系统 SHALL 根据用户近期任务完成情况计算对Boss的伤害
3. WHEN Boss战结束, 系统 SHALL 展示战斗结果和统计数据（完成任务数、获得奖励等）
4. IF 用户任务完成率低于50%, 系统 SHALL 在结果中显示鼓励性提示

### REQ-007: 数据持久化

**User Story:** AS 用户, I want 我的任务数据被安全保存, so that 我可以在不同设备上访问我的任务

#### Acceptance Criteria

1. WHEN 用户创建或修改数据, 系统 SHALL 将数据保存到持久化存储
2. WHEN 用户登录系统, 系统 SHALL 加载用户的所有任务和角色数据
3. IF 数据保存失败, 系统 SHALL 显示错误提示并允许用户重试

### REQ-008: 用户认证

**User Story:** AS 用户, I want 安全地登录系统, so that 我的个人数据受到保护

#### Acceptance Criteria

1. WHEN 新用户注册, 系统 SHALL 创建用户账户并初始化角色数据
2. WHEN 用户登录, 系统 SHALL 验证凭证并建立会话
3. IF 用户输入错误密码超过3次, 系统 SHALL 暂时锁定账户30分钟
4. WHEN 用户登出, 系统 SHALL 清除会话并跳转到登录页面
