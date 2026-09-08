const boardEl=document.getElementById("board"), turnBadge=document.getElementById("turnBadge"), moveCount=document.getElementById("moveCount"), historyEl=document.getElementById("history");
let board=[],turn="w",selected=null,moves=[],snapshots=[],sound=true;

const icons={w:{k:"♔",q:"♕",r:"♖",b:"♗",n:"♘",p:"♙"},b:{k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟"}};
function setup(){board=Array.from({length:8},()=>Array(8).fill(null));
["r","n","b","q","k","b","n","r"].forEach((p,c)=>{board[0][c]={t:p,c:"b"};board[1][c]={t:"p",c:"b"};board[6][c]={t:"p",c:"w"};board[7][c]={t:p,c:"w"}});
turn="w";selected=null;moves=[];snapshots=[];render();}
function render(){
boardEl.innerHTML="";
for(let r=0;r<8;r++)for(let c=0;c<8;c++){let cell=document.createElement("div");cell.className="cell "+((r+c)%2?"dark":"light");cell.dataset.r=r;cell.dataset.c=c;
let p=board[r][c]; if(p){let s=document.createElement("span");s.className="piece "+(p.c==="w"?"p-white":"p-black");s.textContent=icons[p.c][p.t];cell.appendChild(s)}
if(selected&&selected.r===r&&selected.c===c)cell.classList.add("selected");
if(selected&&valid(selected.r,selected.c,r,c)){cell.classList.add(board[r][c]?"capture":"move")}
cell.onclick=()=>clickCell(r,c);boardEl.appendChild(cell)}
turnBadge.textContent=turn==="w"?"GILIRAN PUTIH":"GILIRAN HITAM";moveCount.textContent=moves.length;renderHistory();
}
function inside(r,c){return r>=0&&r<8&&c>=0&&c<8}
function clearPath(r,c,nr,nc){let dr=Math.sign(nr-r),dc=Math.sign(nc-c),x=r+dr,y=c+dc;while(x!==nr||y!==nc){if(board[x][y])return false;x+=dr;y+=dc}return true}
function valid(r,c,nr,nc){
let p=board[r][c],t=board[nr][nc];if(!p||p.c!==turn||(t&&t.c===p.c)||(r===nr&&c===nc))return false;
let dr=nr-r,dc=nc-c,ar=Math.abs(dr),ac=Math.abs(dc),dir=p.c==="w"?-1:1;
if(p.t==="p") return (dc===0&&dr===dir&&!t)||(ac===1&&dr===dir&&t);
if(p.t==="r") return (dr===0||dc===0)&&clearPath(r,c,nr,nc);
if(p.t==="b") return ar===ac&&clearPath(r,c,nr,nc);
if(p.t==="q") return (ar===ac||dr===0||dc===0)&&clearPath(r,c,nr,nc);
if(p.t==="n") return (ar===2&&ac===1)||(ar===1&&ac===2);
if(p.t==="k") return ar<=1&&ac<=1;
}
function clickCell(r,c){
if(selected){
 if(valid(selected.r,selected.c,r,c)){move(selected.r,selected.c,r,c);return}
 if(board[r][c]?.c===turn){selected={r,c};render();return}
 selected=null;render();return;
}
if(board[r][c]?.c===turn){selected={r,c};render()}
}
function move(r,c,nr,nc){
snapshots.push({board:board.map(row=>row.map(p=>p?{...p}:null)),turn});
let p=board[r][c],captured=board[nr][nc];board[nr][nc]=p;board[r][c]=null;
if(p.t==="p"&&(nr===0||nr===7))p.t="q";
moves.push({piece:icons[p.c][p.t],from:coord(r,c),to:coord(nr,nc),capture:!!captured});
turn=turn==="w"?"b":"w";selected=null;beep();render();
if(captured&&captured.t==="k"){setTimeout(()=>alert("Raja tertangkap! Mulai permainan baru untuk bermain lagi."),80)}
}
function coord(r,c){return String.fromCharCode(97+c)+(8-r)}
function renderHistory(){if(!moves.length){historyEl.innerHTML="<p>Belum ada langkah.</p>";return}historyEl.innerHTML=moves.slice(-10).map((m,i)=>`<div class="move-row"><span>${moves.length-10+i+1>0?moves.length-10+i+1:""} ${m.piece}</span><b>${m.from} → ${m.to}${m.capture?" ×":""}</b></div>`).join("")}
function beep(){if(!sound)return;try{let a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=520;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.06)}catch(e){}}
const newGameBtn=document.getElementById("newGame");
newGameBtn.onclick=()=>{setup();document.getElementById("gameSection").scrollIntoView({behavior:"smooth",block:"start"});};
document.getElementById("undoBtn").onclick=()=>{if(!snapshots.length)return;const s=snapshots.pop();board=s.board.map(row=>row.map(p=>p?{...p}:null));turn=s.turn;moves.pop();selected=null;render();};
document.getElementById("soundBtn").onclick=()=>{sound=!sound;document.getElementById("soundBtn").textContent=sound?"🔊":"🔇"};
document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("dark");
const modal=document.getElementById("modal");document.getElementById("howBtn").onclick=()=>modal.classList.remove("hidden");document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};
setup();
