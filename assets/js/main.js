let nama
let gender
let progress = [0,0]
let first = 0;
var audio;


let narration_text = [
  {
    type : 'npc',
    name : 'mordred',
    texts : [
      'Call me Mordred, The son of The King Arthur Pendragon',
      'We need your help',
      'There is a Dungeon Outbreak, and the monsters running amok in the town',
      'We need you to go to the dungeon and defeat the boss'
    ]
  },
  {
    type: 'player',
    texts : [
      'Sure, Lets go!,Cant waste any time,can we ?'
    ]
  }
]

let player_stat = {
  attack : 30,
  hp : 100,
  current_hp : 100,
  defense : 20,
  level : 1,
  crit : 2
}

let enemy_stat = [{
  name : 'Skeleton Lancer',
  img : 'skeletonLancer.png',
  attack : 30,
  hp : 100,
  current_hp : 100,
  defense : 20,
  level : 1,
},{
  name : 'Efreet',
  img : 'efreet.png',
  attack : 700,
  hp : 1000,
  current_hp : 1000,
  defense : 550,
  level : 10,
  crit : 5
},{
  name : 'Lancelot',
  img : 'lancelot.png',
  attack : 17000,
  hp : 15000,
  current_hp : 15000,
  defense : 15550,
  level : 100,
  crit : 100
}]

let active_enemy = 0
let enemy_last_action;

function cekNama(value){
  if (first === 0) {
    first++
    audio = new Audio('./assets/sound/music/idle.mp3');
    audio.play()
    audio.volume = 0.4;
  }
  let button = document.getElementById('name_button')
  if (value.length > 0) {
    document.getElementById('disp_nama').innerHTML = `${value} Is My Name`
    button.style.display = 'block'
  }else{
    button.style.display = 'none'
  }
}

function setNama(){
  let name = document.getElementById('nama').value
  if (name.length > 0) {
    nama = name
    narration_text[0].texts.unshift(`Nice to meet you ${nama} !`)
    document.getElementById('player_name').innerHTML = nama
    document.getElementById('gender').style.display = "block"
    document.getElementById('name').style.display = "none"
  }else{
    alert('Please fill the requirement correctly')
  }
}

function setGender(value) {
  if (value === 'male' || value === 'female') {
    gender = value
    document.getElementById('register').style.display = 'none'
    document.getElementById('narration').style.display = 'block'
    document.getElementById('player_img').src = `./assets/images/characters/character_${gender}_chat.png`
    // narration(0,0)
    continue_chats();
  }else{
    alert('Please fill the requirement correctly')
  }
}

function narration(x, y){
  if (narration_text[x].texts[y]) {
    if (narration_text[x].type === 'npc') {
      document.getElementsByClassName('npc_character')[0].style.display = 'block'
      document.getElementById('npc_img').src= `./assets/images/characters/${narration_text[x].name}.png`
      document.getElementById('npc_img').alt= narration_text[x].name
      document.getElementById('npc_name').innerHTML= narration_text[x].name
      document.getElementById('npc_chats').innerHTML = narration_text[x].texts[y]
    }else{
      document.getElementsByClassName('player_character')[0].style.display = 'block'
      document.getElementById('player_img').src= `./assets/images/characters/character_${gender}_chat.png`
      document.getElementById('player_img').alt= nama
      document.getElementById('player_name').innerHTML= nama
      document.getElementById('player_chats').innerHTML = narration_text[x].texts[y]
    }
  }
}

function continue_chats(){
  let x = progress[0]
  let y = progress[1]

  if (narration_text[x]) {
    narration(progress[0],progress[1])
    if (!narration_text[x].texts[y+1]) {
      x++
      y = 0
    }else{
      y++
    }
    progress[0] = x
    progress[1] = y
    return true
  }else{
    show_battle_stage()
    return true
  }
}

