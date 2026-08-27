// KitsuneChess 盤面カラーテーマ(全ページ共通)
// match.html の設定パネルで選んだ色を、サイト内のどのページでも自動的に反映する。
(function () {
  var css = [
    ':root, [data-board-theme="brown"] { --sq-light:#d4b87a; --sq-dark:#7a5230; --board-light:#d4b87a; --board-dark:#7a5230; }',
    '[data-board-theme="green"] { --sq-light:#eeeed2; --sq-dark:#769656; --board-light:#eeeed2; --board-dark:#769656; }',
    '[data-board-theme="blue"] { --sq-light:#dee3e6; --sq-dark:#4b7399; --board-light:#dee3e6; --board-dark:#4b7399; }',
    '[data-board-theme="purple"] { --sq-light:#e8e0f0; --sq-dark:#7a5c99; --board-light:#e8e0f0; --board-dark:#7a5c99; }'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var theme = localStorage.getItem('boardTheme') || 'brown';
  document.documentElement.setAttribute('data-board-theme', theme);
})();
