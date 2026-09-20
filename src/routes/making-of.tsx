import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import "../making-of.css";

export const Route = createFileRoute("/making-of")({
  component: MakingOf,
});

function Shot({ src, cap }: { src: string; cap: string }) {
  return (
    <figure>
      <img className="mo-shot" src={src} alt={cap} />
      <figcaption className="mo-cap">{cap}</figcaption>
    </figure>
  );
}

function MakingOf() {
  return (
    <main className="making-of">
      <Link to="/" search={{ room: undefined }} className="mo-back">
        <ChevronLeft size={18} /> 回遊戲
      </Link>
      <p className="mo-kicker">MAKING OF · BEFORE THE CRASH</p>
      <h1>當機前開發精華</h1>
      <p className="lede">
        這是「公司酒局／五告哞聊」從第一句需求，到環境被清空之前，所有真正做進去的東西。不是逐條聊天紀錄，是能還原決策的精華本。
      </p>

      <img className="mo-hero" src="/art/ui/home-poster.jpg" alt="主選單海報" />

      <div className="mo-stats">
        <div>
          <b>V2.0</b>
          正式備份版
        </div>
        <div>
          <b>v2.0</b>
          GitHub 凍結標籤
        </div>
        <div>
          <b>239</b>
          你上傳過的圖
        </div>
        <div>
          <b>5 模式</b>
          二選一／誰最可能／真心話／反應／對對消
        </div>
      </div>

      <h2>1. 專案是什麼</h2>
      <p>
        給台灣酒局用的手機網頁遊戲：每人一台手機、選辦公室角色、用技能互相甩鍋，輸了喝酒。美術鎖定美式嘻哈街頭塗鴉——瀝青底、噴漆、貼紙鈕、粗體字。不是 Excel 惡搞風。
      </p>
      <div className="mo-grid">
        <Shot src="/art/ui/logo.jpg" cap="工作室 Logo" />
        <Shot src="/art/ui/modes-poster.jpg" cap="模式選擇海報（後換過一版）" />
      </div>

      <h2>2. 開場工作室</h2>
      <p>
        一開始片頭會卡住、懲罰動畫超慢。後來改成短影格動畫：貓跑過畫面，至少播滿 4 秒，可點擊跳過。背景音樂要在貓跑到盡頭、進主選單之前就出聲——不是等你按了主選單才播。
      </p>
      <div className="mo-grid three">
        <Shot src="/art/ui/studio/f01.jpg" cap="影格 1" />
        <Shot src="/art/ui/studio/f04.jpg" cap="影格 4" />
        <Shot src="/art/ui/studio/f08.jpg" cap="影格 8" />
      </div>

      <h2>3. 角色牆</h2>
      <p>
        從 9 隻加到 11 隻。去背、頭被放太大、手沒修乾淨、白點白線，來回修很多次。最後你提供完整立繪，要求「全部用我提供的版本，不要再用 AI 去背」。
      </p>
      <div className="mo-grid three">
        <Shot src="/art/roles/manager.png" cap="主管" />
        <Shot src="/art/roles/ceo.png" cap="老闆" />
        <Shot src="/art/roles/worker.png" cap="上班族" />
        <Shot src="/art/roles/intern.png" cap="實習生" />
        <Shot src="/art/roles/sales.png" cap="業務" />
        <Shot src="/art/roles/hr.png" cap="人資" />
        <Shot src="/art/roles/accountant.png" cap="會計" />
        <Shot src="/art/roles/engineer.png" cap="工程師" />
        <Shot src="/art/roles/overtime.png" cap="加班狗" />
      </div>
      <h3>後來才加入：老鳥、秘書</h3>
      <div className="mo-grid">
        <Shot src="/recap/role-veteran-src.jpg" cap="老鳥原圖（自以為是）" />
        <Shot src="/recap/role-secretary-src.jpg" cap="秘書原圖（性感能幹）" />
        <Shot src="/recap/role-veteran-fix.jpg" cap="去背壞掉後你重給的老鳥" />
        <Shot src="/recap/role-secretary-fix.jpg" cap="去背壞掉後你重給的秘書" />
      </div>
      <div className="mo-card">
        <strong>修過的立繪問題</strong>
        <ul>
          <li>選完頭被放很大 → 頭像要 cover／對齊，不能被框撐爆</li>
          <li>手、白點、白線要修掉，圖才夠俐落</li>
          <li>全部角色要跟「老鳥」一樣有白邊</li>
          <li>選角後任務對話不能擋到立繪，改放到圖下方</li>
        </ul>
      </div>
      <div className="mo-grid">
        <Shot src="/recap/bug-big-head.jpg" cap="頭像過大（回報）" />
        <Shot src="/recap/ui-window-cover.jpg" cap="視窗遮擋（回報）" />
      </div>

      <h2>4. 技能三次改稿（定稿）</h2>
      <p>技能每局限用一次。輸的時候才出現「使用技能」，不強制詢問。放技能要有全場動畫：角色圖＋誰使用了什麼。效果疊加要寫在記分板，讓大家看到這次每人喝多少。</p>
      <table>
        <thead>
          <tr>
            <th>角色</th>
            <th>技能</th>
            <th>定稿效果</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>主管</td>
            <td>考績</td>
            <td>你受罰時，指定一人接受相同份量</td>
          </tr>
          <tr>
            <td>上班族</td>
            <td>摸魚</td>
            <td>本次免罰，下次 ×2</td>
          </tr>
          <tr>
            <td>老闆</td>
            <td>我請客</td>
            <td>你受罰時，其他所有人一起罰</td>
          </tr>
          <tr>
            <td>實習生</td>
            <td>新人保護期</td>
            <td>只有被別人技能連坐時能發動，該次全免</td>
          </tr>
          <tr>
            <td>業務</td>
            <td>一人一半</td>
            <td>指定一人平分本次</td>
          </tr>
          <tr>
            <td>人資</td>
            <td>能者多勞</td>
            <td>本次減半；積分最低者再加一份</td>
          </tr>
          <tr>
            <td>會計</td>
            <td>風險對沖</td>
            <td>本次減半；指定一人下次 ×2，你自己下次也 ×2</td>
          </tr>
          <tr>
            <td>工程師</td>
            <td>緊急備援</td>
            <td>本次減半；指定一人下次免罰，你下次 ×2</td>
          </tr>
          <tr>
            <td>加班狗</td>
            <td>爆肝／補休</td>
            <td>本次 ×2，之後可選一次完全免罰</td>
          </tr>
          <tr>
            <td>秘書</td>
            <td>替你擋酒</td>
            <td>替他人承擔；你下次受罰改由對方還</td>
          </tr>
          <tr>
            <td>老鳥</td>
            <td>見過大場面</td>
            <td>一般罰變半份；2 倍以上降回 1 份</td>
          </tr>
        </tbody>
      </table>
      <p>秘書擋酒、加班狗補休、會計／工程師的「下次 ×2」都要一直掛在記分板，直到兌現。</p>

      <h2>5. 二選一：懲罰條件每回合換</h2>
      <p>不要分類題庫。每題隨機一種懲罰條件，上方小字標「懲罰條件」：</p>
      <ul>
        <li>多數受罰</li>
        <li>少數受罰</li>
        <li>單獨一人 ×2</li>
        <li>全員選同一邊 → 大家 ×2</li>
      </ul>
      <p>「不分勝負大家一起兩倍」曾被拿掉，後來改成「全部選一樣才全員 ×2」。平手時記分板不要顯示上一輪的懲罰。</p>
      <p>一局 16 題。結束頒獎：最雷＝罰最多，最強＝罰最少。</p>
      <div className="mo-grid">
        <Shot src="/recap/ui-punish-rule.jpg" cap="懲罰條件文案位置" />
        <Shot src="/recap/ui-tie-score.jpg" cap="平手不應留上一輪懲罰" />
      </div>

      <h2>6. 反應挑戰：色卡戰爭</h2>
      <p>
        從二選一色塊，改成你提供的角色動作圖來混淆。指定一個顏色，大家按準備，倒數後開始。點錯或逾時出局受罰。速度從 2 秒換一張，每張 −0.1 秒，最快停在 0.8 秒。一局 60 拍。
      </p>
      <p>規則細節：不要在圖上再鋪一層背景色；綠框要框住整張卡；右下不要提示文字；個人在自己手機點卡，不是點名字。</p>
      <div className="mo-grid three">
        <Shot src="/recap/card-early-1.jpg" cap="早期色卡" />
        <Shot src="/recap/card-navy.jpg" cap="深藍（你指定的藍）" />
        <Shot src="/recap/card-cyan.jpg" cap="青＝淺藍" />
        <Shot src="/recap/card-orange.jpg" cap="後來加入的橘卡" />
        <Shot src="/recap/card-mid-1.jpg" cap="中期動作卡" />
        <Shot src="/recap/card-early-2.jpg" cap="早期動作卡" />
      </div>
      <div className="mo-card">
        <strong>藍 vs 青</strong>
        <p>太接近會誤導。定稿：藍＝深藍，青＝淺藍。題目卡上方要一直顯示範例色。你後來整批替換深藍卡與青卡。</p>
      </div>
      <h3>進階模式貼紙</h3>
      <p>一般模式圖卡沒貼紙。進階要「顏色對 + 貼紙對」才可按。貼紙後置隨機貼在卡上任一位置。從啤酒圖 → 哞聊貓 → 再加狗、牛。</p>
      <div className="mo-grid">
        <Shot src="/recap/sticker-beer.jpg" cap="第一版：啤酒" />
        <Shot src="/recap/sticker-cat.jpg" cap="改成哞聊貓" />
        <Shot src="/recap/sticker-dog.jpg" cap="狗" />
        <Shot src="/recap/sticker-cow.jpg" cap="牛" />
      </div>
      <p>點錯／忘記點要播貓叫，聽到就表示要受罰。電腦 AI 要夠強、不能每次都同一隻 bot 先錯。</p>

      <h2>7. 介面與音樂</h2>
      <ul>
        <li>粉色按鈕文案改成「使用技能」</li>
        <li>文字必須在框內，說明往下移，不要擋標題</li>
        <li>加碼機制做過又整段取消</li>
        <li>主頁某個 CTA 不要顯示</li>
      </ul>
      <div className="mo-grid">
        <Shot src="/recap/ui-skill-btn.jpg" cap="使用技能" />
        <Shot src="/recap/ui-text-overflow.jpg" cap="字要在框內" />
        <Shot src="/recap/ui-title-cover.jpg" cap="說明擋到標題" />
        <Shot src="/recap/ui-hide-cta.jpg" cap="這個不要顯示" />
      </div>
      <div className="mo-card">
        <strong>配樂定稿</strong>
        <p>開場音樂在背景圖跑滿、進主選單前就要播。多數決定（二選一）用 midnight_authority。誰最可能用後來那首。真心話用 asphalt_overdrive。放技能不要另外切歌，繼續播該模式 BGM。</p>
      </div>

      <h2>8. 連線</h2>
      <p>
        開房邀請常顯示離線失敗逾時。原因：台灣手機 CGNAT，純 WebRTC 打不穿；再加上過早 ask-sync、15 秒太短。後來改 signaling 中繼、放寬逾時、名單看得到人。GitHub Pages 公開站沒有後端，多人連線在那裡本來就不穩。
      </p>

      <h2>9. 對對消（當機前最後一個大功能）</h2>
      <p>用色卡做 8×8／12×12／16×16 覆蓋配對。每位玩家每局限用一次調換兩張牌，調換要像放技能一樣全場跳出動畫。卡背用貓咪貼紙。</p>

      <h2>10. 當機發生什麼事</h2>
      <div className="mo-grid">
        <Shot src="/recap/crash-dup-logo.jpg" cap="介面跑掉：Logo 重疊" />
        <Shot src="/recap/crash-hud.jpg" cap="記分板直向堆疊蓋住角色" />
      </div>
      <div className="mo-card mo-lost">
        <strong>為什麼回不去 V2.09</strong>
        <p>
          完整成品一直活在沙盒工作檔，沒打成可回滾備份。Git 最後一筆是 V1.29／後來推上 GitHub 的 grok-src 是 <b>V1.31</b>。V1.32→V2.09（色卡整批、哞聊貓、新技能、對對消、60 拍反應）沒被存進 GitHub。環境重置後，只剩你上傳的 239 張原圖。
        </p>
      </div>
      <div className="mo-card mo-ok">
        <strong>V2.0 已線上備份</strong>
        <p>
          原始碼在 GitHub <b>grok-src</b>，凍結分支與標籤是 <b>v2.0</b>。11 角色、定稿技能、色卡反應、對對消、頒獎都在裡面。之後接回請用這個標籤，不要只靠沙盒工作檔。
        </p>
      </div>

      <h2>時間軸精華</h2>
      <div className="mo-tl">
        <b>起手</b>
        罰酒 PWA、塗鴉風、角色技能、單機＋開房。
      </div>
      <div className="mo-tl">
        <b>片頭／音樂</b>
        工作室卡住 → 短影格 4 秒；音樂提前到進主選單前。
      </div>
      <div className="mo-tl">
        <b>反應挑戰</b>
        色塊 → 角色動作卡 → 範例色常駐 → 2 秒起跳 −0.1 秒 → 最快 0.8 秒 → 60 拍 → 進階貼紙貓／狗／牛。
      </div>
      <div className="mo-tl">
        <b>二選一</b>
        取消分類；每回合換懲罰條件；全員同一邊才 ×2；16 題一局＋頒獎。
      </div>
      <div className="mo-tl">
        <b>技能</b>
        三次改寫；主管改考績；不強制詢問；記分板顯示疊加與持續標記。
      </div>
      <div className="mo-tl">
        <b>美術</b>
        去背失敗改用你的圖；藍改深藍、青改淺藍；橘卡加入。
      </div>
      <div className="mo-tl">
        <b>最後</b>
        對對消 + 貓背 → 當機清空 → 從 grok-src V1.31 接回 → 補成 V2.0 並打進 GitHub。
      </div>

      <h2>題庫還沒全量匯入</h2>
      <ul>
        <li>200 題二選一 xlsx 全量匯入（現在用既有題庫洗 16 題）</li>
        <li>加碼（已取消，不必回來）</li>
      </ul>

      <p className="mo-kicker">END OF REEL</p>
      <Link to="/" search={{ room: undefined }} className="mo-back">
        <ChevronLeft size={18} /> 回遊戲繼續玩 V2.0
      </Link>
    </main>
  );
}