function show_battle_stage(){
  document.getElementById('character_image_sprite').src = `./assets/images/characters/character_${gender}_sprite.png`
  document.getElementById('enemy_image_sprite').src = `./assets/images/characters/skeletonLancer.png`
  document.getElementById('register').style.display = 'none'
  document.getElementById('narration').style.display = 'none'
  document.getElementById('battle_screen').style.display = 'block'
  refreshHealth('player')
  refreshHealth('enemy')
  document.getElementById('atk').innerHTML = `ATK : ${player_stat.attack}`
  document.getElementById('def').innerHTML = `DEF : ${player_stat.defense}`
  audio.pause()
  audio = new Audio('./assets/sound/music/battle.mp3')
  audio.play()
  audio.volume = 0.4;
}

function battle(action){
  let enemy_lv = enemy_stat[0].level;
  if (action === 'attack') {
    attack('player',enemy_last_action);
  }else if (action === 'heal') {
    heal();
  }
  if (enemy_lv === enemy_stat[0].level) {
    enemy_action(action);
  }
  refreshHealth('player')
  refreshHealth('enemy')
}

function attack(char, last_act = null){

  if (char === 'player') {
    let critical = false;
    let dmg = Math.floor((Math.random() * player_stat.attack) + 1);
    let crit =Math.floor((Math.random() * 100) + 1);
    if (crit>50) {
      dmg = dmg*player_stat.crit
      critical = true
    }
    if (!enemy_last_action || enemy_last_action === 'defend') {
      dmg -= enemy_stat[active_enemy].defense
      if (dmg <= 0) {
        printLog(`Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} Evaded ${nama}'s Attack!`)
      }else{
        enemy_stat[active_enemy].current_hp -= dmg
        if (critical === true) {
          printLog(`${nama} dealt ${dmg} CRITICAL DAMAGE!`,1)
        }else{
          printLog(`${nama} dealt ${dmg} damage!`)
        }
        let hitsound = new Audio('./assets/sound/attack.mp3');
        hitsound.play()
        hitsound.volume = 0.4;
      }
    }else{
      let def = Math.floor((Math.random() * enemy_stat[active_enemy].defense) + 1);
      if (!critical) {
        dmg -= def
      }
      if (dmg <= 0) {
        printLog(`Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} Evaded ${nama}'s Attack!`)
      }else{
        enemy_stat[active_enemy].current_hp -= dmg
        if (critical === true) {
          printLog(`${nama} dealt ${dmg} CRITICAL DAMAGE!`,1)
        }else{
          printLog(`${nama} dealt ${dmg} damage!`)
        }
        let hitsound = new Audio('./assets/sound/attack.mp3');
        hitsound.play()
        hitsound.volume = 0.4;
      }
    }
    if (enemy_stat[active_enemy].current_hp <= 0) {
      printLog(`you have defeated Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} !`)
      printLog('proceeding to exploring further area')
      upgradeLevel();
      if (enemy_stat[0].level > 100) {
        printLog(`CONGRATULATIONS HERO ${nama}!! YOU BEAT THE GAME !!!!`,3)
        document.getElementsByClassName('action_panel')[0].style.display = 'none'
        document.getElementsByClassName('retry_panel')[0].style.display = 'block'
      }else{
        if (active_enemy === 2) {
          printLog(`Finally you reached the BOSS STAGE!`,2)
          printLog(`LAST BOSS Lv ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} Appeared ! Prepare for Battle!`)
        }else{
          printLog(`Lv ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} Appeared ! Prepare for Battle!`)
        }
      }
    }
  }else{
    let critical = false;
    let dmg = Math.floor((Math.random() * player_stat.attack) + 1);
    if (enemy_stat[active_enemy].level === 10) {
      let crit =Math.floor((Math.random() * 100) + 1);
      if (crit>50) {
        dmg = dmg*player_stat.crit
        critical = true
      }
    }
    if (!last_act || last_act === null || last_act === 'defend') {
      dmg -= player_stat.defense
      if (dmg <= 0) {
        printLog(`${nama} Evaded Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name}'s Attack!`)
      }else{
        player_stat.current_hp -= dmg
        printLog(`Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} dealt ${dmg} damage!`)
        let hitsound = new Audio('./assets/sound/attack.mp3');
        hitsound.play()
        hitsound.volume = 0.4
      }
    }else{
      let def = Math.floor((Math.random() * player_stat.defense) + 1);
      if (!critical) {
        dmg -= def
      }
      if (dmg <= 0) {
        printLog(`${nama} Evaded Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name}'s Attack!`)
      }else{
        player_stat.current_hp -= dmg
        printLog(`Lv. ${enemy_stat[active_enemy].level} ${enemy_stat[active_enemy].name} dealt ${dmg} damage!`)
      }
      let hitsound = new Audio('./assets/sound/attack.mp3');
      hitsound.play()
      hitsound.volume = 0.4
    }
    if (player_stat.current_hp <= 0) {
      printLog(`GAME OVER !`)
      player_stat.current_hp = 0
      document.getElementsByClassName('action_panel')[0].style.display = 'none'
      document.getElementsByClassName('retry_panel')[0].style.display = 'block'
      audio.pause()
      audio = new Audio('./assets/sound/music/gameover.mp3')
      audio.play()
    }
  }
}

