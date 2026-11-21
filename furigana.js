/* KitsuneChess ふりがな（停止中）
 * ふりがなモードはやめました。このファイルは何もしません（ボタンも出しません）。
 * 前に ON にしていた人の設定も消します。
 * 元に戻すときは、GitHub の履歴から前の furigana.js を戻してください。
 */
(function () {
  try { localStorage.removeItem('kcFurigana'); } catch (e) {}
})();
