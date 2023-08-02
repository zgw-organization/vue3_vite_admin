# 使用nvm管理node版本 具体操作查看nvm --help
# npm init vite@latest  使用vite构建项目 (vue, react等)
# npm init vue@latest  使用vue脚手架构建项目

# sass
npm i sass

# pinia持久化插件
# npm i  pinia-plugin-persistedstate

# Animate.css                    css动画库
# GSAP                           js动画库

# EventBus(vue2中的$on $once $off在vue3中无法使用,使用mitt代替)
# npm i mitt -S   
# getCurrentInstance() 获取当前组件实例（代替vue2中的this） proxy.$bus

# 自动引入插件
# npm i unplugin-auto-import -D

# import.meta.env  代码中使用环境变量  vite中访问环境变量需要用到loadEnv

# 高性能优化件哔哩哔哩小满zs

# 分析代码打包体积插件
# npm i rollup-plugin-visualizer      visualizer({open: true})

# 离线缓存 PWA  
# npm i vite-plugin-pwa

# 图片懒加载 vue3-lazy

# vueUse 集成了webworker




# 生成.husky的文件夹 
npx husky install 

# 添加 hooks，会在 .husky 目录下生成一个 pre-commit 脚本文件
npx husky add .husky/pre-commit "npx --no-install lint-staged"

# 添加 commit-msg
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

# git commit 格式  git commit -m 'feat: 增加 xxx 功能'
feat新功能
fix修复 
bugstyle样式修改（UI校验）
docs文档更新
refactor重构代码(既没有新增功能，也没有修复 bug)
perf优化相关，比如提升性能、体验
test增加测试，包括单元测试、集成测试等
build构建系统或外部依赖项的更改
ci自动化流程配置或脚本修改
revert回退某个commit提交
