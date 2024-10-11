import plugin from 'tailwindcss/plugin'

export default plugin(function({ addBase, theme }) {
  addBase({
    'body': { fontFamily: 'NoirdenSans, sans-serif' },
  })
}, {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['NoirdenSans', 'sans-serif'],
        'noirden': ['NoirdenSans', 'sans-serif'],
      },
    },
  },
})