module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true, // 추가: loose 옵션을 true로 설정
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true, // 추가: loose 옵션을 true로 설정
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true, // 추가: loose 옵션을 true로 설정
      },
    ],
  ],
};