/* tactics-board.js
   共有の「戦術デモ盤面」エンジン。KitsuneChessの各戦術解説ページ（fork.html など）から読み込んで使う。
   match.html と同じシンプルな駒画像（PIECE_IMG）を使用。
*/
(function (global) {
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

  const FILES = ['a','b','c','d','e','f','g','h'];

  // ===== 効果音(match.htmlと同じ方式のWeb Audio生成音) =====
  let sharedAudioCtx = null;
  function getAudioCtx() {
    if (!sharedAudioCtx) sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
    return sharedAudioCtx;
  }
  function playMoveSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const clickDuration = 0.05;
      const clickBufferSize = Math.floor(ctx.sampleRate * clickDuration);
      const clickBuffer = ctx.createBuffer(1, clickBufferSize, ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBufferSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / clickBufferSize, 4);
      }
      const clickNoise = ctx.createBufferSource();
      clickNoise.buffer = clickBuffer;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.value = 1900;
      clickFilter.Q.value = 1.1;
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.55, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickDuration);
      clickNoise.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickNoise.start(now);
      clickNoise.stop(now + clickDuration);

      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(190, now);
      thudOsc.frequency.exponentialRampToValueAtTime(65, now + 0.1);
      thudGain.gain.setValueAtTime(0.45, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.12);
    } catch (e) { /* 再生に失敗しても表示自体には影響させない */ }
  }
  function playCheckSound() {
    try {
      const ctx = getAudioCtx();
      const duration = 0.09;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2200;
      bandpass.Q.value = 0.7;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch (e) { /* 再生に失敗しても表示自体には影響させない */ }
  }
  function playCaptureSound() {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      const duration = 0.1;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1200;
      bandpass.Q.value = 0.9;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch (e) { /* 再生に失敗しても表示自体には影響させない */ }
  }


  function fenBoardArray(fen) {
    // FENの盤面部分だけを8x8配列（[rank8..rank1][fileA..fileH]）に変換
    const rows = fen.split(' ')[0].split('/');
    return rows.map(row => {
      const cells = [];
      for (const ch of row) {
        if (/\d/.test(ch)) {
          for (let i = 0; i < parseInt(ch, 10); i++) cells.push(null);
        } else {
          const color = ch === ch.toUpperCase() ? 'w' : 'b';
          cells.push(color + ch.toUpperCase());
        }
      }
      return cells;
    });
  }

  function squareCoords(sq) {
    const file = FILES.indexOf(sq[0]);
    const rank = parseInt(sq[1], 10);
    return { row: 8 - rank, col: file };
  }

  // TacticBoard: 1つの戦術デモ盤面インスタンスを作る
  // opts: { containerId, fen, moves: [{from,to,captures?:true}], captions: {ja:[...], en:[...]}, lang: 'ja'|'en' }
  global.TacticBoard = function (opts) {
    const container = document.getElementById(opts.containerId);
    if (!container) return;
    let board = fenBoardArray(opts.fen);
    let stepIndex = 0;
    let animating = false;

    container.innerHTML =
      '<div class="tb-board"></div>' +
      '<p class="tb-caption"></p>' +
      '<div class="tb-controls">' +
      '<button class="tb-play">▶ <span data-ja="再生" data-en="Play">再生</span></button>' +
      '<button class="tb-reset">↺ <span data-ja="もう一度" data-en="Replay">もう一度</span></button>' +
      '</div>';

    const boardEl = container.querySelector('.tb-board');
    const captionEl = container.querySelector('.tb-caption');
    const playBtn = container.querySelector('.tb-play');
    const resetBtn = container.querySelector('.tb-reset');

    function currentLang() {
      return (localStorage.getItem('selectedLang') === 'en') ? 'en' : 'ja';
    }

    function renderBoard(highlightFrom, highlightTo, highlightCapture) {
      boardEl.innerHTML = '';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = FILES[c] + (8 - r);
          const cell = document.createElement('div');
          cell.className = 'tb-sq ' + (((r + c) % 2 === 0) ? 'tb-light' : 'tb-dark');
          cell.dataset.sq = sq;
          if (sq === highlightFrom || sq === highlightTo || sq === highlightCapture) cell.classList.add('tb-highlight');
          if (c === 0) {
            const rankLabel = document.createElement('span');
            rankLabel.className = 'tb-label tb-rank-label';
            rankLabel.textContent = 8 - r;
            cell.appendChild(rankLabel);
          }
          if (r === 7) {
            const fileLabel = document.createElement('span');
            fileLabel.className = 'tb-label tb-file-label';
            fileLabel.textContent = FILES[c];
            cell.appendChild(fileLabel);
          }
          const piece = board[r][c];
          if (piece) {
            const img = document.createElement('img');
            img.src = PIECE_IMG[piece];
            img.className = 'tb-piece';
            cell.appendChild(img);
          }
          boardEl.appendChild(cell);
        }
      }
    }

    function setCaption(i) {
      const lang = currentLang();
      const list = (opts.captions && opts.captions[lang]) || [];
      captionEl.textContent = list[i] || '';
    }

    function applyMove(mv) {
      const from = squareCoords(mv.from);
      const to = squareCoords(mv.to);
      const piece = board[from.row][from.col];
      board[from.row][from.col] = null;
      board[to.row][to.col] = piece;
      if (mv.capture) {
        const cap = squareCoords(mv.capture);
        board[cap.row][cap.col] = null;
      }
    }

    function animateStep(mv, done) {
      const fromCell = boardEl.querySelector('[data-sq="' + mv.from + '"]');
      const toCell = boardEl.querySelector('[data-sq="' + mv.to + '"]');
      const img = fromCell ? fromCell.querySelector('img') : null;
      if (!img || !toCell) {
        applyMove(mv);
        renderBoard(mv.from, mv.to, mv.capture);
        if (mv.check) playCheckSound();
        else if (mv.capture || mv.captured) playCaptureSound();
        else playMoveSound();
        done();
        return;
      }
      const fromRect = fromCell.getBoundingClientRect();
      const toRect = toCell.getBoundingClientRect();
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;
      img.style.position = 'relative';
      img.style.zIndex = '5';
      img.style.transition = 'transform 0.5s ease';
      requestAnimationFrame(() => {
        img.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      setTimeout(() => {
        applyMove(mv);
        renderBoard(mv.from, mv.to, mv.capture);
        if (mv.check) playCheckSound();
        else if (mv.capture || mv.captured) playCaptureSound();
        else playMoveSound();
        done();
      }, 520);
    }

    function play() {
      if (animating) return;
      animating = true;
      playBtn.disabled = true;
      // ボタンを押した「その場」でAudioContextを起動/再開しておく。
      // setTimeoutの中まで初期化を遅らせると、ブラウザの自動再生ポリシーで
      // 音が鳴らないことがあるため、ユーザー操作の直後に確実に行う。
      getAudioCtx();
      board = fenBoardArray(opts.fen);
      stepIndex = 0;
      renderBoard();
      setCaption(0);
      const moves = opts.moves;
      function next() {
        if (stepIndex >= moves.length) {
          animating = false;
          playBtn.disabled = false;
          return;
        }
        const mv = moves[stepIndex];
        setTimeout(() => {
          animateStep(mv, () => {
            stepIndex++;
            setCaption(stepIndex);
            setTimeout(next, 700);
          });
        }, 500);
      }
      next();
    }

    function reset() {
      animating = false;
      playBtn.disabled = false;
      board = fenBoardArray(opts.fen);
      stepIndex = 0;
      renderBoard();
      setCaption(0);
    }

    playBtn.onclick = play;
    resetBtn.onclick = reset;

    // 言語ボタンのdata-ja/data-enを初期反映
    container.querySelectorAll('[data-ja]').forEach(el => {
      el.textContent = currentLang() === 'ja' ? el.dataset.ja : el.dataset.en;
    });

    reset();

    // ページ側の言語切り替えボタンが押された時、このボードのcaption/ボタン文言も追従できるよう公開
    return {
      refreshLang: function () {
        container.querySelectorAll('[data-ja]').forEach(el => {
          el.textContent = currentLang() === 'ja' ? el.dataset.ja : el.dataset.en;
        });
        setCaption(stepIndex);
      }
    };
  };
})(window);
