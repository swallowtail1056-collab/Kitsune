// KitsuneChess 盤面の図（記事・コラム用、全ページ共通）
// <div class="kc-diagram" data-spec='{"p":"盤面","f":1,"l":["e2","e4"],"h":[["d5","#e8c84a",0.5]],"a":[["c4","f7","#c0392b"]]}'></div>
//   p: 盤面（FEN の駒の配置部分）  f: 1 なら黒番側から見た向き  l: 直前の手のマス
//   h: 色を付けるマス [マス, 色, 濃さ]  a: 矢印 [元のマス, 行き先, 色]
// 盤の色は board-theme.js の設定（対局ページで選んだ色）に合わせて変わる。
(function () {
  const PIECE_IMG = {
    wP: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMjIuNSA5Yy0yLjIxIDAtNCAxLjc5LTQgNCAwIC44OS4yOSAxLjcxLjc4IDIuMzhDMTcuMzMgMTYuNSAxNiAxOC41OSAxNiAyMWMwIDIuMDMuOTQgMy44NCAyLjQxIDUuMDMtMyAxLjA2LTcuNDEgNS41NS03LjQxIDEzLjQ3aDIzYzAtNy45Mi00LjQxLTEyLjQxLTcuNDEtMTMuNDcgMS40Ny0xLjE5IDIuNDEtMyAyLjQxLTUuMDMgMC0yLjQxLTEuMzMtNC41LTMuMjgtNS42Mi40OS0uNjcuNzgtMS40OS43OC0yLjM4IDAtMi4yMS0xLjc5LTQtNC00eiIvPjwvc3ZnPg==",
    wN: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDBtNS40MzMtOS43NWEuNSAxLjUgMzAgMSAxLS44NjYtLjUuNSAxLjUgMzAgMSAxIC44NjYuNSIvPjwvZz48L3N2Zz4=",
    wB: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzUuNDktMi4zMi40Ny0zLS41IDEuMzUtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1Ii8+PC9nPjwvc3ZnPg==",
    wR: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJidXR0IiBkPSJNOSAzOWgyN3YtM0g5em0zLTN2LTRoMjF2NHptLTEtMjJWOWg0djJoNVY5aDV2Mmg1VjloNHY1Ii8+PHBhdGggZD0ibTM0IDE0LTMgM0gxNGwtMy0zIi8+PHBhdGggc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0zMSAxN3YxMi41SDE0VjE3Ii8+PHBhdGggZD0ibTMxIDI5LjUgMS41IDIuNWgtMjBsMS41LTIuNSIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0xMSAxNGgyMyIvPjwvZz48L3N2Zz4=",
    wQ: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIGQ9Ik04IDEyYTIgMiAwIDEgMS00IDAgMiAyIDAgMSAxIDQgMG0xNi41LTQuNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDBNNDEgMTJhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwTTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDBNMzMgOWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDAiLz48cGF0aCBzdHJva2UtbGluZWNhcD0iYnV0dCIgZD0iTTkgMjZjOC41LTEuNSAyMS0xLjUgMjcgMGwyLTEyLTcgMTFWMTFsLTUuNSAxMy41LTMtMTUtMyAxNS01LjUtMTRWMjVMNyAxNHoiLz48cGF0aCBzdHJva2UtbGluZWNhcD0iYnV0dCIgZD0iTTkgMjZjMCAyIDEuNSAyIDIuNSA0IDEgMS41IDEgMSAuNSAzLjUtMS41IDEtMS41IDIuNS0xLjUgMi41LTEuNSAxLjUuNSAyLjUuNSAyLjUgNi41IDEgMTYuNSAxIDIzIDAgMCAwIDEuNS0xIDAtMi41IDAgMCAuNS0xLjUtMS0yLjUtLjUtMi41LS41LTIgLjUtMy41IDEtMiAyLjUtMiAyLjUtNC04LjUtMS41LTE4LjUtMS41LTI3IDB6Ii8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTExLjUgMzBjMy41LTEgMTguNS0xIDIyIDBNMTIgMzMuNWM2LTEgMTUtMSAyMSAwIi8+PC9nPjwvc3ZnPg==",
    wK: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1Ii8+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0yMi41IDI1czQuNS03LjUgMy0xMC41YzAgMC0xLTIuNS0zLTIuNXMtMyAyLjUtMyAyLjVjLTEuNSAzIDMgMTAuNSAzIDEwLjUiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTB6Ii8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg==",
    bP: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMjIuNSA5YTQgNCAwIDAgMC0zLjIyIDYuMzggNi40OCA2LjQ4IDAgMCAwLS44NyAxMC42NWMtMyAxLjA2LTcuNDEgNS41NS03LjQxIDEzLjQ3aDIzYzAtNy45Mi00LjQxLTEyLjQxLTcuNDEtMTMuNDdhNi40NiA2LjQ2IDAgMCAwLS44Ny0xMC42NUE0LjAxIDQuMDEgMCAwIDAgMjIuNSA5eiIvPjwvc3ZnPg==",
    bN: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQtLjk0IDEuNDEtMy4wNCAwLTMtMSAwIC4xOSAxLjIzLTEgMi0xIDAtNCAxLTQtNCAwLTIgNi0xMiA2LTEyczEuODktMS45IDItMy41Yy0uNzMtMS0uNS0yLS41LTMgMS0xIDMgMi41IDMgMi41aDJzLjc4LTIgMi41LTNjMSAwIDEgMyAxIDMiLz48cGF0aCBmaWxsPSIjZWNlY2VjIiBzdHJva2U9IiNlY2VjZWMiIGQ9Ik05LjUgMjUuNWEuNS41IDAgMSAxLTEgMCAuNS41IDAgMSAxIDEgMG01LjQzLTkuNzVhLjUgMS41IDMwIDEgMS0uODYtLjUuNSAxLjUgMzAgMSAxIC44Ni41Ii8+PHBhdGggZmlsbD0iI2VjZWNlYyIgc3Ryb2tlPSJub25lIiBkPSJtMjQuNTUgMTAuNC0uNDUgMS40NS41LjE1YzMuMTUgMSA1LjY1IDIuNDkgNy45IDYuNzVTMzUuNzUgMjkuMDYgMzUuMjUgMzlsLS4wNS41aDIuMjVsLjA1LS41Yy41LTEwLjA2LS44OC0xNi44NS0zLjI1LTIxLjM0cy01Ljc5LTYuNjQtOS4xOS03LjE2eiIvPjwvZz48L3N2Zz4=",
    bB: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxnIGZpbGw9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjQtMSAxMC4xLjQgMTMuNS0yIDMuNCAyLjQgMTAuMSAxIDEzLjUgMiAwIDAgMS42LjUgMyAyLS43IDEtMS42IDEtMyAuNS0zLjQtMS0xMC4xLjUtMTMuNS0xLTMuNCAxLjUtMTAuMSAwLTEzLjUgMS0xLjQuNS0yLjMuNS0zLS41IDEuNC0yIDMtMiAzLTJ6Ii8+PHBhdGggZD0iTTE1IDMyYzIuNSAyLjUgMTIuNSAyLjUgMTUgMCAuNS0xLjUgMC0yIDAtMiAwLTIuNS0yLjUtNC0yLjUtNCA1LjUtMS41IDYtMTEuNS01LTE1LjUtMTEgNC0xMC41IDE0LTUgMTUuNSAwIDAtMi41IDEuNS0yLjUgNCAwIDAtLjUuNSAwIDJ6Ii8+PHBhdGggZD0iTTI1IDhhMi41IDIuNSAwIDEgMS01IDAgMi41IDIuNSAwIDEgMSA1IDB6Ii8+PC9nPjxwYXRoIHN0cm9rZT0iI2VjZWNlYyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZD0iTTE3LjUgMjZoMTBNMTUgMzBoMTVtLTcuNS0xNC41djVNMjAgMThoNSIvPjwvZz48L3N2Zz4=",
    bR: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJidXR0IiBkPSJNOSAzOWgyN3YtM0g5em0zLjUtNyAxLjUtMi41aDE3bDEuNSAyLjV6bS0uNSA0di00aDIxdjR6Ii8+PHBhdGggc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0xNCAyOS41di0xM2gxN3YxM3oiLz48cGF0aCBzdHJva2UtbGluZWNhcD0iYnV0dCIgZD0iTTE0IDE2LjUgMTEgMTRoMjNsLTMgMi41ek0xMSAxNFY5aDR2Mmg1VjloNXYyaDVWOWg0djV6Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWNlY2VjIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xMiAzNS41aDIxbS0yMC00aDE5bS0xOC0yaDE3bS0xNy0xM2gxN00xMSAxNGgyMyIvPjwvZz48L3N2Zz4=",
    bQ: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxnIHN0cm9rZT0ibm9uZSI+PGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMTQiIGN5PSI5IiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMjIuNSIgY3k9IjgiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzMSIgY3k9IjkiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzOSIgY3k9IjEyIiByPSIyLjc1Ii8+PC9nPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJidXR0IiBkPSJNOSAyNmM4LjUtMS41IDIxLTEuNSAyNyAwbDIuNS0xMi41TDMxIDI1bC0uMy0xNC4xLTUuMiAxMy42LTMtMTQuNS0zIDE0LjUtNS4yLTEzLjZMMTQgMjUgNi41IDEzLjV6Ii8+PHBhdGggc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIGQ9Ik05IDI2YzAgMiAxLjUgMiAyLjUgNCAxIDEuNSAxIDEgLjUgMy41LTEuNSAxLTEuNSAyLjUtMS41IDIuNS0xLjUgMS41LjUgMi41LjUgMi41IDYuNSAxIDE2LjUgMSAyMyAwIDAgMCAxLjUtMSAwLTIuNSAwIDAgLjUtMS41LTEtMi41LS41LTIuNS0uNS0yIC41LTMuNSAxLTIgMi41LTIgMi41LTQtOC41LTEuNS0xOC41LTEuNS0yNyAweiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBkPSJNMTEgMzguNWEzNSAzNSAxIDAgMCAyMyAwIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWNlY2VjIiBkPSJNMTEgMjlhMzUgMzUgMSAwIDEgMjMgMG0tMjEuNSAyLjVoMjBtLTIxIDNhMzUgMzUgMSAwIDAgMjIgMG0tMjMgM2EzNSAzNSAxIDAgMCAyNCAwIi8+PC9nPjwvc3ZnPg==",
    bK: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSA0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGQ9Ik0yMi41IDExLjZWNiIvPjxwYXRoIGZpbGw9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTExLjUgMzdhMjIuMyAyMi4zIDAgMCAwIDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTB6Ii8+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZD0iTTIwIDhoNSIvPjxwYXRoIHN0cm9rZT0iI2VjZWNlYyIgZD0iTTMyIDI5LjVzOC41LTQgNi05LjdDMzQuMSAxNCAyNSAxOCAyMi41IDI0LjZ2Mi4xLTIuMUMyMCAxOCA5LjkgMTQgNyAxOS45Yy0yLjUgNS42IDQuOCA5IDQuOCA5Ii8+PHBhdGggc3Ryb2tlPSIjZWNlY2VjIiBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiLz48L2c+PC9zdmc+"
  };

  var css = [
    '.kc-diagram { position:relative; width:min(420px, calc(100vw - 64px)); margin:16px 0 16px 50%; transform:translateX(-50%); }',
    '.kc-diagram-grid { display:grid; grid-template-columns:repeat(8,minmax(0,1fr)); grid-template-rows:repeat(8,minmax(0,1fr)); width:100%; aspect-ratio:1/1; border:4px solid var(--brown-dark,#4a2a0e); border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }',
    '.kc-dsq { position:relative; display:flex; align-items:center; justify-content:center; min-width:0; min-height:0; }',
    '.kc-dsq.light { background:var(--sq-light,#d4b87a); }',
    '.kc-dsq.dark { background:var(--sq-dark,#7a5230); }',
    '.kc-dsq img { width:100%; height:100%; object-fit:contain; pointer-events:none; display:block; position:relative; z-index:2; }',
    '.kc-dmark { position:absolute; inset:0; pointer-events:none; z-index:1; }',
    '.kc-dlabel { position:absolute; font-family:"Crimson Pro",serif; font-weight:800; font-size:clamp(0.65rem,2.6vw,0.95rem); line-height:1; pointer-events:none; z-index:3; }',
    '.kc-dsq.light .kc-dlabel { color:rgba(80,40,0,0.85); }',
    '.kc-dsq.dark .kc-dlabel { color:rgba(255,240,200,0.95); }',
    '.kc-dlabel.rank { top:2px; left:3px; }',
    '.kc-dlabel.file { bottom:2px; right:3px; }',
    '.kc-diagram svg.kc-darrows { position:absolute; top:4px; left:4px; width:calc(100% - 8px); height:calc(100% - 8px); pointer-events:none; z-index:4; }',
    '.kc-diagram, .kc-diagram * { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function placementToArray(p) {
    return p.split('/').map(function (row) {
      var out = [];
      row.split('').forEach(function (ch) {
        if (/[1-8]/.test(ch)) { for (var k = 0; k < +ch; k++) out.push(''); }
        else out.push(ch);
      });
      return out;
    });
  }
  function keyOf(ch) { return (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase(); }

  function render(el) {
    var spec;
    try { spec = JSON.parse(el.getAttribute('data-spec')); } catch (e) { return; }
    var board = placementToArray(spec.p);
    var flip = !!spec.f;
    var files = 'abcdefgh';
    var marks = {};
    (spec.l || []).forEach(function (sq) { marks[sq] = 'rgba(205,210,107,0.6)'; });
    (spec.h || []).forEach(function (h) { marks[h[0]] = hexA(h[1], h[2]); });
    el.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'kc-diagram-grid';
    for (var vr = 0; vr < 8; vr++) {
      for (var vc = 0; vc < 8; vc++) {
        var r = flip ? 7 - vr : vr, c = flip ? 7 - vc : vc;
        var sq = files[c] + (8 - r);
        var cell = document.createElement('div');
        cell.className = 'kc-dsq ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        if (marks[sq]) { var m = document.createElement('div'); m.className = 'kc-dmark'; m.style.background = marks[sq]; cell.appendChild(m); }
        if (vc === 0) { var rl = document.createElement('span'); rl.className = 'kc-dlabel rank'; rl.textContent = 8 - r; cell.appendChild(rl); }
        if (vr === 7) { var fl = document.createElement('span'); fl.className = 'kc-dlabel file'; fl.textContent = files[c]; cell.appendChild(fl); }
        var pc = board[r][c];
        if (pc) { var img = document.createElement('img'); img.src = PIECE_IMG[keyOf(pc)]; img.alt = ''; cell.appendChild(img); }
        grid.appendChild(cell);
      }
    }
    el.appendChild(grid);
    if (spec.a && spec.a.length) el.appendChild(arrows(spec.a, flip));
  }
  function hexA(hex, op) {
    var h = hex.replace('#', '');
    if (h.length === 8) { op = (op == null ? 1 : op) * parseInt(h.slice(6, 8), 16) / 255; h = h.slice(0, 6); }
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + (op == null ? 1 : op) + ')';
  }
  function arrows(list, flip) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 8 8');
    svg.setAttribute('class', 'kc-darrows');
    function pos(sq) {
      var f = sq.charCodeAt(0) - 97, rk = +sq[1];
      return [(flip ? 7 - f : f) + 0.5, (flip ? rk - 1 : 8 - rk) + 0.5];
    }
    list.forEach(function (a) {
      if (!a[0] || !a[1]) return;
      var p1 = pos(a[0]), p2 = pos(a[1]);
      var color = hexA(a[2] || '#2d8a3e', a[2] && a[2].length === 9 ? 1 : 0.8);
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / len, uy = dy / len, px = -uy, py = ux;
      var hx = p2[0] - ux * 0.4, hy = p2[1] - uy * 0.4;
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', p1[0]); line.setAttribute('y1', p1[1]); line.setAttribute('x2', hx); line.setAttribute('y2', hy);
      line.setAttribute('stroke', color); line.setAttribute('stroke-width', '0.2'); line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
      var head = document.createElementNS(NS, 'polygon');
      head.setAttribute('points', [p2[0] - ux * 0.05, p2[1] - uy * 0.05, hx + px * 0.3, hy + py * 0.3, hx - px * 0.3, hy - py * 0.3].map(function (v) { return v.toFixed(3); }).join(' '));
      head.setAttribute('fill', color);
      svg.appendChild(head);
    });
    return svg;
  }
  function renderAll() { document.querySelectorAll('.kc-diagram[data-spec]').forEach(render); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll); else renderAll();
})();
