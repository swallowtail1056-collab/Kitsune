/* KitsuneChess ふりがな
 * 「ふりがな」ボタンを押すと、画面の日本語の漢字に読みがなをつける。
 * 読みは furigana/<ページ名>.json（文ごと）と furigana/_words.json（言葉ごと）から。
 * 読みは CSS で表示するので、ページの文章（textContent）は変わらない。
 * ボタンを押すまで何も読み込まない（Google が読むページの文章もそのまま）。
 */
(function () {
  if (window.kcFuriganaLoaded) return;
  window.kcFuriganaLoaded = true;

  var KEY = 'kcFurigana';
  var KANJI = /[一-鿿㐀-䶿々〆ヶ]/;
  var RUN = /[々-〆぀-ヿ一-鿿㐀-䶿ー・０-９]+/g;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, OPTION: 1, SELECT: 1, TITLE: 1, INPUT: 1, RUBY: 1, RT: 1, RP: 1, CODE: 1, PRE: 1 };
  var base = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/furigana\.js.*$/, '') : '';
  })();
  var page = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '') || 'index';

  var on = false, phrases = null, byFirst = null, words = null, maxWord = 1, observer = null, loading = null, btn = null;

  function getPref() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function setPref(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }

  // ---- 見た目 ----
  var css = document.createElement('style');
  css.textContent =
    'ruby.kf{ruby-position:over;}' +
    'ruby.kf rt{font-size:0.5em;line-height:1;font-weight:normal;letter-spacing:0;user-select:none;-webkit-user-select:none;text-transform:none;}' +
    'ruby.kf rt::before{content:attr(data-r);}' +
    'ruby.kf.kf-o rt::before{display:inline-flex;width:0;justify-content:center;white-space:nowrap;}' +
    '.kc-furi-btn.kc-furi-on{outline:2px solid #e0a040;outline-offset:1px;}' +
    '.kc-furi-float{position:fixed;left:10px;bottom:10px;z-index:9998;padding:6px 12px;border-radius:999px;border:1px solid #7a4a1e;' +
    'background:#fdf6e8;color:#5a3a18;font-size:13px;font-family:inherit;box-shadow:0 2px 6px rgba(0,0,0,.15);cursor:pointer;}' +
    '.kc-furi-float.kc-furi-on{background:#7a4a1e;color:#fff;outline:none;}';
  document.head.appendChild(css);

  // ---- 読みのデータ ----
  function stripEnc(s) { return s.replace(/｜([^《]+)《[^》]*》/g, '$1'); }
  function load() {
    if (phrases) return Promise.resolve();
    if (loading) return loading;
    var get = function (u) { return fetch(base + u, { cache: 'force-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
    loading = Promise.all([get('furigana/' + encodeURIComponent(page) + '.json'), get('furigana/_words.json')]).then(function (res) {
      phrases = new Map(); byFirst = new Map();
      (res[0] || []).forEach(function (e) {
        var k = stripEnc(e); phrases.set(k, e);
        if (!byFirst.has(k[0])) byFirst.set(k[0], []);
        byFirst.get(k[0]).push(k);
      });
      byFirst.forEach(function (a) { a.sort(function (x, y) { return y.length - x.length; }); });
      words = res[1] || {};
      Object.keys(words).forEach(function (k) { if (k.length > maxWord) maxWord = k.length; });
    });
    return loading;
  }

  // 数字のあとの「日・人・分」などの読み
  var DAY = { 1: 'いちにち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか' };
  var CTR = { '回': 'かい', '勝': 'しょう', '敗': 'はい', '月': 'がつ', '年': 'ねん', '時': 'じ', '秒': 'びょう', '手': 'て', '局': 'きょく', '枚': 'まい', '位': 'い', '歳': 'さい', '週': 'しゅう', '件': 'けん', '点': 'てん', '個': 'こ', '問': 'もん', '冊': 'さつ', '字': 'じ', '号': 'ごう', '級': 'きゅう', '段': 'だん', '万': 'まん', '億': 'おく', '代': 'だい', '台': 'だい', '番': 'ばん' };
  function counter(ch, num, before) {
    var n = parseInt(num, 10);
    if (ch === '日') return DAY[n] ? { whole: DAY[n] } : 'にち';
    if (ch === '人') return n === 1 ? { whole: 'ひとり' } : n === 2 ? { whole: 'ふたり' } : 'にん';
    if (ch === '分') {
      if (/敗\s*$/.test(before)) return 'わけ';
      var last = n % 10;
      return (last === 1 || last === 3 || last === 4 || last === 6 || last === 8 || last === 0) ? 'ぷん' : 'ふん';
    }
    return CTR[ch] || null;
  }

  // 1つの日本語のかたまり → [[文字, 読み or null], ...]
  function segsOf(enc) {
    var out = [], re = /｜([^《]+)《([^》]*)》|([^｜]+)/g, m;
    while ((m = re.exec(enc))) out.push(m[3] ? [m[3], null] : [m[1], m[2]]);
    return out;
  }
  function fallback(run) {
    var out = [], i = 0, plain = '';
    while (i < run.length) {
      var hit = null;
      if (KANJI.test(run[i])) {
        for (var L = Math.min(maxWord, run.length - i); L >= 1; L--) {
          var w = run.substr(i, L);
          if (words[w]) { hit = w; break; }
        }
      }
      if (hit) {
        if (plain) { out.push([plain, null]); plain = ''; }
        out.push([hit, words[hit]]); i += hit.length;
      } else { plain += run[i]; i++; }
    }
    if (plain) out.push([plain, null]);
    return out;
  }
  function segsForRun(run, before) {
    var pre = []; segsForRun.back = 0;
    var dm = before.match(/([0-9０-９]+)\s*$/);
    if (dm) {
      var num = dm[1].replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); });
      var two = run.slice(0, 2), ch = run[0];
      if (two === '時間') { pre.push(['時間', 'じかん']); run = run.slice(2); }
      else {
        var r = counter(ch, num, before.slice(0, before.length - dm[0].length));
        if (r && r.whole && !/\s$/.test(dm[0])) { segsForRun.back = dm[1].length; pre.push([dm[1] + ch, r.whole]); run = run.slice(1); }
        else if (r && !r.whole) { pre.push([ch, r]); run = run.slice(1); }
      }
      if (!run) return pre;
    }
    var enc = phrases.get(run);
    return pre.concat(enc ? segsOf(enc) : cover(run));
  }
  // サイトの文（ページの中にある文の部品）をつなげた文だけにふりがなをつける。
  // ユーザーの名前など、サイトの文にない漢字にはつけない。
  function cover(run) {
    var out = [], i = 0, rest = '';
    var flush = function () {
      if (!rest) return;
      // 長い文はサイトの文と考えて、言葉ごとの読みでつける（名前は短いのでつけない）
      if (rest.length >= 8 && /[\u3040-\u309f]/.test(rest)) out = out.concat(fallback(rest));
      else out.push([rest, null]);
      rest = '';
    };
    while (i < run.length) {
      var list = byFirst.get(run[i]) || [], hit = null;
      for (var j = 0; j < list.length; j++) { if (run.startsWith(list[j], i)) { hit = list[j]; break; } }
      if (hit) { flush(); out = out.concat(segsOf(phrases.get(hit))); i += hit.length; }
      else { rest += run[i]; i++; }
    }
    flush();
    return out;
  }

  function makeRuby(b, r) {
    var ru = document.createElement('ruby');
    // 読みが少し長いだけなら、となりのかなにはみ出させて、漢字の間をあけない
    var over = r.length * 0.5 - b.length;
    ru.className = (over > 0 && over <= 1) ? 'kf kf-o' : 'kf';
    ru.appendChild(document.createTextNode(b));
    var rt = document.createElement('rt');
    rt.setAttribute('data-r', r);
    ru.appendChild(rt);
    return ru;
  }

  function skipNode(t) {
    var p = t.parentNode;
    if (!p || p.nodeType !== 1) return true;
    for (var e = p; e && e !== document.body; e = e.parentNode) {
      if (e.nodeType !== 1) continue;
      if (SKIP[e.tagName] || e.namespaceURI === 'http://www.w3.org/2000/svg' || e.isContentEditable || (e.classList && e.classList.contains('kc-no-furi'))) return true;
    }
    return false;
  }

  function doText(t) {
    var s = t.nodeValue;
    if (!s || !KANJI.test(s) || skipNode(t)) return;
    var frag = document.createDocumentFragment(), last = 0, changed = false, m;
    RUN.lastIndex = 0;
    while ((m = RUN.exec(s))) {
      if (!KANJI.test(m[0])) continue;
      var segs = segsForRun(m[0], s.slice(0, m.index)), st = m.index - segsForRun.back;
      if (!segs.some(function (x) { return x[1]; })) continue;
      if (st > last) frag.appendChild(document.createTextNode(s.slice(last, st)));
      segs.forEach(function (x) { frag.appendChild(x[1] ? makeRuby(x[0], x[1]) : document.createTextNode(x[0])); });
      last = m.index + m[0].length; changed = true;
    }
    if (!changed) return;
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode.replaceChild(frag, t);
  }
  function doTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName]) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = w.nextNode())) if (KANJI.test(n.nodeValue)) list.push(n);
    list.forEach(doText);
  }

  function watch() {
    if (observer) return;
    observer = new MutationObserver(function (recs) {
      observer.disconnect();
      try {
        recs.forEach(function (r) {
          if (r.type === 'characterData') doText(r.target);
          else r.addedNodes.forEach(function (n) { if (n.isConnected) doTree(n); });
        });
      } catch (e) {}
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function turnOn() {
    on = true; setPref(true); paintBtn();
    load().then(function () { if (!on) return; doTree(document.body); watch(); });
  }
  function turnOff() {
    on = false; setPref(false); paintBtn();
    if (observer) { observer.disconnect(); observer = null; }
    var parents = new Set();
    document.querySelectorAll('ruby.kf').forEach(function (ru) {
      var b = ru.firstChild ? ru.firstChild.nodeValue : '';
      parents.add(ru.parentNode);
      ru.parentNode.replaceChild(document.createTextNode(b), ru);
    });
    parents.forEach(function (p) { try { p.normalize(); } catch (e) {} });
  }

  function paintBtn() {
    if (!btn) return;
    btn.textContent = 'ふりがな' + (on ? ' ON' : '');
    btn.classList.toggle('kc-furi-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function addButton() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kc-furi-btn kc-no-furi';
    btn.title = 'Furigana（漢字の読みがな）';
    var anchor = document.getElementById('kcLangQuick') || document.getElementById('langToggle') || document.getElementById('langBtn');
    if (anchor && anchor.parentNode) {
      btn.className += ' ' + anchor.className;
      if (anchor.getAttribute('style')) btn.setAttribute('style', anchor.getAttribute('style'));
      btn.style.marginLeft = '6px';
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    } else {
      btn.className += ' kc-furi-float';
      document.body.appendChild(btn);
    }
    btn.addEventListener('click', function () { on ? turnOff() : turnOn(); });
    paintBtn();
  }

  function start() {
    addButton();
    if (getPref()) turnOn();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