function enemy_action(act){
  let action = Math.floor((Math.random() * 2) + 1)
  if (action > 1) {
      attack('enemy',act)
  }else{
    enemy_last_action = 'defend'
  }
}

function heal(){
  let crit =Math.floor((Math.random() * 100) + 1);
  let dmg =Math.floor((Math.random() * player_stat.attack) + 1);
  if (crit>50) {
    dmg = dmg*player_stat.crit + player_stat.attack
  }
  if (player_stat.current_hp + dmg > player_stat.hp) {
    player_stat.current_hp = player_stat.hp
  }else{
    player_stat.current_hp += dmg
  }
  printLog(`${nama} Healed Theirself`)
}

function upgradeLevel() {
  player_stat.level++;
  enemy_stat[0].level++;
  for (var key in player_stat) {
    if (key !== 'level' && key !== 'crit') {
      player_stat[key] += 15
    }else if (key === 'crit') {
      player_stat[key] += 1
    }
  }
  for (var key in enemy_stat[0]) {
    if (key !== 'level' && key !== 'name' && key !== 'img') {
      if (enemy_stat[0].level % 10 === 0) {
        enemy_stat[0][key] += 100
        if (enemy_stat[0].crit) {
          enemy_stat[0].crit += 10
        }else{
          enemy_stat[0]['crit'] = 10
        }
      }else{
        enemy_stat[0][key] += 50
      }
    }
  }
  if (enemy_stat[0].level % 10 === 0) {
    if (enemy_stat[0].level === 100) {
      active_enemy = 2
    }else{
      active_enemy = 1
    }
    if (enemy_stat[0].level !== 10) {
      enemy_stat[1].level += 10
      for (var key in enemy_stat[1]) {
        if (key !== 'level' && key !== 'name' && key !== 'img') {
          enemy_stat[1][key] += 1000
        }
      }
      enemy_stat[1]['crit'] += 7
    }
  }else{
    active_enemy = 0
  }
  player_stat.current_hp = player_stat.hp
  for (var i = 0; i < enemy_stat.length; i++) {
    enemy_stat[i].current_hp = enemy_stat[i].hp
  }
  document.getElementById('enemy_image_sprite').src=`./assets/images/characters/${enemy_stat[active_enemy].img}`
  document.getElementById('atk').innerHTML =`ATK : ${player_stat.attack}`
  document.getElementById('def').innerHTML =`DEF : ${player_stat.defense}`
}

function refreshHealth(subject){
  let stat;
  if (subject === 'player') {
    stat = player_stat
  }else{
    stat = enemy_stat[active_enemy]
  }

  document.getElementById(`${subject}_health`).innerHTML = `${stat.current_hp} / ${stat.hp}`
  document.getElementById(`${subject}_health_bar`).style.width = (stat.current_hp / stat.hp *100)+'%'
}

function printLog(message, crit=null) {
  let report = document.createElement("div");
  report.className = "battle_log_message";
  if (crit === 1) {
    report.style.cssText = 'background:rgb(255, 88, 88)';
  }else if (crit === 2) {
    report.style.cssText = 'background:rgb(171, 56, 56)';
  }else if (crit === 3) {
    report.style.cssText = 'background:rgb(137, 255, 122)';
  }
  report.innerHTML = message
  document.getElementsByClassName('battle_log_cover')[0].insertBefore(report, document.getElementsByClassName('battle_log_message')[0])
}

function retry(){
  window.location.reload()
}
