// import { defineConfig, globalIgnores } from 'eslint/config'
// import globals from 'globals'
// import js from '@eslint/js'
// import pluginVue from 'eslint-plugin-vue'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// export default defineConfig([
//   {
//     name: 'app/files-to-lint',
//     files: ['**/*.{js,mjs,jsx,vue}'],
//   },

//   globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

//   {
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//       },
//     },
//   },


//   js.configs.recommended,
//   ...pluginVue.configs['flat/essential'],
//   skipFormatting,
// ])

import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  // 文件匹配规则
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  // 全局忽略配置
  ...globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**', 
    '**/coverage/**'
  ]),

  // 基础配置
  js.configs.recommended,

  // Vue 配置
  ...pluginVue.configs['flat/essential'],
  
  // 自定义规则配置
  {
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ],
      'vue/multi-word-component-names': [
        'warn',
        { ignores: ['index'] }
      ],
      'vue/no-setup-props-destructure': ['off'],
      'no-undef': 'error'
    }
  },

  // 全局环境配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // Prettier 格式化跳过配置
  skipFormatting
])