/*
Todo:
-New Dwango splash screen?

Post "Final" .js Future adds/changes in order of importance/viability/cool factor/just qol etc
-Add security rating for autogen devices (currently displays undefined for auto-generated network devices) just a visual fix for 'scan <IP> devices' enhancement, pre-defined devices already have individual security levels now displayed
-Add security listings to bookmarks (viewable on scan and info already not 100% necessary just user friendly)
-Finish refining command parameters e.g. sell value / sell push changed to sell -v and sell -p, make them LOOK more hackery looking possible have full word alternatives etc
-FIB Honeypot for old hack
-Timed event / Trace event on certain networks that would lock user out / cause restart state / alert PD etc
-Jumpscare perhaps linked to timed event? For 2.0 DW vibes. 
-Password system - variation on bank account creation, if entered = preset u/p then let user into network and use site - would need sites interiors to be made as well though so put on hold - DSS prinmary candidate for this example
-Custom OS.BIN file replacement wormOS.BIN with worm virus available on Watchers Store OR creatable by user (or modifiable to add their signature etc) - when installed on a device its original network directs to 'hackedIP'
-Creating markers that hackers could leave on systems to leave their 'mark' / 'tag' and claim the hack etc - would later be possible evidence for PD etc like wormOS
-Player created scripts to automate processes e.g. script to discover, wepcrack, rip files and sell? Maybe have purchaseable example they can tweak to improve etc similar to current .cmd files but with advanced features beyond connecting
*/

// Initialising HTML elements.
var logs = document.getElementById("logContainer").children
var input = document.getElementById("input")
var displays = document.getElementById("posBox").children
var ipDisplay = displays[0]
var macDisplay = displays[1]
var fileDisplay = displays[2]
//var loadInput = document.getElementById('loadInput')
//loadInput.addEventListener('change', mount, false)

// Initialising command memory variables.
var maxPrevCommands = 64
var prevCommands = []
var currentPos = -1
var pauseReason = null
var inParse = false
var commandQueue = []

// Bool for not entering command.
var noCommand = false

// Loading bar variables.
var loadMax = 0
var loadTime = 0
var loadTitle = ""
var loadEndMsg = ""
var loadFunction = ""
var loadData = []

//Citizen - bank account limits
var bankaccounts = 0

//Citizen - Sounds
var bootup_snd = new Audio('sounds/bootup.mp3')
var sell_snd = new Audio('sounds/sell.mp3')
var connect_snd = new Audio('sounds/connect.mp3')
//Citizen - can't find location to play bootup_snd - bootup_snd.play()

// Handles keyboard input.
input.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 13: // Enter
      event.preventDefault()
      if (pauseReason === null && !inParse && commandQueue.length <= 0) {
        parseInput(input.value)
        if (!noCommand) {
          if (prevCommands[0] !== input.value) {
            prevCommands.unshift(input.value)
            if (prevCommands.length > maxPrevCommands) {
              prevCommands = prevCommands.slice(0, maxPrevCommands)
            }
          }
          input.value = ""
          currentPos = -1
        } else {
          noCommand = false
        }
      }
      break
    case 27: // Escape
      event.preventDefault()
      input.value = ""
      break
    case 38: // Up Arrow
      event.preventDefault()
      if (prevCommands.length > 0) {
        if (currentPos < prevCommands.length - 1) {
          currentPos += 1
        }
        input.value = prevCommands[currentPos]
      }
      break
    case 40: // Down Arrow
      event.preventDefault()
      if (currentPos > -1) {
        currentPos -= 1
        if (currentPos === -1) {
          input.value = ""
        } else {
          input.value = prevCommands[currentPos]
        }
      }
      break
    case 76: // Control + L
      if (event.ctrlKey) {
        event.preventDefault()
        clearLogs()
      }
      break
    case 82: // Control + R
      if (event.ctrlKey) {
        event.preventDefault()
        reset()
      }
      break
  }
})

// Disconnect from the current instance.
function disconnect() {
  instance = null
  addLoadingBar("Culling", 500, "Disconnected from remote server.", "connect", [playerNetwork, playerHost])
}

// Parse user input.
function parseInput(input) {
  inParse = true
  if (instance !== null && input === "disconnect") {
    clearLogs()
    disconnect()
  } else {
    switch (instance) {
      case "bank":
        doBank(input)
        break
      case "shop":
        doShop(input)
        break
      case "fence":
        doFence(input)
        break
//Citizen - dochatbbs 
	  case "chatbbs":
        doChatBBS(input)
        break
//Citizen - doMentor 
	  case "mentor":
        doMentor(input)
        break	
//Citizen - doInfobattle
	  case "infobattle":
        doInfoBattle(input)
        break	
//Citizen - doWatchers
      case "watchers":
        doWatchers(input)
        break		
//Citizen - doPayphone
	  case "payphone":
        doPayphone(input)
        break	
      case null:
        addLog("> " + input)
        parseCommand(quoteSplit(input," "))
        break
    }
  }
  inParse = false
}

// Defines actions to be run when entering an instance.
//Citizen - edits for each server
function startInstance() {
  switch (instance) {
//Citizen - Dwango chat add
    case "chatbbs":
	  clearLogs()
	  addLog("                                                             ,▄▄▄▄▄▄▄▄▄,                               ,▄█▀▀-      ▀▀██,                           ▄█               ██                         ▐█   ██▄ ▄██µ ██▄  █▌                         █µ  ▀▀▀ `▀▀  ▀▀▀ ,█` ▄,                      ▀█▄             ▄█▀ ▄██▌                       ▀██  ▄▄▄▄▄▄▄█▀▀ ,█████                        ██▄█▀`'`  ,,▄▄██████▀                       ▀▀▀    ▀███████████▀▀                                  -▀▀▀▀▀███                                           ▀▀╛                    Chat Services Status: DOWN                       Archives Available              ")
      addLog("DWANGO Chat for all your WareZ discussion.")
      addLog(["[1-4]' to open page of chat archive.", "Type 'disconnect' to disconnect from server."])
    break
//Citizen - end of Dwango chat	  
    case "bank":
      networks[bankIP].data.pos = 0
      networks[bankIP].data.tempUser = ""
      clearLogs()
	  addLog(" ______ _      _______ _______ ______ ______ (______|_)    (_______|_______|______|______) _____  _      _____   _____   _      ______ |  ___)| |    |  ___) |  ___) | |    |  __  || |    | |____| |_____| |_____| |____| |  | ||_|    |______)_______)_______)\_____)|_|  |_|  ")
      addLog("Welcome to the Fleeca Online Banking Server")
      addLog(["[1] to create an account.", "[2] to download the Fleeca Banking App.", "Type 'disconnect' to disconnect from server."])
      break
    case "shop":
      clearLogs()
      if (!findFile(devices[playerHost].files, ["Users","admin","Applications","bank.exe"], "bank") || currentBank === "") {
        addLog("ERROR - Bank account not found.")
        networks[shopIP].data.pos = -1
        break
      } else {
        networks[shopIP].data.pos = 0
		addLog("  ▌ ▄ ·. ▪  ▄▄▌  ▄ •▄ ▄▄▄         ▄▄▄· ·▄▄▄▄ ·██ ▐███▪██ ██•  █▌▄▌▪▀▄ █·▪     ▐█ ▀█ ██▪ ██▐█ ▌▐▌▐█·▐█·██▪  ▐▀▀▄·▐▀▀▄  ▄█▀▄ ▄█▀▀█ ▐█· ▐███ ██▌▐█▌▐█▌▐█▌▐▌▐█.█▌▐█•█▌▐█▌.▐▌▐█ ▪▐▌██. ██▀▀  █▪▀▀▀▀▀▀.▀▀▀ ·▀  ▀.▀  ▀ ▀█▄▀▪ ▀  ▀ ▀▀▀▀▀•")
        addLog("Welcome to the Milk Road Online Shop")
        addLog(["[1] to purchase items.", "[2] to download a shortcut for the shop.", "[3] to access file guidelines.", "Type 'disconnect' to disconnect from server."])
      }
      break
    case "fence":
      clearLogs()
      addLog("   ██████  ██▓     ▒█████  ▄▄▄█████▓ ██░ ██   ▒██    ▒ ▓██▒    ▒██▒  ██▒▓  ██▒ ▓▒▓██░ ██▒  ░ ▓██▄   ▒██░    ▒██░  ██▒▒ ▓██░ ▒░▒██▀▀██░    ▒   ██▒▒██░    ▒██   ██░░ ▓██▓ ░ ░▓█ ░██   ▒██████▒▒░██████▒░ ████▓▒░  ▒██▒ ░ ░▓█▒░██▓  ▒ ▒▓▒ ▒ ░▒▓▒░▒  ░░ ▒░▒░▒░   ▒ ▓▒░   ▒ ░░▓░▒  ░ ░▒  ░ ░▒ ░ ▒  ░  ░ ▒ ▒░      ▒░  ▒  ░▒░ ░  ░  ░  ░  ▒   ░   ░ ░  ░ ▒       ▒░ ░    ░░ ░       ░  ░       ░  ░    ░       ░      ░  ░          G       A       T       E          ")
      addLog("Welcome to SlothGate.")
      addLog(["[1] to download the file trading application.", "Type 'disconnect' to disconnect from server."])
      break
    case "fib":
      clearLogs()
      addLog("   ▐                                     ▌      █`N,                                ▄^█      ▐   ▀██▄                       ▄██▀`  █     ▄▄█▄,^+█████████ ████▌ █████████ ▐▌^,▄█▄▄    ▐▄   ▀*█████████ ████▌ ███████████M▀`  ,▀    ▄██w▄,^████      ████▌ ████   ████▀,▄▄Æ█▄   ╙█    ∞▄████      ████▌ ████   ████▄∞    ▄▀    █▀^^^^█████████ ████▌ ████▄▄▄███▀▀^^^▀█     ▀█▄ ,▄▄█████████ ████▌ ███████████▄▄, ,▄▀      ▐▀   ████      ████▌ ████   ▐███∩  `█        ▀▀▄P^████      ████▌ ████   ▐███▀*▄▀▀          ▐▄▄████      ████▌ ████   ▐███▄▄█               ████      ████▌ ██████████▀                  ▀▀▀▀      ▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀           ")
      addLog("       F.I.B. RESTRICTED ACCESS SERVER       ")
      addLog(["Device not recognised IP logged.", "Type 'disconnect' to disconnect from server."])
      break
	//Citizen - mentor
	case "mentor":
	  clearLogs()
	  addLog("                          ─,                                       ^  ]▒▒░µ                                    ^ ,╥Ü▒▒▒░▄                                  Ç.-   ^╙╙▒█r                               ╔┘           ╙╕                              ╙W   ╙^  ▀   ╓┘                           ╓m²^^╙╕       .╜░░▒π▄                       ▓╛   ],             ╜║▒,                   ╔╩╙                     ▒░▄▄               ╥▓  ]^^^     ^^   ^  ^^^[  ╓╜▐▄            ,▓Ñ^  ]                   [    ]╜▐         ,▓▓╓.   ├         ╜Y        [      ╙▀▄       ^   ╙▓Ñ═⌡                   ^ ^▀▀▒^  ^^   ")
      addLog("The Mentor's Manifesto")
      addLog(["[1-9] to view page.", "Type 'disconnect' to disconnect from server."])
      break
	//Citizen - case Cerberus
    case "cerberus":
	  clearLogs()
	  addLog("█████████████████████████████████████████████████████████████████▌▀███▀███████████████████████████████████████     ██████████████████████████████████████▀    ═▄.▀███████████████████████████████████           ▀████████████████████████████████`     ,,,,   ▄██████████████████████████████▌   ▄█████▄▀▀▀███████████████████████████████▌ ▄█████████▄  ╙▀████████████████████████▌  ╙█ ███████████▌    ███████████████████████    ▀▄████████████     ▀████████████████████ ▄    ▀███████████▀      ▐████████████████▄,  ^      `▀▀▀▀▀▀▄█▀         ▀████████████████▌            ▄▄█▌     ▀,  ▐██████████████████▄███████████████▌▄▄██████▄██████████")
      addLog("Cerberus External Network Service.")
      addLog(["MAC not whitelisted, ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Cerberus Industries
    case "cerberusind":
	  clearLogs()
	  addLog("█████████████████████████████████████████████████████████████████▌▀███▀███████████████████████████████████████     ██████████████████████████████████████▀    ═▄.▀███████████████████████████████████           ▀████████████████████████████████`     ,,,,   ▄██████████████████████████████▌   ▄█████▄▀▀▀███████████████████████████████▌ ▄█████████▄  ╙▀████████████████████████▌  ╙█ ███████████▌    ███████████████████████    ▀▄████████████     ▀████████████████████ ▄    ▀███████████▀      ▐████████████████▄,  ^      `▀▀▀▀▀▀▄█▀         ▀████████████████▌            ▄▄█▌     ▀,  ▐██████████████████▄███████████████▌▄▄██████▄██████████")
      addLog("Cerberus Industries.")
      addLog(["MAC not whitelisted, ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Cerberus Off-Site Archive
    case "cerberusarch":
	  clearLogs()
	  addLog("█████████████████████████████████████████████████████████████████▌▀███▀███████████████████████████████████████     ██████████████████████████████████████▀    ═▄.▀███████████████████████████████████           ▀████████████████████████████████`     ,,,,   ▄██████████████████████████████▌   ▄█████▄▀▀▀███████████████████████████████▌ ▄█████████▄  ╙▀████████████████████████▌  ╙█ ███████████▌    ███████████████████████    ▀▄████████████     ▀████████████████████ ▄    ▀███████████▀      ▐████████████████▄,  ^      `▀▀▀▀▀▀▄█▀         ▀████████████████▌            ▄▄█▌     ▀,  ▐██████████████████▄███████████████▌▄▄██████▄██████████")
      addLog("Cerberus Industries Backup Services.")
      addLog(["MAC not whitelisted, ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Cerberus PD
    case "cerberuspd":
	  clearLogs()
	  addLog("█████████████████████████████████████████████████████████████████▌▀███▀███████████████████████████████████████     ██████████████████████████████████████▀    ═▄.▀███████████████████████████████████           ▀████████████████████████████████`     ,,,,   ▄██████████████████████████████▌   ▄█████▄▀▀▀███████████████████████████████▌ ▄█████████▄  ╙▀████████████████████████▌  ╙█ ███████████▌    ███████████████████████    ▀▄████████████     ▀████████████████████ ▄    ▀███████████▀      ▐████████████████▄,  ^      `▀▀▀▀▀▀▄█▀         ▀████████████████▌            ▄▄█▌     ▀,  ▐██████████████████▄███████████████▌▄▄██████▄██████████")
      addLog("Cerberus Police Department.")
      addLog(["MAC not whitelisted, ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Sai Carters Gun Emporium
    case "sai":
	  clearLogs()
	  addLog("                                                                                             ╕       ,,,,,╓╓╓╓,,                         ╫▓▄ææ▄▓▓▓▓█▓▓▓▓╢▓▓▓▓▓╣╬▓▓╫▓▓▓@╖,,,,,               `   `╙╙╙╙╙▀╜╜▐▓▓▓█▓▓▓▓▓▓▓▓▓▓╣▒▒@@@▓╖                     ╓▓▓█▒  ''█▓▌   ╙▀▀█▓▓▓▓`                   ╓▓▓█▓╜      ▓▓        ╙▀▀                    ╙▓▓╜                                                                                                                 ")
      addLog("                GUNS GUN GUNS")
      addLog(["ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Talon Encrypted Site
	case "talon":
	  clearLogs()
	  addLog("███████████████████▀▀▀^. ▀▀████████████████████████████████▀█████████████▄▄-▀█████████████████████████^██████████████████▄ ▀█████████████████████^▄██▄▀█████▀^██████▀███▄ ▀██████████████████ ▓████▄^└▀██ ▓ ███▀^█████▌ ▐████████████████r▐████ █v4▐█▌╙█▌██▄▀ █▀████▄ ████████████████ ▐████▄  ▄███   ███▄ ═██████ ▐███████████████ ▀████▌ █████ ▀ █████ ▀████▌ ▐███████████████ └████ ██████r╚▐███████████▌ █████████████████ ╙██████████▌ ███████████▀ ▄██████████████████▄ ██████████ ██████████▀,██████████████████████▄'▀████████████████▀▄██████████████████████████▄,▀▀███████████▄█████████████████████████████████▄▄▄▄███████████████████████")
      addLog("ßNÆ@╘j~.hw▄gMM╗j$gµéU'LjRY%╡ΦÜƒN∞&╕~")
      addLog(["¿─~.~Mw,µrM∞╦*hgw⌐░▓▄`L╓▓*φⁿΩf%h░╡░░", "▄j$g▄µéU~.hw▄,µrM∞╦*hg¿─~.~Mw,µrⁿ^Ωf%h⌐░▓▄`L"])
    break
	//Citizen - case Spades Easter Egg
	case "spades":
	  clearLogs()
	  addLog("██████████████████████▀███████████████████████████████████████████▌ ▐█████████████████████████████████████████▀   ╙██████████████████████████████████████▀' / \ └▀██████████████████████████████████▀ =,     ,≈⌐▀████████████████████████████████████▄, ,ÿ████████████████████████████████▀████████w^j████████▀███████████████████████  ▓██████▓`▄`▓██████▓  █████████████████████`┘ ╙ßN▀█▀▀ ███ ╙▀█▌Æ@▀ ╘j████████████████████ .   ─^  j██▓██⌐   ─   ~.█████████████████████hw▄gMM╗  `▀▒▀- ,▄j$g▄µé███████████████████████▄▄ ▐███▄U)'Lj▄███▌ ▄▄████████████████████████████████RY%╡Φ▀██████████████████████████████████████▄▌Üƒ]▐▐████████████████████")
      addLog("We face the new world. Together.")
      addLog(["UNAUTHORIZED DEVICE ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case InfoBattle
	case "infobattle":
	  clearLogs()
	  addLog("      ██████▐███ j████⌐██████▌ ,▄██████▄,           ▐██▌ ▐████▄ ▐██⌐███    ▐███-  '▀██▄          ▐██▌ ▐██▀██▄▐██⌐█████  ███      ███          ▐██▌ ▐██⌐ ▀████⌐███    ▀██▄    ▄██▀         ██████▐██U  ╙███⌐███     ^▀██████▀▀          ══════ ══     ══ ¬══         ¬¬          ████▄▄         ,██j▀▀█▀▀ ▀█▀▀ █      █▀▀▀▀▀       ▐█       ▄▀▐█   █    █   █      █       ▄▄▄▄▄█^     ╓█▀ ¬█   █    █   █      █▄▄▄         ▀█⌐   ▄▀   ¬█   █    █   █      █            ,█~ ▄█▀    ¬█   █    █   █      █       ▀▀▀▀▀▀  *▀       ▀   ▀    ▀   ▀▀▀▀▀▀ ▀▀▀▀▀▀ ")
      addLog("Subscribe today for HD images!")
      addLog(["[1-3] to view low-res images.", "Type 'disconnect' to disconnect from server."])
    break
//Citizen - case LSPI
    case "lspi":
	  clearLogs()
	  addLog("                 ,,,                                      ▄██▀▀▀████▄,▄▄▄▄                            ██   ▄█▀  █▀█▄▄▄'█▀N▄                       ██    ▀▄,  █▄ ██▀,▀ ▄▀                       █▌█▄    ▀▀█▄▀████▀▀`                         ▀█▄█▄       ▀██                               ▀██▄▀▀   ,▄██▄                                  ▀▀████▀▀ ██▄▀▄                                         ▀██▄▀▄                                         `▀█▄▀,                                          ¬███                                           ▀`           						")
      addLog("Los Santos Private Investigations")
      addLog(["Authorized devices only", "Type 'disconnect' to disconnect from server."])
    break
//Citizen - case Russian Embassy
    case "russian":
	  clearLogs()
	  addLog("                    ,,█,,                                ╓   ,   ▓████   ,   ,                       ╔▓çg▓▀▓$█▄▓▀█▄█▄▐▀▓g,▓▄                     ]▓▓▓▄, ▓▓▓▓▄ ,▓▓▓▓F,▄▓▓▓L                    Æ▓▓▓▓▓▓▓  ▀▓▓▓█  ▄▓▓▓▓▓▓▓                    -▓▓▓▓▓█▀` ▐▓▓▓▌  ▀▓▓▓▓▓▓N                     ▓╣▓▓▓▓█▄▓▓▓▓▀▓▓▄▓▓▓▓▓╣▓                       ▀▀▓▓▓▓▓▓▓▀▓▐▓▓▓▓▓▓▓▓▀                           ▀^▓▓▓▓▓██▓▓▓▓▀▀                            .╖╫╟▒$Ö╢▓▓▓▓Φ@$▒╬N╕                           ''^▄▓▓æ▒▒▀&▓▄▓^^'                              ▐▀▓▐▓▓▓▓▓▓▐▌▀                                    ▀▓╣▓▀                    					")
      addLog("Посольство России.")
      addLog(["MAC-адрес не внесен в белый список, ДОСТУП ЗАПРЕЩЕН", "Введите «отключить», чтобы отключиться от сервера"])
    break
//Citizen - Blaine County Savings
    case "bcs":
	  clearLogs()
	  addLog("                        ,▄▄▄▄,                                   ,▄█▀      ▀▄                               ▄█▀  ▄▄███▄▄  █                            ▄█▀ ,████▀▀▀███                            ╓█▀ ,███▀     ╙███                          ╓█▌ ▄██▀        ███                          ██ ▐██          ███                         ▐██ ▐█          ███`                          ██            ▄██▀                            ██▄,       ,███▀                              ▀▀███▄▄▄████▀                                    ▀▀▀▀▀▀                    ")
      addLog("Blaine County Savings")
      addLog(["Online Banking Currently Unavailable", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Pacific Standard Bank
    case "psb":
	  clearLogs()
	  addLog("                  ,▄▄gæ╦∞▄,                                ,0▀`   ▀ ⌠ ▄ ▄▀8▄                          ╓▀,▀ >▄═▀▀▐^▀═▄▌<▀,▀▄                       ▄^╚a╔▀ ▄▄▄▄¬⌐▄▄▄ ▀▄^▄'▌                     ▐Γ,▀A▀  ███▄;▄███⌐ ^▌╒p]▌                    ║ ▄ ║ , ████▄██▄█ , ▐ * ▐                    ╟CT═▐   ▌  ^▐^      █ ⁿ═█                     ▌▀▄^▌   ,═ ▐ ═,`  ▄Ç▄▀▄^                      ▄⌐r,▀N, '═▄⌐^ ,4▀²φ,▄▀                        ▀▄.⌐ ,Γ▀▀P▀▀▄``Y.▄▀                             ▀═▄▄▀.,.Å▄▄P▀                ")
      addLog("Pacific Standard Public Deposit Bank")
      addLog(["Online Banking Currently Unavailable", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Penris
    case "penris":
	  clearLogs()
	  addLog("                   ,▄▄▄▄▄,                                ,▄███▀   ▄   ▀███▄,                       ,▄████    '███`    ████▄,                  ,██████ ▄▄█▄⌐▀ ▀-▄█▄▄ ██████                ▐██████▌  ▀▀▌     ▐▀▀  ▐██████▄               ▀█████▌    ▐     ▌    ██████▀                  ▀████▄  ▐██  '██▌  ▄████▀                       ▀███▄        ,▄███▀                              `▀▀▀═M═▀▀▀`                 ")
      addLog("Penris Financial Services")
      addLog(["Online Banking Services [ DOWN ]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Digital Storage Solutions
    case "dss":
	  clearLogs()
	  addLog("                   ,╓╦╦╦╖,                                   ,@▓╜    `╙▓W                               ,╔▓           ▓µ,                        g▓▀╜╙▓             ▓^╙▀▓W                  á▓`                       `▓W               ╒▓                           ▓╕              ▐▓     ╓╖╖╖,   ╓╓,  ╓╓,      ▓▓               ▓╗       `╟▓ ╢╣ ╜ ╢╣ ╜     ╓▓                 ▓▓,      ]╢∩,`╙▓╖,`╙▓   ,▓▓                    ^▀Ñ╚ÑÑÑ╩` ╙╩Ñ╝ ╙╩Ñ╝x▓▀╜           	   ")
      addLog("Digital Storage Solutions")
      addLog(["Device not recognized ACCESS DENIED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Maze Bank
    case "maze":
	  clearLogs()
	  addLog("           ╗╥╥╥╗╥╥╗╗╗╥╖╥╥╥╖╖╗╗  ╓╦                      ▓▓▓▓▓▓▓▓▓▓▓▀▀▀▀▀▓▓▓  ▓▓U                     ▓▓  ╖╖  ▓▓▌  ╖╖  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ▓▓▌ ]▓▓  ▓▓  ▓▓U                     ▓▓  ▓▓  ╨▀╜ ]▓▓  ▀▀  ▓▓U                     ▓▓  ▓▓▄╥╖╖╖╥▓▓▓╥╖╥╥╥╥▓▓U                     ▀▀  ╜╜╜╜╜╜╜▀╜╜╜╜╜╜╜╜╜╜╜    ")
      addLog("Maze Banking Services")
      addLog(["Unrecognized Device Contact System Admin", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Lombank
    case "lombank":
	  clearLogs()
	  addLog("           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▄                            ▓▓▒       ╟▓▓▀╙▓▓▓▄                          ▓▓▒       ╟▓`   ╙▓▓▓▌                        ▓▓▒       ╟▓      ╙▓▓▓▄                      ▓▓▒       ╟▓      g▓▓▓▓▌                     ▓▓▒       ╟▓    g▓▓▓▓▓▓▌                     ▓▓▒       ╟▓ ,@▓▀    ▓▓▌                     ▓▓▒       ╟▓▓▓▀      ▓▓▌                     ▓▓▒       ╟▓╜        ▓▓▌                     ▓▓▓µµµµµµµ▓▓@µµµµµµµ@▓▓▌                     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀Γ          ")
      addLog("Lombank Financial Services Multinational")
      addLog(["Device not whitelisted IP logged", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Kayton
    case "kayton":
	  clearLogs()
	  addLog("                   ,▄▄@▌▄ ,,⌐                               ▄▄███▓▓╢▓▓▓██▄                             ▄███╣▓▓▓╢█╣▓▓▓╢███,                         ███╣╢▓▓▓╢█▓█▓█▓▌▓███▄                       ███▓╫██▓▓╫▌█▓████▓▓███Ç                      ███╢▓▓▓▓▓▓▌▓█████▓▓▓███                      ███████████╢██████╣▓██▓`                     ██████████████████▌▓███                      █████████████████▌████▌                       ████████████████▓███▀                         ▀█████████████▌███▀                            ▀████████████▀▀                                  ^▀▀▀▀▀                    		   ")
      addLog("Kayton Banking Group")
      addLog(["UNAUTHORIZED ACCESS DETECTED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Union Depository
    case "udepot":
	  clearLogs()
	  addLog("                    ,▄▄,,                                    ,▄█████████,                                ████▀▀- ^▀███▄                              ████       ╙███▌                             ▐███         █▀▀                              ████                                          ████▄▄▄▄▄▄▄▄▄▄▄                              ███████████████                              ███▌  ▄█▄  ▐███                              ███▌  ██▀  ▐███                              ███▌  ▀▀▀  ▐███                              ▐███▄▄  ,▄▄███▀                                ▀█████████▀'                                    `▀▀▀`                   ")
      addLog("Union Depository")
      addLog(["Undergoing Maintenance Services Unavailable", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - International Online Unlimited
    case "iol":
	  clearLogs()
	  addLog("                      ▄,                                         ▄██▀▄,                                    ,▄█▀   ▀▄█▄                                ▄██▀▄▄  ▄██▀▄█m                            ▄██▀▄██▀▄██▀▄██▓██W                       ,▄██████▓██▀` ▀▀▄██▀▄██M                     ▀▀▄██▀▄██▀▄   ▄██▀▄██▀▄██^                     ^▀▄██▀▄██▀▄██▀▄██▀▄██▀                          ▀███▓███▀███▓██▀                               <██▀    ▄██▀                                   ª██─▄██▀                                       *█▀                     					")
      addLog("International Online Unlimited")
      addLog(["Unauthorized User Detected", "Type 'disconnect' to disconnect from server."])
    break
	//POLICE DEPARTMENTS
	//Citizen - Davis PD
    case "dpd":
	  clearLogs()
	  addLog("            ,                   ,                      ,╔▓▓▓@▓▓▓@▓▓▓▓▓@▓▓▓@▓▓▓▄.                    Ω╣▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╢M                   ]▐▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌L                  ║╟▓█▌▓▓╣╫███▓▓╣▓╢╢╢╢╢╢▓▓▓▓[                  ]╟▓██████████████▓███▓╫█╢▓[              ▄▄▄▄▄▄███████████████████████▌▄▄▄▄▄          ▐█████▌ ████^.,,,║ ▄▄,'` ,, ▀█████▌           ▀██▄█▌ ▀▀▀█∞∞∞∞ ├ █▄▄▄▌ ▀▀ ▐█▄███             ▀██████████████████████████████                     >▀▓╣▓▓▓▓▓▓▓▓▓╣▓▀<                               ^╜▀▓▓╣▓▓▀╙^                                       '`                     					  ")
      addLog("Davis Police Department")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Vinewood PD
    case "vpd":
	  clearLogs()
	  addLog("            ,                   ,                      ,╔▓▓▓@▓▓▓@▓▓▓▓▓@▓▓▓@▓▓▓▄.                    Ω╣▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╢M                   ]▐▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌L                  ║╟▓█▌▓▓╣╫███▓▓╣▓╢╢╢╢╢╢▓▓▓▓[                  ]╟▓██████████████▓███▓╫█╢▓[              ▄▄▄▄▄▄███████████████████████▌▄▄▄▄▄          ▐█████▌ ████^.,,,║ ▄▄,'` ,, ▀█████▌           ▀██▄█▌ ▀▀▀█∞∞∞∞ ├ █▄▄▄▌ ▀▀ ▐█▄███             ▀██████████████████████████████                     >▀▓╣▓▓▓▓▓▓▓▓▓╣▓▀<                               ^╜▀▓▓╣▓▓▀╙^                                       '`                     					  ")
      addLog("Vinewood Police Department")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - State Troopers PD
    case "saspd":
	  clearLogs()
	  addLog("           ,,         ,         ,,                     ╔▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                     ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓                   ▐▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                   ▐▒▓█▒▒▒▒▒███▒▒▒▒▒▒███▒▒▌▓╢⌐                  ▐▒▓█▓████████▌▄▄█████████▌               ▄▄▄▄▄█████████████████████████▄▄▄▄▄          ▐█████ ▄▄▄▄██▀ ^██▀,▄▄▄█ ▄▄▄`█████▌           ▀████▄▄▄∞ █^,▀  █▄▄▄▄ ▐ █▄▄▄█████             ▀█████████████████████████████▀                     ▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀                               ╙╝▒▒▒▒╣▒▒╩╢                                      `^`                     ")
      addLog("San Andreas State Patrol")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - San Andreas State Park Rangers
    case "sasprd":
	  clearLogs()
	  addLog("           ,,         ,         ,,                     ╔▓█████████████████████▓                     ▓████████▀▀▀██▓█████████▓                   ▐▓████████▌▓▓▓▓▓▓████████▌                   ╟██▓██████████▓███████████⌐                  ║████████████████▓████████M              ▄▄▄▄▄█████████████████████████▄▄▄▄▄          ▐████▀▀▀▀██▀██▀▀█▀▀▀▀█▀▀▀▀▀▀▀▀████▌           ▀███ █.4█,▀ █ ▄ j ▀═▐ ══▐ █ +████             ▀█████████████████████████████▀                     ▀██████████████▀'                               ^▀██████▀▀^                ")
      addLog("San Andreas State Park Rangers")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Senora Desert Sheriff's Office
    case "sdso":
	  clearLogs()
	  addLog("                ╓@╫▒▓▒█▓▒▒Üp,                             ╓Ñ▒▒▀▒▒▒▒▒▒▒▒▒▒▓▒╥                          ╣▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╣                        ╓▒▒▒▒▒▓▓▓▓▓▓▓██▓▌▒▒▒▒╢                       ╢╣╣▒▓▓▓▓▓▓████▌▓▓▓▒╢╢╢U                      ╣╢╢▓▓▓▓▓╢██████▓▓╢▓╢╢╢                       ▐█▒▒▒████████████▌▒▒▓█                        ║▒█▒▀██████████▀▒▓▒▒`                         '╢▀▓▄▒▒▀▀▀▀▀▒▒█▓▒╜                              ╙╝▓▀▓█▒█▀▒▓╜`                ")
      addLog("Senora Desert Sheriff's Office")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Department of Corrections
    case "doc":
	  clearLogs()
	  addLog("                    ▄▄                                          ╒██L                                        ╓▄███▄▄ ,▄▀▀∞⌐                              ▄█████▀ ▀  . /                            , █▀ ████   ╙▀▀ ▀▀                        █⌐ ▐█▄  ████▌      █                        ^█▌ '▀█ ¬████▌      █▌                        ██    ▓ ████      ▐█▀                        ▀█▌,   ▓████    ,J█▀                          '▀▀N▄  ████  ,▄█▀▀                             `▓███▐▌▄▌▄███▀                                   ^ ▀▀'`                    ")
      addLog("Department of Corrections")
      addLog(["Internal Network Users only: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - City Hall Records Department
    case "chall":
	  clearLogs()
	  addLog("                    ,,,,,                                   ╓m▓▌▓▒▒▓▌▓▀▓▓N▄                           ,Φ▓▒▒▒▀▀▀▒▓▒▀▀▀▀▒▒▓▓,                       &█▌▀▀▓▓▓▓▀▀██▓██▓▓▓▓█▓▓                     ▓▒▐▌ █████▀ ██▄▐█&&&&▓▌▒▓                   ╢▓▒▐▌ █▌▀▌▐  ▓ææææææææ▓▌▒▓▓                  ▓▄██▌ ▀▀▓▀▀▓ ▓ææææææææ▐▌█▄▓                  ▓▒████▒▒▒██▒▒█--▐█ ---▐▓█▒▓                  ▒▓▀▐█▓▒▒███▌▒▓  ▄██▄  ▐▌▀▓▓                   ▀▒▐█▓▐███▓▒▒▓ ' ██▌▀ ▐▌▒▓`                    ╨▓██▀▀▀▀█▀▀▓  ▄█,█µ,▓▓▌                       `▀▓▀▓▓▄▓▒▒▓ ,,▄▄▓▀▓▓`                           ^╜▒▒▒▓▓█▓▓▒▒▒╨^               ")
      addLog("City Hall Records Department")
      addLog(["Unrecognized Device: [Access Denied]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - Los Santos International Airport
    case "lsia":
	  clearLogs()
	  addLog("      ▀██░▒▒░░░░░▄░░░░▒░▀█▄,                         ▀██▄▒░░▒░▀██▄░░▄▄████,                         ▀██▄░░░░░▀█████▀▓█▓██▄                         ^██▄░░▒▄███████▓██▓██▄                         ^▀██▄██▓██▀█▄█▌░▀█▄▀█▄                          ▀██▓██▓█▒█▓▄▀█▄▀█▄▀██,                         ▀██▄▀█▄▓█▓██▓██▀██▀█-                          ▀██▄▀█▄▀█▓██▓██▓██                             ▀██▄▀█▄▀█▄▀█▄▀██-                              ▀███▓██▀██▀█▄█                                  ▀▀▀▀▀▀▀▀▀▀▀      ")
      addLog("Los Santos International Airport")
      addLog(["Online Ticketing Service: [ OFFLINE ]", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - IAA
    case "iaa":
	  clearLogs()
	  addLog("                     ,╓╓                                        ╣╢▒▒╖▄██▄                                    ║▒▒▒▒▀▀^^                                   ╓▓▓▓▓▓▓                                  *M▀¢¢P▀Ñ¢▓▀Ñ¢▀▀H⌐                           ▄▀▌▀▀▀▀▀▀▀▀▀▀▀▀▀▀█,                       ██▌█▐              j▐▌██▌                 ▐██ █ █▐ ╓@▓╝` ▄ ^╫▓@╖j▐▌-█ ██                █  █ █▐▓╣╣`-▄▄█▄▄ ║╣╢╫▐▌ █ ▐▌               ╘█▌ █ █▐╢╣╢Ç  ███  ╟╢╢▒▐▌ █ ██                ▀ ,█.█▐█▓▓╢N,  ,╓▓▒▄█▓▐▌,█                     └█ █▐█▓██▓██▓▌█▓▌██▓▐▌╘█                         ██▓██▓██▓▌█▓██▓█▀		        			  ")
      addLog("International Affairs Agency")
      addLog(["ACCESS DENIED IP HAS BEEN LOGGED", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Hacked
    case "hacked":
	  clearLogs()
	  addLog("   ,, ╓▒░▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░, ,,     ▐█████▄░░░░░░░░░░░░░░░░░░░░░░░░░░░▄▄█████    ▄██████▌░▄██████▄ ░░░░░░▄██████▄ ^██████▄    ▀██████▌░░░░░░^███▄░░░╒███▀ ░░░  ▐██████▀    '███▀░░░░░░░░░░░▀▀░░░░░▀▀ ░░░░░░░░ ▀▀███▀       ░░░▒░░░╒█████░░▒░░░░░ ▄████▄░░░░░░░          ╙░░░░░░▀▀▀▀▀▀▀░░░░░░░▀▀▀▀▀▀▀░░░░░░`            ║░▄▄ ░░░░░░▒░░░░░░░░░░░░░░░▄▄,░              ▄██ ░░░░░▄▄█▄,░░░,▄▄█▄ ░░░░░▐█▄              ███▄,░,▄███████████████▄,░ ▄███▌             ███████████████████████████████               ▀█████████WE OWN YOU████████▀                  -▀▀▀█████████████████▀▀▀                         ╙╢▒▒▒░░░░░░░▒▒▒▒╜                              ╠░░░░░░░░░░░▒                ")
      addLog("             WE ARE THE WATCHERS             ")
      addLog(["           This is our system now.           ", "Type 'disconnect' to disconnect from server."])
    break
	//Citizen - case Watchers Shop
	 case "watchers":
      clearLogs()
      if (!findFile(devices[playerHost].files, ["Users","admin","Applications","bank.exe"], "bank") || currentBank === "") {
        addLog("ERROR - Bank account not found.")
        networks[watchersIP].data.pos = -1
        break
      } else {
        networks[watchersIP].data.pos = 0
		addLog("   ,, ╓▒░▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░, ,,     ▐█████▄░░░░░░░░░░░░░░░░░░░░░░░░░░░▄▄█████    ▄██████▌░▄██████▄ ░░░░░░▄██████▄ ^██████▄    ▀██████▌░░░░░░^███▄░░░╒███▀ ░░░  ▐██████▀    '███▀░░░░░░░░░░░▀▀░░░░░▀▀ ░░░░░░░░ ▀▀███▀       ░░░▒░░░╒█████░░▒░░░░░ ▄████▄░░░░░░░          ╙░░░░░░▀▀▀▀▀▀▀░░░░░░░▀▀▀▀▀▀▀░░░░░░`            ║░▄▄ ░░░░░░▒░░░░░░░░░░░░░░░▄▄,░              ▄██ ░░░░░▄▄█▄,░░░,▄▄█▄ ░░░░░▐█▄              ███▄,░,▄███████████████▄,░ ▄███▌             ███████████████████████████████               ▀████████hello friend████████▀                 -▀▀▀█████████████████▀▀▀                         ╙╢▒▒▒░░░░░░░▒▒▒▒╜                               ╠░░░░░░░░░░▒                ")
        addLog("             WE ARE THE WATCHERS             ")
        addLog(["[1] to purchase items.", "Type 'disconnect' to disconnect from server."])
      }
      break
	//Citizen - case Payphone
    case "payphone":
	  clearLogs()
	  addLog("                ,,▄▄▄▄▄▄▄▄▄▄▄,,                          ▄███████████████████▓▓▄                    ,███▓▓█▄▓▓▓▓╣▓▓▓▓▓▌██▓▓▓█▌                   ██████▀▀▓▓▓█▒▒▒█▓▓▓███████                  ▐█'▀`   ▐▓█▓▓███▓▓██▌    -                  ,█▌    ╓▓▓▓█████████▓▓▄,                    ▄█▀    ███████████████████▄                ]██▄▄▄███▓▓▓▓▓███████████████                 -`      ▓██▓███████████████▌           ")
      addLog("Where Hard Lines are still cool")
      addLog(["[1-2] to view listings.", "Type 'disconnect' to disconnect from server."])
    break
  }
}

// Enters an instance.
function enterInstance(inst) {
  instance = inst
}

// Prints a network menu.
function printMenu(items, page, title, logs) {
  clearLogs()
  var list = []
  for (var i = 0; i < items.length; i++) {
    var line = "[" + i + "] " + items[i][0] + " - "
    line += items[i][1] + " F-Coin"
    list.push(line)
  }
  var menu = printHelp(title, list, page, 10)
  addLog(menu)
  addLog(logs)
}


// Prints the watcher shop menu.
function printWatchers() {
  printMenu(networks[watchersIP].data.items, networks[watchersIP].data.page, "The Watchers Dark Market:", ["Type 'back' to exit.", "Type 'buy' <INT> to buy an item.", "Type 'page <INT>' to switch shop page."])
}	  

// Runs the watcher website instance.
function doWatchers(command) {
  var back = false
  var line = ["[1] to purchase items.", "Type 'disconnect' to disconnect from server."]
  switch (networks[watchersIP].data.pos) {
    default:
      noCommand = true
      break
    case 0:
      switch (command) {
        case "1":
          networks[watchersIP].data.page = 1
          networks[watchersIP].data.pos = 1
          printWatchers()
          break
        default:
          noCommand = true
          break
      }
      break 
    case 1:
      printWatchers()
      if (command === "back") {
        back = true
        break
      }
      if (command.slice(0, 5) === "page ") {
        var part = command.slice(5, command.length)
        if (!isNumber(part, -1) || Number(part) > (networks[watchersIP].data.items.length / 10) + 1) {
          addLog("ERROR - Index nonexistant.")
          break
        }
        if (Number(part) === (networks[watchersIP].data.items.length / 10) + 1) {
          addLog("ERROR - Cannot change pages to current page.")
          break
        }
        networks[watchersIP].data.page = Number(part)
      }
      if (command.slice(0, 4) === "buy ") {
        var part = command.slice(4, command.length)
        if (!isNumber(part) || Number(part) >= networks[watchersIP].data.items.length) {
          addLog("ERROR - Index nonexistant.")
          break
        }
        if (networks[bankIP].data.accounts[currentBank][1] < networks[watchersIP].data.items[Number(part)][1]) {
          addLog("ERROR - Insufficiant money for purchase.")
          break
        }
        var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
        if (downloads === undefined || downloads.type !== undefined) {
          addLog("ERROR - Folder 'Downloads' nonexistant.")
          break
        }
        networks[bankIP].data.accounts[currentBank][1] -= networks[watchersIP].data.items[Number(part)][1]
        clearLogs()
        copyFile(networks[watchersIP].data.items[Number(part)][2], downloads, networks[watchersIP].data.items[Number(part)][0])
        addLoadingBar("Grabbing", 3000, ["Copied 1 item to downloads."], "printWatchers")
      }
      break
  }
  if (back) {
    networks[watchersIP].data.pos = 0
    clearLogs()
    addLog(line)
  }
}	 

// Citizen - Runs the Payphone instance.
function doPayphone(command) {
  var back = false
  var line = ["[1-2] to view listings.", "Type 'disconnect' to disconnect from server."]
      switch (command) {
        case "1":
			clearLogs()
			addLoadingBar("Getting Numbers", 1000, [["DARK MARKET         (999)258-3036                                                         Mirror Park         (111)3723-701            Chico's Hypermarket West Mirror Drive                                                     Rancho              (999)554-1372            Liquor store Macdonald St and Jamestown St                                                LSIA                (999)171-2487            Escalera Rental car park Metro platform                                                   Vespucci Beach      (999)379-7900            Steamboat Beers Palomino Avenue                                                           West Vinewood       (111)734-4924            Liquor Hole opposite Tequi-la-la             "], line], "clearLogs")
          break
        case "2":
			clearLogs()
			addLoadingBar("Getting Numbers", 1000, [["Davis Quartz        (111)796-9799            Rex's Diner on Senora Way                                                                 Tatavium Mountains  (999)409-7269            Ron Oil Gas - 24/7 Supermarket                                                            Paleto Bay          (111)422-8395            Globe Oil near Paleto Great Ocean Highway                                                 Lago Zancudo        (111)968-8284            RON gas station on Route 68                                                               Richman Glen        (111)159-2574            LTD gas station on North Rockford Drive      "], line], "clearLogs")
          break		  
        default:
          noCommand = true
          break
      break
 
	}
}

// Citizen - Runs the mentor instance.
function doMentor(command) {
  var back = false
  var line = ["[1-9] to view page of manifesto.", "Type 'disconnect' to disconnect from server."]
      switch (command) {
        case "1":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["              ==Phrack Inc.==	                  Volume One, Issue 7, Phile 3 of 10        =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=         The following was written                   shortly after my arrest...                                                             ^^^^The Conscience of a Hacker^^^^                         by                                     +++The Mentor+++                                                                     Written on January 8, 1986           =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="], line], "clearLogs")
          break
        case "2":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["Another one got caught today, it's all over  the papers.  'Teenager Arrested in Computer  Crime Scandal', 'Hacker Arrested after Bank  Tampering'... Damn kids.  They're all alike.                                              But did you, in your three-piece psychology  and 1950's technobrain, ever take a look     behind the eyes of the hacker?  Did you ever wonder what made him tick, what forces       shaped him, what may have molded him? I am a hacker, enter my world... Mine is a world    that begins with school...                   "], line], "clearLogs")
          break
		case "3":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["I'm smarter than most of the other kids, thiscrap they teach us bores me... Damn          underachiever.  They're all alike.                                                        I'm in junior high or high school.           I've listened to teachers explain for the    fifteenth time how to reduce a fraction.  I  understand it.  'No, Ms. Smith, I didn't     show my work.  I did it in my head...' Damn  kid.  Probably copied it.                    They're all alike.                           "], line], "clearLogs")
          break
		case "4":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["I made a discovery today. I found a computer.Wait a second, this is cool.  It does what I want it to.  If it makes a mistake, it's     because I screwed it up.  Not because it     doesn't like me... Or feels threatened by me.Or thinks I'm a smart ass... Or doesn't like teaching and shouldn't be here... Damn kid.  All he does is play games.                   They're all alike.                           "], line], "clearLogs")
          break
		case "5":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["And then it happened... a door opened to a   world... rushing through the phone line like heroin through an addict's veins, an         electronic pulse is sent out, a refuge from  the day-to-day incompetencies is sought... a board is found. 'This is it... this is where I belong...' I know everyone here... even if I've never met them, never talked to them,   may never hear from them again... I know you all... Damn kid.  Tying up the phone line a  gain.                                        They're all alike...                         "], line], "clearLogs")
          break
		case "6":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["You bet your ass we're all alike... we've    been spoon-fed baby food at school when we   hungered for steak... the bits of meat that  you did let slip through were pre-chewed and tasteless.  We've been dominated by sadists, or ignored by the apathetic.  The few that   had something to teach found us willing      pupils, but those few are like drops of waterin the desert.                               "], line], "clearLogs")
          break
		case "7":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["This is our world now... the world of the    electron and the switch, the beauty of the   baud.  We make use of a service already      existing without paying for what could be    dirt-cheap if it wasn't run by profiteering  gluttons, and you call us criminals.         We explore... and you call us criminals.     "], line], "clearLogs")
          break
		case "8":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["We seek after knowledge... and you call us   criminals.  We exist without skin color,     without nationality, without religious bias..and you call us criminals. You build atomic  bombs, you wage wars, you murder, cheat, and lie to us and try to make us believe it's forour own good, yet we're the criminals.                                                    Yes, I am a criminal.  My crime is that of   curiosity.  My crime is that of judging      people by what they say and think, not what  they look like. My crime is that of          outsmarting you, something that you will     never forgive me for.  "], line], "clearLogs")
          break 
		case "9":
			clearLogs()
			addLoadingBar("Loading Page", 1000, [["I am a hacker, and this is my manifesto.  Youmay stop this individual, but you can't stop us all... after all, we're all alike.                                                                                  +++The Mentor+++"], line], "clearLogs")
          break
        default:
          noCommand = true
          break
      break
 
	}
}

// Citizen - Runs the InfoBattle instance.
function doInfoBattle(command) {
  var back = false
  var line = ["[1-3] to view low-res images.", "Type 'disconnect' to disconnect from server."]
      switch (command) {
        case "1":
			clearLogs()
			addLoadingBar("Loading Image", 1000, [["╣▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╢▓▓▓▒▓▒╢▓▓╣╫▓▒▒▒▒▒▒▒▒▒▒▒███████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▒▒▒▓▒▓▓╫▓▒▒▒▒▒▒▒▒▒▒▐█████▓█▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▒▒╢▓▒╫▓▓▓▒▒▒▒▒▒▒▒▒▒█▌████▒▒█▒▒▒╢╣╣╣╣╣╣╣╣╣╬▓▓▓▒▒▓▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒█▒▒██▌▓▒█▒▒╢╢▓▓▓▓▓▓▓▓▓▓▓▓▓▒╫▒▒▒▒▓▓▓▒▒▒▒▒▒▒▒▒▒█▒█████▓█▒▒╢╣╣╣╣▓▓▓▓▓▓▓▓▓▓▒▓▒▒▒▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒█████▒▒▒▒╢╫▓▓▓▓╣╣╣╣▓▓▓▓▓▓▓▓▓▓▓╣╫▓▓╢▒▒▒▒▒▒▒▒▒▒█▀▀████▄▒╢╢╣╣╣╣╣╣╣▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╣▒▒▒▒▒▒▒▒▒▒█▒▒▒██▒▒▒╢╢╣╣╣╣╣╣╣▓▓▓▓▓▓╣▓╣▒▒▒╢▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒█▓▓▓█▒▒▒╢╢╣╣╣╣╣╣╣▓▓▓▓▓▓▒▒▓▓▒▒╢▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒█╢╣╢█╣▒▒╢╢╣╣╣╣╣╣╣▓▓▓▓▓▓▒▒▓▓▒▒╢▓▓▓▒▒▒▒▒▒▒▒▒▒╙▀▀╢╣╢▀╣▒▒╢╢╣╣╣╣╣╣╣▓▀▀▀▀▀"], line], "clearLogs")
          break
        case "2":
			clearLogs()
			addLoadingBar("Loading Image", 1000, [[" FILE CORRUPTED "], line], "clearLogs")
          break
		case "3":
			clearLogs()
			addLoadingBar("Loading Image", 1000, [[" FILE MISSING "], line], "clearLogs")
          break
        default:
          noCommand = true
          break
      break
 
	}
}

// Citizen - Runs the chat BBS instance.
function doChatBBS(command) {
  var back = false
  var line = ["[1-4] to open page of chat archive.", "Type 'disconnect' to disconnect from server."]
      switch (command) {
        case "1":
			clearLogs()
			addLoadingBar("Loading Archive", 3000, [["CHAT SERVER UNAVAILABLE - ARCHIVE PG 1/3                                                  <Zerocool>: Mess with the best die like the  rest                                         <Mitnick>: Lock me back up jesus...          <Cereal>: HACK THE PLANET!	                  <Plague>: hack the plaanneettttt             <FishSword>: You fuckin nerds                <Root>: Any tools for WPA or AQT cracking?   <Citizen>: No working on em so just WEP 4 now<SimonSays>: Buying LI passwords and logs    <5cr1ptk1d>: Got you Si need X for wepcrack  <Citizen>: Cracked a hole new cmd out soon   "], line], "clearLogs")
          break
        case "2":
			clearLogs()
			addLoadingBar("Loading Archive", 3000, [["CHAT SERVER UNAVAILABLE - ARCHIVE PG 2/3                                                  <CaseDecker>: They need to fire Altas admin  <Whistler>: Citizen whats the new cmd?       <Ester_Nairn>: New target network?           <Citizen>: A test                            <Jones>: Test for what?                      <FishSword>: Just saw it no way fuck that C  <Citizen>: Your loss F. Run it and see Jones <Zerocool>: Where do I install exe files?    <CaseDecker>: Thats a real spicy network C	  <5cr1ptk1d>: Fleeca is giving away F-Coin whenyou sign up for a new account no auth!!!     "], line], "clearLogs")
          break
		case "3":
			clearLogs()
			addLoadingBar("Loading Archive", 3000, [["CHAT SERVER UNAVAILABLE - ARCHIVE PG 3/3                                                  <Lord Nikon>: Valued some files pushing now  <Citizen>: 0cool Apps go in Applications     <Gibson>: Buying Alta Apts backdoors         <Zerocool>: How do I make backdoors?         <Citizen> has left the chat.                 <SimonSays>: Once you guess the 4 digit code just solve it then create one dumbass        <Zerocool>: This is stupid can I just click abutton or something?                         <SimonSays>: Just DISCOVER it for urself noob<FishSword>: Scanning networks & devices sux "], line], "clearLogs")
          break
		case "4":
			clearLogs()
			addLoadingBar("Loading Archive", 3000, [["CHAT SERVER UNAVAILABLE - ARCHIVE PG 4/4                                                  <D0lrezH4ze>: The bank links are gone?       <samsepi0l>: Gotta scan all the networks now <th3g3ntl3man>: No more typing value just -v <Citizen> has entered the chat.              <Citizen> The old cmd is pretty hot use at   your own risk, new holes coming soon CZN     <morfixx> Fixed those issues you were having <Citizen>: Legend                            <Gibson>: Payphone wiring fucking sucks!     <phr3@k>: Ring em twice they will connect    "], line], "clearLogs")
          break  		  
        default:
          noCommand = true
          break
      break
 
	}
}

// Runs the fence website instance.
function doFence(command) {
  var back = false
  var line = ["[1] to download the file trading application.", "Type 'disconnect' to disconnect from server."]
  switch (command) {
    case "1":
      clearLogs()
      var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
      if (downloads === undefined || downloads.type !== undefined) {
        addLog("ERROR - Folder 'Downloads' nonexistant.")
        addLog(line)
        break
      }
      copyFile(networks[fenceIP].data.files["sell.exe"], downloads, "sell.exe")
      addLoadingBar("Grabbing", 3000, [["Copied 1 item to downloads."], line], "clearLogs")
      break
    default:
      noCommand = true
      break
  }
}

// Prints the shop menu.
function printShop() {
  printMenu(networks[shopIP].data.items, networks[shopIP].data.page, "Milk Road Shop:", ["Type 'back' to exit.", "Type 'buy' <INT> to buy an item.", "Type 'page <INT>' to switch shop page."])
}

// Runs the shop website instance.
function doShop(command) {
  var back = false
  var line = ["[1] to purchase items.", "[2] to download a shortcut for the shop.", "[3] to access file guidelines.", "Type 'disconnect' to disconnect from server."]
  switch (networks[shopIP].data.pos) {
    default:
      noCommand = true
      break
    case 0:
      switch (command) {
        case "1":
          networks[shopIP].data.page = 1
          networks[shopIP].data.pos = 1
          printShop()
          break
        case "2":
          clearLogs()
          var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
          if (downloads === undefined || downloads.type !== undefined) {
            addLog("ERROR - Folder 'Downloads' nonexistant.")
            addLog(line)
            break
          }
          copyFile(networks[shopIP].data.files["shop.cmd"], downloads, "shop.cmd")
          addLoadingBar("Grabbing", 3000, [["Copied 1 item to downloads."], line], "clearLogs")
          break
		// Citizen - Installation Guide
		case "3":
			clearLogs()
			//Chat limits guide line			 ---------------------------------------------
			addLoadingBar("Connecting", 3000, [[" -All application .exe files go in your local   Applications folder.                                                                     -Program .cmd files go in your local         Documents/Programs sub-folder."], line], "clearLogs")
          break
        default:
          noCommand = true
          break
      }
      break
    case 1:
      printShop()
      if (command === "back") {
        back = true
        break
      }
      if (command.slice(0, 5) === "page ") {
        var part = command.slice(5, command.length)
        if (!isNumber(part, -1) || Number(part) > (networks[shopIP].data.items.length / 10) + 1) {
          addLog("ERROR - Index nonexistant.")
          break
        }
        if (Number(part) === (networks[shopIP].data.items.length / 10) + 1) {
          addLog("ERROR - Cannot change pages to current page.")
          break
        }
        networks[shopIP].data.page = Number(part)
      }
      if (command.slice(0, 4) === "buy ") {
        var part = command.slice(4, command.length)
        if (!isNumber(part) || Number(part) >= networks[shopIP].data.items.length) {
          addLog("ERROR - Index nonexistant.")
          break
        }
        if (networks[bankIP].data.accounts[currentBank][1] < networks[shopIP].data.items[Number(part)][1]) {
          addLog("ERROR - Insufficiant money for purchase.")
          break
        }
        var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
        if (downloads === undefined || downloads.type !== undefined) {
          addLog("ERROR - Folder 'Downloads' nonexistant.")
          break
        }
        networks[bankIP].data.accounts[currentBank][1] -= networks[shopIP].data.items[Number(part)][1]
        clearLogs()
        copyFile(networks[shopIP].data.items[Number(part)][2], downloads, networks[shopIP].data.items[Number(part)][0])
        addLoadingBar("Grabbing", 3000, ["Copied 1 item to downloads."], "printShop")
      }
      break
  }
  if (back) {
    networks[shopIP].data.pos = 0
    clearLogs()
    addLog(line)
  }
}

// Runs the banking website instance.
function doBank(command) {
  var back = false
  var line = ["[1] to create an account.", "[2] to download the Fleeca Banking App.", "Type 'disconnect' to disconnect from server."]
  var unametext = ["Enter a Username: (type 'back' to exit)"]
  var pwordtext = ["Enter a Password: (type 'back' to exit)"]
  var parsed = command.replace(/["]/g,"")
  switch (networks[bankIP].data.pos) {
    case 0:
      switch (command) {
        case "1":
		//Citizen check bankaccounts value
		if (bankaccounts !== 3) {
			networks[bankIP].data.pos = 1
			clearLogs()
			//Citizen - bank account limits
			bankaccounts = bankaccounts+1
			addLog(unametext)
		}
		else addLog("ERROR - Too many accounts created on this IP.")
		//Citizen end of account check
          break
        case "2":
          clearLogs()
          var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
          if (downloads === undefined || downloads.type !== undefined) {
            addLog("ERROR - Folder 'Downloads' nonexistant.")
            addLog(line)
            fail = -1
            break
          }
          copyFile(networks[bankIP].data.files["bank.exe"], downloads, "bank.exe")
          addLoadingBar("Grabbing", 3000, [["Copied 1 item to downloads."], line], "clearLogs")
          break
        default:
          noCommand = true
          break
      }
      break
    case 1:
      if (command === "back") {
        back = true
        break
      }
      clearLogs()
      addLog(unametext)
      if (networks[bankIP].data.accounts[parsed] !== undefined) {
        addLog("Username already taken.")
        break
      }
      if (parsed.length < 1) {
        noCommand = true
        break
      }
      networks[bankIP].data.tempUser = parsed
      networks[bankIP].data.pos = 2
      clearLogs()
      addLog(pwordtext)
      break
    case 2:
      if (command === "back") {
        back = true
        break
      }
      clearLogs()
      addLog(pwordtext)
      if (parsed.length < 1) {
        noCommand = true
        break
      }
      clearLogs()
      networks[bankIP].data.accounts[networks[bankIP].data.tempUser] = [parsed, 10]
      addLog(["Created user '" + networks[bankIP].data.tempUser + "'."])
      addLog(line)
      networks[bankIP].data.pos = 0
      break
  }
  if (back) {
    networks[bankIP].data.pos = 0
    clearLogs()
    addLog(line)
  }
}

// Parses commands.
function parseCommand(command) {
  var prev = filePath.slice(0,filePath.length)
  var fail = 0
  var array = command[0]
  if (command[1][0] === 0) {
    switch (array[0]) {
      case "sell": // sell -v <file> / sell -v <file>
        if (1 === 1) {
          if (!findFile(devices[playerHost].files, ["Users","admin","Applications","sell.exe"], "sell")) {
            fail = 1
            break
          }
          if (array.length < 3) {
            fail = 3
            break
          }
          if (array.length > 3) {
            fail = 2
            break
          }
          if (array[1] === "-v" || array[1] === "-p") {
            var file = navigateObject(devices[currentMAC].files, filePath.concat(array[2]))
            if (file === undefined) {
              fail = 13
              break
            }
            console.log(file)
            if (file.lootTag === undefined) {
              addLog("The file '" + array[2] + "' is not sellable.")
              break
            }
            if (soldUIDs.includes(file.uid)) {
              addLog("The file '" + array[2] + "' has already been sold.")
              break
            }
            var value = evaluateFilePrice(file)
            if (array[1] === "-v") {
              addLog("The file '" + array[2] + "' is valued at " + value + " F-Coin.")
            } else {
              if (currentBank === "") {
                addLog("ERROR - Not logged in to bank account.")
                fail = -1
                break
              }
              networks[bankIP].data.accounts[currentBank][1] += value
              soldUIDs.push(file.uid)
			  //Citizen play cha-ching
			  sell_snd.play()
			  //end test sound
              addLog("Sold '" + array[2] + "' for " + value + " F-Coin.")
            }
          } else {
            fail = 1
            break
          }
          break
        }
      //Citizen -harckerify program
	  //case "wepcrack": // wepcrack <IP> guess <code> / wepcrack <IP> solve <code> / wepcrack <IP> create
      case "wepcrack": // wepcrack <IP> -g <code> / wepcrack <IP> -s <code> / wepcrack <IP> -c
        if (1 === 1) {
          if (!findFile(devices[playerHost].files, ["Users","admin","Applications","wepcrack.exe"], "wepcrack")) {
            fail = 1
            break
          }
          if (array.length < 3) {
            fail = 3
            break
          }
          if (array.length > 4) {
            fail = 2
            break
          }
          var ip = array[1]
          if (array[1] === "target") {
            ip = storedIP
          }
          if (array[1] === "127.0.0.1") {
            ip = playerNetwork
          } else {
            ip = getNumberFromIP(ip)
          }
          var mac = -1
          if (isNaN(ip)) {
            fail = 5
            break
          }
          if (networks[ip] === undefined) {
            fail = 7
            break
          }
          if (networks[ip].security !== 1) {
            addLog("ERROR - Network not using WEP security.")
            fail = -1
            break
          }
          if (array[2] === "-g" || array[2] === "-s") {
            if (array.length < 4) {
              fail = 3
              break
            }
            var code = array[3].split("")
            var fail = false
            if (code.length !== 4) {
              fail = true
            }
            for (var i of code) {
              if (!(["0","1","2","3","4","5","6","7","8","9"].includes(i))) {
                fail = true
              }
            }
            if (fail) {
              addLog("ERROR - Invalid WEP key.")
              fail = -1
              break
            }
            code = parseInt(array[3])
            if (array[2] === "-g") {
              var message = "WEP key correct."
              if (code < networks[ip].code) {
                message = "WEP key too small."
              } else if (code > networks[ip].code) {
                message = "WEP key too large."
              }
              addLoadingBar("Comparing", 1000, message)
            } else if (array[2] === "-s") {
              if (code !== networks[ip].code) {
                addLoadingBar("Solving", 3000, "WEP key incorrect.")
              } else {
                addLoadingBar("Solving", 3000, ["WEP security of " + getIP(ip) + " cracked."], "unlock", [ip])
              }
            }
          } else if (array[2] === "-c") {
            if (array.length > 3) {
              fail = 2
              break
            }
            var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
            if (downloads === undefined) {
              addLog("Folder 'Downloads' not found.")
              fail = -1
              break
            }
            if (!networks[ip].hacked) {
              addLog("ERROR - Network has not been cracked.")
              fail = -1
              break
            }
            copyFile({lootTag: "backdoor", ip: ip, uid: networks[ip].uid, type: "static"}, downloads, networks[ip].name.replace(/ /g, "_").toLowerCase().replace(/[^abcdefghijklmnopqrstuvwxyz0123456789_]/g, "") + ".wepbd")
            addLoadingBar("Downloading", 3000, "WEP backdoor file created in 'downloads'.")
            console.log(downloads)
          } else {
            fail = 1
            break
          }
          break
        }
      case "discover": // discover
        if (1 === 1) {
          if (array.length > 1) {
            fail = 2
            break
          }
          addLoadingBar("Scanning", 3000, "Discovered a new network and added to links.", "discover")
          break
        }

      case "bank": // bank -login <name> <password> / bank -logout / bank -balance / bank -transfer <name> <INT>
        if (1 === 1) {
          var failed = !findFile(devices[playerHost].files, ["Users","admin","Applications","bank.exe"], "bank")
          if (failed || command[1][1] !== 0) {
            fail = 1
            break
          }
          if (array.length < 2) {
            fail = 3
            break
          }
          switch (array[1]) {
            case "-login":
              if (array.length < 4) {
                fail = 3
                break
              }
              if (array.length > 4) {
                fail = 2
                break
              }
              if (currentBank !== "") {
                addLog("ERROR - Already logged in to bank account.")
                fail = -1
                break
              }
              var account = networks[bankIP].data.accounts[array[2]]
              if (account === undefined) {
                addLog("ERROR - Account name does not exist.")
                fail = -1
                break
              }
              if (account[0] !== array[3]) {
                addLog("ERROR - Password does not match account name.")
                fail = -1
                break
              }
              currentBank = array[2]
              addLog("Logged into '" + array[2] + "'.")
              break
            case "-logout":
              if (array.length > 2) {
                fail = 2
                break
              }
              if (currentBank === "") {
                addLog("ERROR - Not logged in to bank account.")
                fail = -1
                break
              }
              addLog("Logged out of '" + currentBank + "'.")
              currentBank = ""
              break
            case "-balance":
              if (array.length > 2) {
                fail = 2
                break
              }
              if (currentBank === "") {
                addLog("ERROR - Not logged in to bank account.")
                fail = -1
                break
              }
              addLog("Balance: " +  networks[bankIP].data.accounts[currentBank][1] + " F-Coin")
              break
            case "-transfer":
              if (array.length < 4) {
                fail = 3
                break
              }
              if (array.length > 4) {
                fail = 2
                break
              }
              if (currentBank === "") {
                addLog("ERROR - Not logged in to bank account.")
                fail = -1
                break
              }
              if (array[2] === currentBank) {
                addLog("ERROR - Cannot transfer money to self.")
                fail = -1
                break
              }
              var accounts = networks[bankIP].data.accounts
              if (accounts[array[2]] === undefined) {
                addLog("ERROR - Account name does not exist.")
                fail = -1
                break
              }
              var number = Number(array[3])
              if (number === NaN || number % 1 !== 0 || number <= 0) {
                addLog("ERROR - Invalid amount.")
                fail = -1
                break
              }
              if (accounts[currentBank][1] < number) {
                addLog("ERROR - Not enough money in bank account.")
                fail = -1
                break
              }
              accounts[currentBank][1] -= number
              accounts[array[2]][1] += number
              addLog("Transferred " + number + " F-Coin to '" + array[2] + "'.")
              break
            default:
              fail = 1
              break
          }
          break
        }
      case "scan": // scan <IP> devices / scan <IP> networks
        if (1 === 1) {
          if (array.length < 3) {
            fail = 3
            break
          }
          if (array.length > 3) {
            fail = 2
            break
          }
          if (command[1][1] !== 0 || (array[2] !== "devices" && array[2] !== "networks")) {
            fail = 1
            break
          }
          var ip = array[1]
          if (array[1] === "target") {
            ip = storedIP
          }
          ip = getNumberFromIP(ip)
          if (array[1] === "127.0.0.1") {
            ip = playerNetwork
          }
          if (isNaN(ip)) {
            fail = 5
            break
          }
          if (networks[ip] === undefined) {
            fail = 7
            break
          }
          var log = [": (" + getIP(ip) + ")"]
          switch (array[2]) {
            case "devices":
              var count = 0
              log[0] = "Devices" + log[0]
              for (var i in networks[ip].devices) {
				//Citizen - display each devices security rating
                log.push(getMAC(i) + " (" + devices[i].name + ") [" + securityNames[devices[i].security] + "]")
                count++
              }
              if (count === 0) {
                log = "No devices found."
              }
              break
            case "networks":
              if (networks[ip].connections === undefined || networks[ip].connections.length < 1) {
                log = "No networks found."
                break
              }
              log[0] = "Networks" + log[0]
              for (var i of networks[ip].connections) {
                log.push(getIP(i) + " (" + networks[i].name + ") [" + securityNames[networks[i].security] + "]")
              }
              break
          }
          addLoadingBar("Scanning", 2000, log)
          break
        }
      case "reboot": // restart
        if (1 === 1) {
          if (array.length > 1) {
            fail = 2
            break
          }
          if (currentMAC === playerHost) {
            addLoadingBar("Restarting", 2000, "", "restart")
          } else {
            devices[currentMAC].down = true
            addEvent(5000, 0, "reboot", [currentMAC])
            connect(playerNetwork, playerHost)
            addLog("Forcefully disconnected from MAC.")
          }
          break
        }
      case "link": // link add <STR> <IP> [MAC] / link list [INT] / link target <INT> / link remove <INT> / link clear
        if (1 === 1) {
          if (array.length < 2) {
            fail = 3
            break
          }
          if (command[1][1] !== 0) {
            fail = 1
            break
          }
          switch (array[1]) {
            case "add":
              if (array.length < 4) {
                fail = 3
                break
              }
              if (array.length > 5) {
                fail = 2
                break
              }
              if (bookmarks.length > 255) {
                addLog("ERROR - Link capacity reached.")
                fail = -1
                break
              }
              if (array[2].length > 64) {
                fail = 17
                break
              }
              if (isNaN(getNumberFromIP(array[3]))) {
                fail = 5
                break
              }
              if (array[3] === "127.0.0.1") {
                array[3] = getIP(playerNetwork)
              }
              if (array.length > 4) {
                if (isNaN(getNumberFromMAC(array[4]))) {
                  fail = 6
                  break
                }
                bookmarks.push([array[2], array[3], array[4].toUpperCase()])
              } else {
                bookmarks.push([array[2], array[3]])
              }
              addLog("Link \"" + array[2] + "\" added.")
              break
            case "list":
              if (array.length > 3) {
                fail = 2
                break
              }
              if (bookmarks.length < 1) {
                addLog("No links found.")
                fail = -1
                break
              }
              var data = []
              for (var i = 0; i < bookmarks.length; i++) {
                var string = "[" + i + "] " + bookmarks[i][0] + ": "
                if (bookmarks[i].length > 2) {
                  string += bookmarks[i][2] + " (" + bookmarks[i][1] + ")"
                } else {
                  string += bookmarks[i][1]
                }
                data.push(string)
              }
              var index = 1
              if (array.length > 2 && !isNumber(array[2],-1)) {
                fail = 12
                break
              }
              if (array.length > 2) {
                index = Number(array[2])
              }
              var list = printHelp("Links:", data, index, 10)
              if (list !== null) {
                addLoadingBar("Collecting", 300, list)
              } else {
                fail = 12
                break
              }
              break
            case "target":
              if (array.length < 3) {
                fail = 3
                break
              }
              if (array.length > 3) {
                fail = 2
                break
              }
              if (bookmarks[array[2]] === undefined) {
                fail = 12
                break
              }
              if (bookmarks[array[2]].length < 3) {
                storedIP = bookmarks[array[2]][1]
                storedMAC = ""
                addLog("Set target to " + bookmarks[array[2]][1] + ".")
              } else {
                storedIP = bookmarks[array[2]][1]
                storedMAC = bookmarks[array[2]][2]
                addLog("Set target to " + bookmarks[array[2]][2] + " (" + bookmarks[array[2]][1] + ").")
              }
              break
            case "remove":
              if (array.length < 3) {
                fail = 3
                break
              }
              if (array.length > 3) {
                fail = 2
                break
              }
              if (bookmarks[array[2]] === undefined) {
                fail = 12
                break
              }
              bookmarks.splice(array[2], 1)
              addLog(["Deleted link #" + array[2] + "."])
              break
            case "clear":
              if (array.length > 2) {
                fail = 2
                break
              }
              if (bookmarks.length < 1) {
                addLog("ERROR - No links to clear.")
                fail = -1
                break
              }
              bookmarks = []
              addLoadingBar("Collecting", 1000, "Cleared links.")
              break
            default:
              fail = 1
              break
          }
          break
        }
      case "cmd": // cmd list [INT] / cmd run <file>
        if (1 === 1) {
          if (array.length < 2) {
            fail = 3
            break
          }
          if (array.length > 3) {
            fail = 2
            break
          }
          if (command[1][1] !== 0) {
            fail = 1
            break
          }
          var programs = navigateObject(devices[playerHost].files, ["Users", "admin","Documents","Programs"])
          if (programs === undefined) {
            addLog("ERROR - Folder 'Programs' not found.")
            fail = -1
            break
          }
          switch (array[1]) {
            case "list":
              var data = []
              for (var i in programs) {
                if (i.length > 4) {
                  if (i.slice(i.length - 4, i.length) === ".cmd" && (programs[i].type === "dynamic" || programs[i].type === "readonly")) {
                    data.push(i.slice(0,i.length - 4))
                  }   
                }
              }
              if (data.length === 0) {
                addLog("No programs found.")
                fail = -1
                break
              }
              var index = 1
              if (array.length > 2 && !isNumber(array[2],-1)) {
                fail = 12
                break
              }
              if (array.length > 2) {
                index = Number(array[2])
              }
              var list = printHelp("Programs:", data, index, 10)
              if (list !== null) {
                addLoadingBar("Collecting", 300, list)
              } else {
                fail = 12
                break
              }
              break
            case "run":
              if (array.length < 3) {
                fail = 3
                break
              }
              array[2] += ".cmd"
              if (programs[array[2]] === undefined || (programs[array[2]].type !== "dynamic" && programs[array[2]].type !== "readonly")) {
                addLog("ERROR - Program does not exist.")
                fail = -1
                break
              }
              addLoadingBar("Running", 1000, "", "doCmd", [programs[array[2]].data])
              break
            default:
              fail = 1
              break
          }
          break
        }
      case "paste": // paste
        if (1 === 1) {
          if (array.length > 1) {
            fail = 2
            break
          }
          if (storedFile === null) {
            addLog("ERROR - Nothing copied to be pasted.")
            fail = -1
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          copyFile(storedFile[1], pos, storedFile[0])
          addLoadingBar("Pasting", 1000, "Pasted 1 object.")
          break
        }
      case "copy": // copy <file>
        if (1 === 1) {
          if (array.length < 2) {
            fail = 3
            break
          }
          if (array.length > 2) {
            fail = 2
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          if (pos[array[1]] !== undefined) {
            storedFile = [array[1],pos[array[1]]]
            addLoadingBar("Copying", 500, "Copied object to clipboard.")
          } else {
            fail = 13
            break
          }
          break
        }
      case "name": // name <file> <STR>
        if (1 === 1) {
          if (array.length < 3) {
            fail = 3
            break
          }
          if (array.length > 3) {
            fail = 2
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          if (pos[array[1]] !== undefined) {
            var file = pos[array[1]]
            delete pos[array[1]]
            copyFile(file, pos, array[2])
            addLog("Renamed 1 object.")
          } else {
            fail = 13
            break
          }
          break
        }
      case "dup": // dup <file> [STR]
        if (1 === 1) {
          if (array.length < 2) {
            fail = 3
            break
          }
          if (array.length > 3) {
            fail = 2
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          if (pos[array[1]] !== undefined) {
            var name = array[1]
            if (array.length === 3) {
              name = array[2]
            }
            copyFile(pos[array[1]], pos, name)
            addLoadingBar("Duplicating", 1500, "Duplicated 1 object.")
          } else {
            fail = 13
            break
          }
          break
        }
      case "scp": // scp <file>
        if (1 === 1) {
          if (array.length < 2) {
            fail = 3
            break
          }
          if (array.length > 2) {
            fail = 2
            break
          }
          var downloads = navigateObject(devices[playerHost].files, ["Users","admin","Downloads"])
          if (downloads === undefined || downloads.type !== undefined) {
            addLog("ERROR - Folder 'Downloads' nonexistant.")
            fail = -1
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          if (array[1] === "*" && command[1][1] === 0) {
            var newPos = decouple(pos)
            var count = 0
            for (var i in newPos) {
              copyFile(newPos[i], downloads, i)
              count++
            }
            if (count === 0) {
              addLoadingBar("Grabbing", 300, "No items copied.")
            } else if (count === 1) {
              addLoadingBar("Grabbing", 3000, "Copied 1 item to Downloads.")
            } else {
              addLoadingBar("Grabbing", 3000 * count, "Copied " + count + " items to Downloads.")
            }
          } else if (pos[array[1]] !== undefined) {
            copyFile(pos[array[1]], downloads, array[1])
            addLoadingBar("Grabbing", 3000, "Copied 1 item to Downloads.")
          } else {
            fail = 13
            break
          }
          break
        }
      case "file": // file <file> add <STR> / file <file> remove <INT> / file <file> edit <INT> <STR>
        if (1 === 1) {
          if (array.length > 5) {
            fail = 2
            break
          }
          if (array.length < 4) {
            fail = 3
            break
          }
          if (command[1][2] !== 0) {
            fail = 1
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          var found = false
          if (pos[array[1]] !== undefined) {
            if (pos[array[1]].type === "dynamic") {
              found = true
            }
          }
          if (!found) {
            fail = 11
            break
          }
          switch (array[2]) {
            case "add":
              if (array.length > 4) {
                fail = 2
                break
              }
              if (pos[array[1]].data.length >= 255) {
                addLog("ERROR - File capacity reached.")
                fail = -1
                break
              }
              pos[array[1]].data.push(array[3])
              addLog("Added 1 line to file.")
              break
            case "remove":
              if (array.length > 4) {
                fail = 2
                break
              }
              var failed = true
              var index = Number(array[3])
              if (!isNaN(index) && index < 256 && index >= 0 && pos[array[1]].data[index] !== undefined) {
                failed = false
              }
              if (failed) {
                fail = 12
                break
              }
              pos[array[1]].data.splice(index,1)
              addLog("Removed 1 line from file.")
              break
            case "edit":
              if (array.length < 5) {
                fail = 2
                break
              }
              var failed = true
              var index = Number(array[3])
              if (!isNaN(index) && index < 255 && index >= 0 && pos[array[1]].data[index] !== undefined) {
                failed = false
              }
              if (failed) {
                fail = 12
                break
              }
              if (array[4].length >= 255) {
                addLog("ERROR - Line capacity reached.")
                fail = -1
                break
              }
              pos[array[1]].data[index] = array[4]
              addLog("Edited 1 line on file.")
              break
            default:
              fail = 1
              break
          }
          break
        }
      case "make": // make folder <STR> / make file <STR>
        if (1 === 1) {
          if (array.length > 3) {
            fail = 2
            break
          }
          if (array.length < 3) {
            fail = 3
            break
          }
          if (command[1][0] !== 0) {
            fail = 1
            break
          }
          var pos = navigateObject(devices[currentMAC].files, filePath)
          if (pos[array[2]] === undefined) {
            switch (array[1]) {
              case "folder":
                pos[array[2]] = {}
                break
              case "file":
                pos[array[2]] = {type:"dynamic", data:[]}
            }
            addLoadingBar("Creating", 2500, "Created 1 new file.")
          } else {
            addLog(["ERROR - Name overlaps with object in current folder."])
            fail = -1
            break
          }
          break
        }
      case "rm": // rm <file>
        if (1 === 1) {
        if (array.length > 2) {
          fail = 2
          break
        }
        if (array.length < 2) {
          fail = 3
          break
        }
        var count = 1
        var pos = navigateObject(devices[currentMAC].files, filePath)
        if (array[1] === "*" && command[1][1] === 0) {
          count--
          for (var i in pos) {
            delete pos[i]
            count++
          }
        } else {
          if (pos[array[1]] === undefined) {
            fail = 13
            break
          }
          delete pos[array[1]]
        }
        if (count === 0) {
          addLog("No files deleted.")
        } else if (count === 1) {
          addLoadingBar("Deleting", 1500, "Deleted 1 file.")
        } else {
          addLoadingBar("Deleting", 1500 * count, "Deleted " + count + " files.")
        }
        break
        }
      case "read": // read <file> [INT]
        if (1 === 1) {
        if (array.length > 3) {
          fail = 2
          break
        }
        if (array.length < 2) {
          fail = 3
          break
        }
        var pos = navigateObject(devices[currentMAC].files, filePath)
        var failed = true
        if (pos[array[1]] !== undefined) {
          if (pos[array[1]].type !== undefined) {
            failed = false
          }
        }
        if (failed) {
          fail = 11
          break
        }
        if (pos[array[1]].type !== "dynamic" && pos[array[1]].type !== "readonly" && pos[array[1]].type !== "encrypted") {
          addLog("ERROR - File is not readable.")
          fail = -1
          break
        }
        var value = 0
        if (array.length === 3) {
          if (isNaN(Number(array[2]))) {
            fail = 12
            break
          }
          value = Number(array[2])
        }
        if (value >= pos[array[1]].data.length || !isNumber(value,0)) {
          fail = 12
          break
        }
        var temp = [array[1] + ":"]
        for (var i = value; i < pos[array[1]].data.length; i++) {
          temp.push(i + ". " + pos[array[1]].data[i])
        }
        addLog(temp)
        break
        }
      case "notes": // notes add <STR> / notes read <INT> / notes remove <INT> / notes list [INT] / notes clear
        if (1 === 1) {
        var admin = navigateObject(devices[playerHost].files, ["Users", "admin"])
        var failed = !findFile(devices[playerHost].files, ["Users","admin","Applications","notes.exe"], "notes")
        if (failed) {
          fail = 1
          break
        }
        if (array.length === 1) {
          fail = 3
          break
        }
        if (array.length > 3) {
          fail = 2
          break
        }
        failed = true
        var temp = navigateObject(admin, ["Documents", "notes.txt"])
        if (temp !== undefined) {
          if (temp.type === "dynamic") {
            failed = false
          }
        }
        if (failed) {
          if (navigateObject(admin, ["Documents"]) !== undefined) {
            admin.Documents["notes.txt"] = {type: "dynamic", data: []}
          } else {
            addLog("ERROR - Folder 'Documents' not found.")
            fail = -1
            break
          }
        }
        admin = navigateObject(admin, ["Documents", "notes.txt"])
        if (command[1][1] === 0) {
          switch (array[1]) {
            case "add":
              if (array.length !== 3) {
                fail = 3
                break
              }
              if (admin.data.length >= 255) {
                addLog("ERROR - File capacity reached.")
                fail = -1
                break
              }
              admin.data.push(array[2])
              addLog("Added 1 note.")
              break
            case "read":
              if (array.length !== 3) {
                fail = 3
                break
              }
              failed = true
              var index = Number(array[2])
              if (!isNaN(index) && index < 256 && index >= 0 && admin.data[index] !== undefined) {
                failed = false
              }
              if (failed) {
                fail = 12
                break
              }
              addLog(admin.data[index],true)
              break
            case "remove":
              if (array.length !== 3) {
                fail = 3
                break
              }
              failed = true
              var index = Number(array[2])
              if (!isNaN(index) && index < 256 && index >= 0 && admin.data[index] !== undefined) {
                failed = false
              }
              if (failed) {
                fail = 12
                break
              }
              admin.data.splice(index,1)
              addLoadingBar("Deleting", 500, "Removed 1 note.")
              break
            case "list":
              if (array.length > 3) {
                fail = 2
                break
              }
              var value = 0
              if (array.length === 3) {
                if (isNaN(Number(array[2]))) {
                  fail = 12
                  break
                }
                value = Number(array[2])
              }
              if (admin.data.length === 0) {
                addLog("No notes found.")
                fail = -1
                break
              }
              if (value > 254 || value > admin.data.length - 1) {
                fail = 12
                break
              }
              var string = ["Notes:"]
              for (var i = value; i < admin.data.length; i++) {
                var data = admin.data[i]
                if (data.length > 5) {
                  data = data.slice(0,5) + "..."
                }
                string.push("[" + i + "] - \"" + data + "\"")
                if (i > value + 17) {
                  break
                }
              }
              addLoadingBar("Collecting", 300, string)
              break
            case "clear":
              admin.data = []
              addLoadingBar("Deleting", 500 * admin.data.length, "Cleared notes.")
              break
            default:
              fail = 1
              break
          }
        } else {
          fail = 1
          break
        }
        break
        }
      case "info": // info <IP> [MAC] / info current / info target
        if (1 === 1) {
        if (array.length === 2 && array[1] === "current" && command[1][1] === 0) {
          array.pop()
          array.push(getIP(currentIP), getMAC(currentMAC))
        }
        if (array.length === 2 && array[1] === "target" && command[1][1] === 0) {
          array.pop()
          if (storedIP === "") {
            fail = 14
            break
          } else {
            array.push(storedIP)
          }
          if (storedMAC !== "") {
            array.push(storedMAC)
          }
        }
        if (array.length < 2) {
          fail = 3
          break
        }
        if (array.length > 3) {
          fail = 2
          break
        }
        var ip = getNumberFromIP(array[1])
        if (array[1] === "127.0.0.1") {
          ip = playerNetwork
        }
        if (isNaN(ip)) {
          fail = 5
          break
        }
        if (networks[ip] === undefined) {
          fail = 7
          break
        }
        var message = [networks[ip].name + ": (" + getIP(ip) + ") [" + securityNames[networks[ip].security] + "]", networks[ip].description]
        if (array.length === 3) {
          var mac = getNumberFromMAC(array[2])
          if (isNaN(mac)) {
            fail = 6
            break
          }
          if (networks[ip].devices[mac] === undefined || devices[mac].down === true) {
            fail = 8
            break
          }
          if (networks[ip].devices[mac] === false) {
            fail = 9
            break
          }
          //Citizen - add MAC device security level to info
		  message.push(devices[mac].name + ": (" + getMAC(mac) + ") [" + securityNames[devices[mac].security] + "]", devices[mac].description)
        }
        addLoadingBar("Grabbing", 500, message)
        break
        }
      case "disconnect": // disconnect
        if (1 === 1) {
          if (array.length > 1) {
            fail = 2
            break
          }
          if (currentIP === playerNetwork && currentMAC === playerHost) {
            addLog("ERROR - Cannot disconnect from self.")
            fail = -1
            break
          }
          var object = "MAC"
          if (currentMAC === -1) {
            object = "IP"
          }
          disconnect()
          break
        }
      case "connect": // connect <IP> [MAC] / connect target
        if (1 === 1) {
        if (array.length === 2 && array[1] === "target" && command[1][1] === 0) {
          array.pop()
          if (storedIP === "" && storedMAC === "") {
            fail = 14
            break
          }
          array.push(storedIP)
          if (storedMAC !== "") {
            array.push(storedMAC)
          }
        }
        if (array.length < 2) {
          fail = 3
          break
        }
        if (array.length > 3) {
          fail = 2
          break
        }
        var ip = getNumberFromIP(array[1])
        if (array[1] === "127.0.0.1") {
          array[1] = getIP(playerNetwork)
          ip = playerNetwork
        }
        var mac = -1
        if (isNaN(ip)) {
          fail = 5
          break
        }
        if (networks[ip] === undefined) {
          fail = 7
          break
        }
        if (array.length > 2) {
          mac = getNumberFromMAC(array[2])
          if (isNaN(mac)) {
            fail = 6
            break
          }
          if (networks[ip].devices[mac] === undefined || devices[mac].down === true) {
            fail = 8
            break
          }
          if (networks[ip].devices[mac] === false) {
            fail = 9
            break
          }
		  // play sound connect
		  connect_snd.play()
          addLoadingBar("Connecting", 2000, "Connected " + array[2].toUpperCase() + " (" + array[1] + ")", "connect", [ip, mac])
        } else {
          if (networks[ip].instance === undefined) {
            addLog("ERROR - Network cannot be connected to.")
            fail = -1
            break
          }
		  // play sound connect
		  connect_snd.play()
          addLoadingBar("Connecting", 2000, "", "connect", [ip, mac])
        }
        break
        }
      case "target": // target <IP> [MAC]
        if (1 === 1) {
        if (array.length < 2) {
          fail = 3
          break
        }
        if (array.length > 3) {
          fail = 2
          break
        }
        if (isNaN(getNumberFromIP(array[1]))) {
          fail = 5
          break
        }
        if (array.length > 2) {
          if (isNaN(getNumberFromMAC(array[2]))) {
            fail = 6
            break
          }
        }
        if (array.length === 2) {
          storedIP = array[1]
          storedMAC = ""
          addLog("Set target to " + array[1] + ".")
        } else {
          storedIP = array[1]
          storedMAC = array[2]
          addLog("Set target to " + array[2] + " (" + array[1] + ").")
        }
        break
        }
      case "ls": // ls [INT]
        if (1 === 1) {
        if (array.length > 2) {
          fail = 2
          break
        }
        var pos = navigateObject(devices[currentMAC].files, filePath)
        var data = []
        for (var i in pos) {
          var type = pos[i].type
          switch (type) {
            case undefined:
              type = "(folder)"
              break
            case "static":
              type = "(file)"
              break
            case "dynamic":
              type = "(editable file)"
              break
//Citizen - add encrypted file type
            case "encrypted":
              type = "(encrypted)"
              break			  
            default:
              type = "(unknown)"
          }
          data.push(i + " " + type)
        }
        if (data.length === 0) {
          addLog("No files found.")
          fail = -1
          break
        }
        var index = 1
        if (array.length > 1 && !isNumber(array[1],-1)) {
          fail = 12
          break
        }
        if (array.length > 1) {
          index = Number(array[1])
        }
        var list = printHelp(getFilePath(filePath), data, index, 10)
        if (list !== null) {
          addLoadingBar("Collecting", 300, list)
        } else {
          fail = 12
          break
        }
        break
        }
      case "cd": // cd [directory]
        if (1 === 1) {
        if (array.length > 2) {
          fail = 2
          break
        }
        if (array.length === 1) {
          setFilePath(["Users","admin"])
          break
        }
        if (array.length === 2) {
          var done = false
          if (command[1][1] === 0) {
            switch (array[1]) {
              case "/":
                setFilePath([])
                done = true
                break
              case "~":
                setFilePath(["Users","admin"])
                done = true
                break
              case ".":
                done = true
                break
              case "..":
                setFilePath(filePath.slice(0,filePath.length - 1))
                done = true
                break
              case "-":
                setFilePath(prevFilePath)
                done = true
                break
            }
          }
          if (done) {
            break
          }
          var tempPath = [undefined]
          switch (array[1].slice(0,1)) {
            case "/":
              tempPath = quoteSplit(array[1].slice(1,array[1].length),"/")[0]
              break
            case "~":
              tempPath = ["Users","admin"].concat(quoteSplit(array[1].slice(1,array[1].length),"/")[0])
              break
            default:
              tempPath = filePath.concat(quoteSplit(array[1],"/")[0])
          }
          var pos = devices[currentMAC].files
          for (var i of tempPath) {
            if (pos[i] === undefined) {
              fail = 4
              break
            } else if (pos[i].type !== undefined) {
              fail = 4
              break
            } else {
              pos = pos[i]
            }
          }
          if (fail === 0) {
            setFilePath(tempPath)
          }
          break
        }
        }
      case "help": // help [command] / help basic [INT] / help apps [INT]
        if (1 === 1) {
          if (array.length > 3) {
            fail = 2
            break
          }
          failed = false
          if (array.length === 1) {
            addLog(["Type \'help basic\' for a list of basic commands.","Type \'help apps\' for a list of commands related to applications.","Type \'help <command>\' to read specific details on a given command."])
          } else {
            var index = 1
            if (array.length > 2 && !isNumber(array[2],-1)) {
              fail = 12
              break
            }
            if (array.length > 2) {
              index = Number(array[2])
            }
            var help
            switch (array[1]) {
              case "basic":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                //help = printHelp("Basic Commands:",["help","ls","cd","rm","connect","disconnect","read","make","file","target","scp","dup","name","copy","paste","cmd","link","reboot","scan","info","discover"], index)
				help = printHelp("Basic Commands:",["cd","cmd","connect","copy","disconnect","discover","dup","file","help","info","link","ls","make","name","paste","read","reboot","rm","scan","scp","target"], index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break
			//Citizen has entered the Help section
			//ls help
			  case "ls":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("ls / ls [INT]",["Lists files and folder in current directory."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break
			//cd help
			  case "cd":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("cd / cd <folder location> / cd . / cd .. / cd ~ / cd /",["Change directory back to root, or specified directory location, case sensitive. Various commands to jump to preset locations e.g. 'cd /' to change to the root directory directly from any locaiton."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//rm help
			  case "rm":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("rm <file/folder>",["Remove file or directory."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break						
			//connect help
			  case "connect":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("connect <IP> [MAC]",["Connect to a target, IP or IP and MAC address."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break		
			//disconnect help
			  case "disconnect":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("disconnect",["Disconnect from any connection."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break
			//read help
			  case "read":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("read <file> [line number]",["Read file contents."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break	
			//make help
			  case "make":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("make folder <title> / make file <title>",["Make a new file or folder."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break									
			//file help
			  case "file":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("file <file> add <STR> / file <file> remove <INT> / file <file> edit <INT> <STR>",["Add, remove or edit specific lines in a file."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break					
			//target help
			  case "target":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("target <IP> [MAC]",["Sets target to an IP or IP and MAC address, can also be used with links from saved list using identifying number."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break					
			//scp help
			  case "scp":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("scp <file>",["Secure copy protocol used to download sensitive files, can be used with * to download all files in a folder."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break					
			//dup help
			  case "dup":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("dup <file/folder>",["Duplicate a file or folder."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break					
			//name help
			  case "name":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("name <file/folder> <new name>",["Change a file or folders name."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break					
			//copy help
			  case "copy":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("copy <file/folder>",["Copies file or folder to clipboard."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//paste help
			  case "paste":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("paste",["Pastes item from clipboard to current location."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//cmd help
			  case "cmd":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("cmd list [INT] / cmd run <file>",["List all programs in Programs folder.","Run selected program file."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//link help
			  case "link":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("link add <STR> <IP> [MAC] / link list [INT] / link target <INT> / link remove <INT> / link clear",["Add, remove, target, or display known IP list."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//reboot help
			  case "reboot":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("reboot",["Reboot local machine."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//scan help
			  case "scan":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("scan <IP> devices / scan <IP> networks",["Scan an IP address for connected devices or networks."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			/* Remove Save + Load Helps
			
			//save help
			  case "save":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("save",["Saves current system machine state."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//load help
			  case "load":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("load",["Loads mounted save state."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break	
			*/
			
			//discover help
			  case "discover":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("discover",["Searches for publicly listed IP networks."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break	
			//info help
			  case "info":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                help = printHelp("info <IP> / info <IP> [MAC] / info current / info target",["Returns information on server."],index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break				
			//End of Citizen additions
              case "apps":
                if (command[1][1] !== 0) {
                  failed = true
                  break
                }
                var array = []
                var applications = ["Users","admin","Applications"]
                var appCommands = {"notes.exe": {tag: "notes", commands: ["notes.exe","notes add <STR>","notes read <INT>","notes remove <INT>","notes list [INT]"]}, "bank.exe": {tag: "bank", commands: ["bank.exe:","bank -login <username> <password>","bank -balance","bank -transfer <username> <amount>","bank -logout"]}, "wepcrack.exe": {tag: "wepcrack", commands: ["wepcrack.exe:","wepcrack <IP> -g <INT>","wepcrack <IP> -s <INT>","wepcrack <IP> -c"," "]}, "sell.exe": {tag: "sell", commands: ["sell.exe:","sell -v <filename>","sell -p <filename>"," "," "]}}
                for (var i in appCommands) {
                  var path = decouple(applications)
                  path.push(i)
                  if (findFile(devices[playerHost].files, path, appCommands[i].tag)) {
                    array = array.concat(appCommands[i].commands)
                  }
                }
                if (array.length < 1) {
                  addLog("No application commands found.")
                  break
                }
                help = printHelp("Application Commands:", array, index)
                if (help !== null) {
                  addLoadingBar("Collecting", 300, help)
                }
                break
              default:
                failed = true
            }
            if (help === null) {
              fail = 12
              break
            }
          }
          if (failed) {
            if (array.length > 2) {
              fail = 2
              break
            }
            var helpData = {"help": {"": "Logs information about the \'help\' command.", "[command]": "Logs information about [command].", "basic [INT]": "Logs a list of the basic system commands on your machine. Displays commands in pages of 5 commands each. [INT] is used to specify the page.", "apps [INT]": "Logs a list of the commands from applications on your machine. Displays commands in pages of 5 commands each. [INT] is used to specify the page."}}
            var appHelp = {"notes": {"add <STR>": "Adds a new note with <STR> as contents.", "read <INT>": "Reads the note with the id <INT>.", "remove <INT>": "Removes the note with the id <INT>.", "list [INT]": "Lists all notes starting from [INT].", "clear": "Deletes all notes."}}
            var appCommands = {"notes.exe": {tag: "notes", commands: ["notes"]}}
            var applications = ["Users","admin","Applications"]
            for (var i in appCommands) {
              var path = applications
              path.push(i)
              if (findFile(devices[playerHost].files, path, appCommands[i].tag)) {
                for (var j in appCommands[i].commands) {
                  var command = appCommands[i].commands[j]
                  helpData[command] = appHelp[command]
                }
              }
            }
            var found = false
            for (var i in helpData) {
              if (i === array[1]) {
                found = true
                var log = []
                for (var j in helpData[i]) {
                  var string = i + ""
                  if (j !== "") {
                    string += " "
                  }
                  string += j + ": " + helpData[i][j]
                  log.push(string)
                }
                addLog(log)
                break
              }
            }
            if (found === false) {
              fail = -1
              addLog(["ERROR - Command help not found."])
            }
          }
          break
        }
      default:
        fail = 1
    }
  } else {
    fail = 1
  }
  switch (fail) {
    case 0:
      if (JSON.stringify(filePath) !== JSON.stringify(prev)) {
        prevFilePath = prev
      }
      break
    case 1:
      addLog("ERROR - Unknown command.")
      break
    case 2:
      addLog("ERROR - Too many arguments.")
      break
    case 3:
      addLog("ERROR - Too few arguments.")
      break
    case 4:
      addLog("ERROR - Directory does not exist.")
      break
    case 5:
      addLog("ERROR - Invalid IP address.")
      break
    case 6:
      addLog("ERROR - Invalid MAC address.")
      break
    case 7:
      addLog("ERROR - IP address not found.")
      break
    case 8:
      addLog("ERROR - MAC address not found.")
      break
    case 9:
      addLog("ERROR - MAC access denied.")
      break
    case 10:
      addLog("ERROR - Not connected to a device.")
      break
    case 11:
      addLog("ERROR - File does not exist.")
      break
    case 12:
      addLog("ERROR - Invalid index.")
      break
    case 13:
      addLog("ERROR - Object does not exist.")
      break
    case 14:
      addLog("ERROR - No selected device / network.")
      break
    case 15:
      addLog("ERROR - No selected device.")
      break
    case 16:
      addLog("ERROR - No selected network.")
      break
    case 17:
      addLog("String length out of range.")
  }
}

// Runs a .cmd file.
function doCmd(file) {
  if (file.length === 0) {
    addLog("ERROR - No commands to run.")
  } else {
    commandQueue = commandQueue.concat(file)
  }
}

// Add multiple bookmarks. For quest use.
function addBookmarks(array) {
  var count = 0
  for (var i of array) {
    if (bookmarks.length < 256) {
      count++
      bookmarks.push(i)
    } else {
      return false
    }
  }
  addLog("Added " + count + " bookmarks.")
  return true
}

// Render a loading bar.
function doLoadBar() {
  var num = Math.round(loadTime / loadMax * 25)
  var string = "["
  for (var i = 0; i < 25 - num; i++) {
    string += "#"
  }
  for (var i = 0; i < num; i++) {
    string += "-"
  }
  logs[logs.length - 1].innerHTML = loadTitle + ": " + string + "]"
}

// Create a loading bar with a title, time and end message.
function addLoadingBar(title, time, end, funct = "", data = []) {
  addLog(title + ": [-------------------------]")
  pauseReason = "loading"
  loadTime = time
  loadMax = time
  loadTitle = title
  loadEndMsg = end
  loadFunction = funct
  loadData = data
}

// Copy file to target with name.
function copyFile(file, target, name) {
  var count = 0
  var extention = ""
  var inLoop = true
  while (inLoop) {
    if (target[name + extention] !== undefined) {
      count++
      extention = " (" + count + ")"
    } else {
      inLoop = false
    }
  }
  target[name + extention] = decouple(file)
}

// Decouple JSON from other JSON.
function decouple(x) {
  return JSON.parse(JSON.stringify(x))
}

// Test if file with tag exists.
function findFile(start, path, tag = "") {
  var pos = navigateObject(start, path)
  if (pos === undefined) {
    return false
  }
  var cond = true
  if (tag !== "") {
    cond = pos.tags.includes(tag)
  }
  if (pos.type !== undefined && cond) {
    return true
  }
  return false
}

// Checks if a string represents a number from 0 - 255.
function isNumber(string, offset = 0) {
  var failed = true
  var number = Number(string) + offset
  if (!isNaN(number) && number < 256 && number >= 0 && Math.floor(number) === number) {
    failed = false
  }
  return !failed
}

// Creates a help string from a number and an array.
function printHelp(title, data, number, length = 5) {
  if (data.length === 0) {
    return [title + " (Page 1 of 1)"]
  }
  number -= 1
  if (number >= data.length / length) {
    return null
  }
  var text = [title + " (Page " + (number + 1) + " of " + Math.ceil(data.length / length) + ")"]
  for (var i = length * number; i < length * number + length; i++) {
    if (i >= data.length) {
      break
    }
    text.push(data[i])
  }
  return text
}

// Navigate an object with an array and return the final destination.
function navigateObject(object, path) {
  for (var i of path) {
    if (object[i] === undefined) {
      return undefined
    }
    object = object[i]
  }
  return object
}

// Get display string of a given file path R E C U R S I V E L Y.
function getFilePath(array, string = "/", pos = 0) {
  if (pos >= array.length) {
    return string
  }
  return getFilePath(array, string + array[pos] + "/", pos + 1)
}

// Display file path on display.
function setFilePath(array) {
  var tempPath = []
  var temp = devices[currentMAC].files
  for (var i of array) {
    if (temp[i] !== undefined) {
      tempPath.push(i)
      temp = temp[i]
    } else {
      break
    }
  }
  filePath = tempPath
  fileDisplay.innerHTML = "<b>FILE: " + capLine(getFilePath(tempPath), 43) + "</b>"
}

// Caps a line of text at 'length' if it is over. Replaces the last three characters with "...".
function capLine(text, length) {
  if (text.length <= length) {
    return text
  } else {
    return text.slice(0,length-3) + "..."
  }
}

// Split a string into an array on "'s.
function quoteSplit(string, char) {
  if (string === undefined) {
    return undefined
  }
  var array = string.split("")
  var final = []
  var start = 0
  var inQuotes = false
  for (var i = 0; i < array.length; i++) {
    if (array[i] === "\"") {
      inQuotes = !inQuotes
    }
    if (!inQuotes && array[i] === char) {
      final.push(string.slice(start,i))
      start = i + 1
    } else if (i === array.length - 1) {
      final.push(string.slice(start,i + 1))
    }
  }
  var quoted = []
  for (var i = 0; i < final.length; i++) {
    var quote = 0
    if (final[i][0] === "\"" && final[i][final[i].length - 1] === "\"") {
      quote += 1
    }
    var temp = final[i]
    final[i] = final[i].replace(/["]/g,"")
    if (temp !== final[i]) {
      quote += 1
    }
    quoted.push(quote)
  }
  console.log(final, quoted)
  return [final, quoted]
}

// Anti "Bobby Tables" function.
function sanitise(string) {
  return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;")
}

// Print a line to the log.
function addLogLine(string,string1,isVisible=true) {
  var prevValue = string
  var prevClass = "logText " + string1
  if (isVisible) {
    prevClass += " visible"
  }
  for (var i = logs.length - 1; i >= 0; i--) {
    var tempValue = prevValue
    var tempClass = prevClass
    prevValue = logs[i].innerHTML
    prevClass = logs[i].className
    logs[i].innerHTML = tempValue
    logs[i].className = tempClass
  }
}

// Splits strings in an array every 45 characters.
function splitLog(array) {
  var final = []
  for (var i of array) {
    while (i.length > 45) {
      final.push(i.slice(0,45))
      i = i.slice(45)
    }
    final.push(i)
  }
  return final
}

// Print a string to the log.
function addLog(array) {
  if (typeof array === "string") {
    array = [array]
  }
  array = splitLog(array)
  for (var i = 0; i < array.length; i++) {
    array[i] = sanitise(array[i])
  }
  addLogLine("","noBorder",false)
  if (array.length > 1) {
    addLogLine(array[0],"topBorder")
    for (var i = 1; i < array.length; i++) {
      if (i === array.length - 1) {
        addLogLine(array[i],"bottomBorder")
      } else {
        addLogLine(array[i],"noBorder")
      }
    }
  } else {
    addLogLine(array[0],"bothBorder")
  }
}

// Clear the log.
function clearLogs() {
  for (var i = logs.length - 1; i >= 0; i--) {
    logs[i].innerHTML = ""
    logs[i].className = "logText noBorder"
  }
}

// Get a random item from an array.
function randomChoice(array) {
  return array[randomRange(0, array.length - 1)]
}

// Get a random number in a range.
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//Citizen - Remove Saving
// Saves the current gamestate.
/*
function save() {
  var file = [[],prevCommands,currentPos,networks,devices,currentIP,currentMAC,currentBank,filePath,prevFilePath,playerNetwork,playerHost,storedIP,storedMAC,storedFile,bookmarks,usedIPs,chatbbsIP,bankIP,shopIP,fenceIP,fibIP,fibextIP,fiblsIP,fibvcIP,fiblcIP,events,currentUID,soldUIDs,bankaccounts,mentorIP,infobattleIP,cerberusindIP,cerberusarchIP,cerberuspdIP,lspiIP,russianIP,bcsIP,psbIP,penrisIP,dssIP,mazeIP,lombankIP,kaytonIP,udepotIP,iolIP,dpdIP,vpdIP,saspdIP,sasprdIP,sdsoIP,docIP,challIP,lsia,iaaIP,iaaarchIP,iaaextIP,iaabackIP,hackedIP,watchersIP,payphoneIP]
 
 for (var i = 0; i < logs.length; i++) {
    file[0].push([logs[i].innerHTML, logs[i].className])
  }
  file[0].shift()
  file[0].shift()
  file[0].push(["", "logText noBorder"], ["Saved computer state.", "logText bothBorder visible"])
  download("save.hck", JSON.stringify(file))
}
*/

// Downloads a file.
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Stores current loaded save file.
var currentLoaded = []

/* Remove mounting
// Mounts a save file to currentLoaded.
function mount(event) {
  var file = event.target.files[0]
  if (file) {
    var reader = new FileReader()
    reader.onload = function(event) { 
      var contents = event.target.result
      currentLoaded = JSON.parse(contents)
    }
    reader.readAsText(file)
  } else { 
    console.warn("Failed to load file.")
  }
}
*/

function unlock(ip) {
  networks[ip].hacked = true
  for (var i in networks[ip].devices) {
    networks[ip].devices[i] = true
  }
}
//Citizen changed discover to 1 site at a time
//  for (var i = 0; i < 3; i++) {
function discover() {
  var ips = []
  for (var i = 0; i < 1; i++) {
    ips.push(addNewNetwork())
  }
  for (var i of ips) {
    var network = networks[i]
    var ipStr = getIP(i)
    addLog([network.name + ": (" + ipStr + ") [" + securityNames[network.security] + "]",network.description])
    bookmarks.push([network.name, ipStr])
  }
}

// Loads the mounted save file.
//Citizen - UPDATE SAVE POINTS!!!
function load() {
  for (var i = 0; i < currentLoaded[0].length; i++) {
    logs[i].innerHTML = currentLoaded[0][i][0]
    logs[i].className = currentLoaded[0][i][1]
  }
	prevCommands = currentLoaded[1]
	currentPos = currentLoaded[2]
	networks = currentLoaded[3]
	devices = currentLoaded[4]
	currentIP = currentLoaded[5]
	currentMAC = currentLoaded[6]
	currentBank = currentLoaded[7]
	filePath = currentLoaded[8]
	prevFilePath = currentLoaded[9]
	playerNetwork = currentLoaded[10]
	playerHost = currentLoaded[11]
	storedIP = currentLoaded[12]
	storedMAC = currentLoaded[13]
	storedFile = currentLoaded[14]
	bookmarks = currentLoaded[15]
	usedIPs = currentLoaded[16]
	chatbbsIP = currentLoaded[17]
	bankIP = currentLoaded[18]
	shopIP = currentLoaded[19]
	fenceIP = currentLoaded[20]
	fibIP = currentLoaded[21]
	fibextIP = currentLoaded[22]
	fiblsIP = currentLoaded[23]
	fibvcIP = currentLoaded[24]
	fiblcIP = currentLoaded[25]
	events = currentLoaded[26]
	currentUID = currentLoaded[27]
	soldUIDs = currentLoaded[28]
	bankaccounts = currentLoaded[29]
	mentorIP = currentLoaded[30]
	cerberusIP = currentLoaded[31]
	saiIP = currentLoaded[32]
	talonIP = currentLoaded[33]
	spadesIP = currentLoaded[34]
	infobattleIP = currentLoaded[35]
	cerberusindIP = currentLoaded[36]
	cerberusarchIP = currentLoaded[37]
	cerberuspdIP = currentLoaded[38]
	lspiIP = currentLoaded[39]
	russianIP = currentLoaded[40]
	bcsIP = currentLoaded[41]
	psbIP = currentLoaded[42]
	penrisIP = currentLoaded[43]
	dssIP = currentLoaded[44]
	mazeIP = currentLoaded[45]
	lombankIP = currentLoaded[46]
	kaytonIP = currentLoaded[47]
	udepotIP = currentLoaded[48]
	iolIP = currentLoaded[49]
	dpdIP = currentLoaded[50]
	vpdIP = currentLoaded[51]
	saspdIP = currentLoaded[52]
	sasprdIP = currentLoaded[53]
	sdsoIP = currentLoaded[54]
	docIP = currentLoaded[55]
	challIP = currentLoaded[56]
	lsiaIP = currentLoaded[57]
	iaaIP = currentLoaded[58]
	iaaarchIP = currentLoaded[59]
	iaaextIP = currentLoaded[60]
	iaabackIP = currentLoaded[61]
	hackedIP = currentLoaded[62]
	watchersIP = currentLoaded[63]
	payphoneIP = currentLoaded[64]
	
}

// Initialising game data variables.
var networks = {} //
var devices = {} //
var currentIP //
var currentMAC //
var currentBank = "" //
var filePath //
var prevFilePath // 
var playerNetwork = 0 //
var playerHost = 0 //
var storedIP = "" //
var storedMAC = "" //
var storedFile = null //
var instance = null
var bookmarks = [] //
var usedIPs = {} //
//Citizen ChatBBS IP init
var chatbbsIP = 0 //
var bankIP = 0 //
var shopIP = 0 //
var fenceIP = 0 //
//Citizen FIB IPs init
var fibIP = 0 //
var fibextIP = 0 //
var fiblsIP = 0 //
var fibvcIP = 0 //
var fiblcIP = 0 //
//Citizen populated sites
var mentorIP = 0 //
var cerberusIP = 0 //
var cerberusindIP = 0 //
var cerberusarchIP = 0 //
var cerberuspdIP = 0 //
var saiIP = 0 //
var talonIP = 0 //
var spadesIP = 0 //
var infobattleIP = 0 //
var lspiIP = 0 //
var russianIP = 0 //
var bcsIP = 0 //
var psbIP = 0 //
var penrisIP = 0 //
var dssIP = 0 //
var mazeIP = 0 //
var lombankIP = 0 //
var kaytonIP = 0 //
var udepotIP = 0 //
var iolIP = 0 //
//Citizen PD sites
var dpdIP = 0 //
var vpdIP = 0 //
var saspdIP = 0 //
var sasprdIP = 0 //
var sdsoIP = 0 //
var docIP = 0 //
//Citizen City Hall etc
var challIP = 0 //
var lsiaIP = 0 //
//Citizen IAA
var iaaIP = 0 //
var iaaarchIP = 0 //
var iaaextIP = 0 //
var iaabackIP = 0 //
//Citizen hacked
var hackedIP = 0 //
//Citizen watchers
var watchersIP = 0 //
//Citizen payphone
var payphoneIP = 0 //

// Get a random ephemeral port.
function randomPort() {
  return randomRange(49152, 65535)
}

// Turn an IP string into a number.
function getNumberFromIP(ip) {
  var array = ip.split(".")
  var number = 0
  if (array.length !== 4) {
    return NaN
  }
  for (var i = 3; i >= 0; i--) {
    if (array[i] < 0 || array[i] > 255 || typeof parseInt(array[i]) !== "number") {
      return NaN
    }
    number += (256 ** (3 - i)) * array[i]
  }
  return number
}

// Turn a number into an IP string.
function getIP(number) {
  var ip = ""
  for (var i = 0; i < 4; i++) {
    var pos = (256 ** (3 - i))
    var temp = Math.floor(number / pos)
    ip += temp
    number -= temp * pos
    if (i < 3) {
      ip += "."
    }
  }
  return ip
}

// IP ranges not allowed to be chosen. Formatted as [start (inclusive),length]. Sorted from lowest to highest.
var bannedIPs = [[0,16777216],[167772160,16777216],[1681915904,4194304],[2130706432,16777216],[2851995648,65536],[2886729728,1048576],[3221225472,256],[3221225984,256],[3227017984,256],[3232235520,65536],[3323068416,131072],[3325256704,256],[3405803776,256],[3758096384,268435456],[4026531840,268435455],[4294967295,1]]

// Sum of the lengths of all banned IP ranges.
var bannedIPLength = 0
for (var i of bannedIPs) {
  bannedIPLength += i[1]
}

// Generate a random IP.
function randomIP() {
  var rand = 0
  var found = false
  while (!found) {
    rand = randomRange(0, (256 ** 4 - (bannedIPLength + 1)))
    for (var i of bannedIPs) {
      if (rand >= i[0]) {
        rand += i[1]
      }
    }
    if (networks[rand] === undefined) {
      found = true
    }
  }
  return rand
}

// Turn an MAC string into a number.
function getNumberFromMAC(mac) {
  mac = mac.toUpperCase()
  if (mac.length !== 17 || mac[2] !== ":" || mac[5] !== ":" || mac[8] !== ":" || mac[11] !== ":" || mac[14] !== ":") {
    return NaN
  }
  var hex = mac.replace(/:/g, "")
  var add = ""
  for (var i = 0; i < hex.length; i++) {
    if (hex[i] === "0") {
      add += "0"
    } else {
      break
    }
  }
  var parsed = parseInt(hex, 16)
  if (add + parsed.toString(16).toUpperCase() !== hex) {
    return NaN
  }
  return parsed
}

// Turn a number into an MAC string.
function getMAC(number) {
  var array = Number(number).toString(16).toUpperCase().split("")
  while (array.length < 12) {
    array.unshift("0")
  }
  var hex = ""
  for (var i = 1; i < array.length; i += 2) {
    hex += array[i-1] + array[i]
    if (i !== array.length - 1) {
      hex += ":"
    }
  }
  return hex
}

// Generate a random MAC address.
function randomMAC() {
  var mac = 0
  var found = false
  while (!found) {
    mac = randomRange(0, 281474976710655)
    if (devices[mac] === undefined && (mac < 1577058304 || mac > 1593835519) && (mac < 1101088686080 || mac > 1101105463295)) {
      found = true
    }
  }
  return mac
}

/*
Network Data:
name - the name of the system
description - the description of the system
security - what you need to hack it
logs - what connections have happened on this network
instance - the instance that should be opened when connecting to it
data - miscelaneous data for instances
devices - a list of devices on the network, includes accessability
connections - a list of networks connected to this one
ex.
415523267: {name: "my network", description: "it's a network", security: TBA, instance: "network1", devices: {47185647: false, 412542121: true}, connections: [415627412,42178547612,32178541726]}
*/

/*
Device Data:
down - this device exist
name - the name of the system
description - the description of the system
files - the data on the computer
ex.
22417248: {name:"my system", description: "it's a system", security: TBA, files: [FILES GO HERE]}
*/

/*
File Data:
type - the type of file (does not exist for folders)
data - the data contained within the file
tags - un-editable identifiers for the file
Types:
dynamic - can be read and written to
readonly - can be read but not written to
static - cannot be read or written to
Tags:
os - if a system does not have an os file with the name "os.bin" it does not work
notes - if a system does not have a notes file with the name "notes.exe" the notes commands will not work.
ex.
files: {"myDocuments": {"apple": {type: "dynamic", data:["hello","i am a genius"]}}, "myApps": {"notes.exe": {type: "static", tags: ["notes"]}}}
*/

// Creates the player network and device, the bank, and the shop.
function createStartingNetworks() {
  playerNetwork = randomIP()
  playerHost = randomMAC()
  devices[playerHost] = {name: "Watcher Shell Node", description: "Remote Machine #0182.", files: getBasicFiles(), down: false}
  networks[playerNetwork] = {name: "Watcher Shell Network", description: "Private Watcher Network.", devices: {}, security: 5}
  networks[playerNetwork].devices[playerHost] = true
  //Citizen - Dwango chat IP
  chatbbsIP = randomIP()  
  bankIP = randomIP()
  shopIP = randomIP()
  fenceIP = randomIP()
  //Citizen - fib IP assigned
  fibIP = randomIP()
  fibextIP = randomIP()
  fiblsIP = randomIP()
  fibvcIP = randomIP()
  fiblcIP = randomIP()
  //Citizen - populated sites
  mentorIP = randomIP()
  cerberusIP = randomIP()
  cerberusindIP = randomIP()
  cerberusarchIP = randomIP()
  cerberuspdIP = randomIP()
  saiIP = randomIP()
  talonIP = randomIP()
  spadesIP = randomIP()
  infobattleIP = randomIP()
  lspiIP = randomIP()
  russianIP = randomIP()
  bcsIP = randomIP()
  psbIP = randomIP()
  penrisIP = randomIP()
  dssIP = randomIP()
  mazeIP = randomIP()
  lombankIP = randomIP()
  kaytonIP = randomIP()
  udepotIP = randomIP()
  iolIP = randomIP()
  //PD Sites
  dpdIP = randomIP()
  vpdIP = randomIP()
  saspdIP = randomIP()
  sasprdIP = randomIP()
  sdsoIP = randomIP()
  docIP = randomIP()
  //City Hall etc
  challIP = randomIP()
  lsiaIP = randomIP()
  iaaIP = randomIP()
  //Citizen - IAA
  iaaarchIP = randomIP()
  iaaextIP = randomIP()
  iaabackIP = randomIP()
  //Citizen - Hacked
  hackedIP = randomIP()
  //Citizen - Watchers
  watchersIP = randomIP()
  //Citizen - Payphones
  payphoneIP = randomIP()
  //Citizen - devices
  //Citizen - BCS Bank devices 
  	devices[9566772332395] = {name:"BCS MainServ", description: "BCS Primary Server", security: 3, files: getBasicFiles()}
    devices[7977721851563] = {name:"BCS SecServ", description: "BCS Security System", security: 4, files: getBasicFiles()}
    devices[7920215743863] = {name:"BCS CashSys", description: "BCS Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[9149313923270] = {name:"BCS Archive", description: "BCS Backup Server", security: 5, files: {"Users":{"admin":{"BCS_Financial_Data":{"bcs_accounts_credit.fve": {type: "encrypted", data:["                                             uS3Ro4Mo2LEtWqFvRk6K mP8yabvRVolrNqkLXdS4    gNiyILxvCMP3bfOuLdbG XeNMhIrsv5zrL8CJMPcW    PVgugndSdU2neDcdILLs H6f1eVTD9hfF8iGdpBZe    iDuWDPHLhet8dlKikAQ0 uYVYezsYhKNnlo8RyJGo    kjUYYOv15SSkWb1fBvz5 tIBnLvFI0LTFU1XUo1uI    XUuRfjhZywRqJFnvZ5qu hasapxCKP3zDKKceYZ3X    PmLBvkkdoJaf0V8LRvhv kJkrO4RH7ZxaFKGTLhkD    weSCI9Unw8oXIHXhp2m9 CU25wrmGMFiPTch832tj    RVWe130L5ZRSvkROt8n9 FH4dapxnefe0JQd536pe    ytUZfceVh22rnPmjLVIM Ykrw78z6ZVxrOVRSpGJc    v8Sl50Sa674M7jckuN8a LIHWLMyQa8BA8f2p2oCn    sVJ5pC0NGg2g37rvyBIC tegfPJIcBYPxHeWlx7Ld    iOU3dnDv4RU2bQmdBqvm bYCnmzslPyMKbWn4Zz4D    n3TvTkjzc3hGEm4aRoHd cZmvnC3QzGFyY0AYKKuO    8hvizr9ujsGYhan1dadq IDp5v7I9RBMEw8pcPTCK    lvb31XIM52F1EDSvFRwl lOgtbTjMT4sB0VRSAYXu    TJFTezxGICm13HWQLRbO TBpXyZZAVRalJNotFCEM    qdOnN2osjof26t38usIX ZGHyHqxqAODwtRo0j7Fg    xNa7V6EPWgb2MmrlYa3p PmOrhpG3SeTgOXrtXqzm    END OF FILE                                  "]},"bcs_accounts_loans.fve": {type: "encrypted", data:["                                             LjvyIEtC3tlf29Vn2Dhe ZtNMPwZju4NK7OOMEfiU    R36UPFBT3bSNidj6c5wt HLtrCRViIifsP5oWvS9n    otWNid9TfrpNS7tVWAf0 VBPdnzURazNEHyK74Iaw    uueA581myhL3IASYEKSq iDc6MpWWTqDywdfTeucy    YPA633YBqFrxrUnJKRTA VaUKu77ZjU73RIzyz8Km    EaetLSkXRCWCXjE9opxS eQNWUaMMhokevxCSHGph    kaXRug0M1pbr4WCKINlT 7uYHZK7YpEu5CHhsZG6N    wH5rhsVcApn77vrUQBDU PpO7Q2d2HMig7p3U142Y    kjDD7MHMlkUl6siyNuy3 PDKY83uO4hMxz5aiPw2A    6VmuGj0yMtKbuMUI0Yfy A6APaxVeQqYiMUwVf5fu    h2HjmYYvmZZnOdwqCPCC IceOd09B7cGlUPsWPgR6    bMr4esNpr2h2SnypzSMd sDYsCUcubJKzhplnTF7c    kj3uykJ7FDz9mmj9Tbp5 V9kV1lsAHOAf73CWNsAM    UoscWOVkRVepHqR2bGlO CxdLBV0f9FFS2siOmGn4    dZ3OEo6BoL8IImaebA5g tUzBB8v0iDu15kxffbY3    L4PCZzvGSyvqnUYqCa9H NVweeRYcY8EIBjKHRmZr    Tz1vQfJFJKpEBSX3DiPk bLG4UUSGXN8hP5G5s8r8    0rgxb2jl1ZrVuAt4nfct EBXCDdL3t1ZR5khRDb2o    gfVELYsCyKlCVadUpFHP rOD3J1jOXLlV0iMdmjQv    END OF FILE                                  "]},	"bcs_accounts_mortgages.fve": {type: "encrypted", data:["                                             JRQXiSa9PUtyJxMVQATi mBHzCBzMVej7HNhzqypN    xUWiosulo8Z4wE7lt90s HL6of45xWIb5VC3g7EL0    uwDjRqo57X6rk7fRSiyj 2a5OC25IbCqfEwjxSnBi    JYNpHrtpVKOzE55EuNcE JTli2URVhZAEtOjQI6Re    EJMXvk6kL9eqakCH5GIm NK215AQ2rsc5djRkPTTV    Lpx8WvNJOfwcvk7pf1pD Y8rLlCxmBSA0yzXpvDfQ    FoXcYq8lPoW6L05921Cc qUoQDsvwX7fGJXVUCk1H    Sk5a61uX5DzOYAP5LYOA LRA418GBecAp9pMdnYmH    jeQ498HoO84HYzUKp5Ta cBDTCgqY7CHxuWmEIqHS    mJ3k1p0dN95UmzgMnsnJ x42fZPFT5GdUWSK1VCJG    gH8afE77NdW79tDRAzJM KnsBC3VawZkhFaE3uP0z    JLiUKomh1jXGj8chR2uX g6VJA9gScrpSkjZaoSo8    Jgocn6XB0x2LJHodKFmP En4F7fgmW4iLrJ8tSjIP    o9IKjyUi48UeidIelHdf 09B2aOWE2PFd0QpK9cE3    KAUjnPNsV4MVLECp785c 6oEbI22vo9QjqOqLZW5f    XW1SheoxIWzJlCzFYjbQ URII2L2l5rgsbPeOWpPX    0Aem707KypcCLUijHNJr Dh53lMydzJfnfhpDSBCH    coaEah7qEG6RZMpnFby5 Zcy2zaUaMYSPkS92dXaz    KU2iTCI47GXbF5vc5nlB BbPcRXlZ2b2uCeGlkkrs    END OF FILE                                  "]},	"bcs_accounts_pensions.fve": {type: "encrypted", data:["                                             0YVmyVZmocFeNL8NZX7W osix737FtERm2xIx4P7v    IQHr3pl8ylUpRqhQvqkx X6Xkm28SHEjTuZo90TqD    v4safXGtdL7zqiFtJnJ8 J9NnTAidMQvfCr9Lq7YW    JgNxrMb4k02UyGCz4NZ6 jt2BvVrGUcDVDU442Y84    l6jELX46KbHdJdiN4Dmk 4L99Qnds4oGqgXFvfYWY    VJpInPjO75L6oVP3RQZE FG0URxTGNR7xo4XPCt4v    StmnLmmukxKzA7f3V0Fs sAsky8THM80o016cZWaN    sDoRaDRQLz8JiQJ8F79q bCJRQUA7xNAZV7GNHUc2    JUhG0tLmWLCw1tskIF64 rczSyG6B8Psc25leHuvD    e4qctdPCRrrIbvJWKvSl tWWYMl3clQSJZyNRcCME    5OIAHa25EgKTAQDR3CxK 1YKV5su3gc12xktEzhU6    BO3VsqBoMWBkvYPXROry FVOQH2AkfzaWU5eMy2hi    6ifhRhLN5A7djTKwP3K3 VxWPSBgvtTo6syDGi7sX    qruftc2pb7aCR1gHkaJs 4z4IOk5Jxab8HyXo2L9h    eqjcMF4IHg5z21qMxZoz SkpbICg740QQ0IX26mUO    wOmNwqVeYKAQhwTtJHlH P7Hv1VChk6i2I185idyA    7nDXju6MUkv6txqcZLBM sDYcUjB5J63cRqcm5wxm    cNHlQn9A9qhloZEWhTWj JAJkYKRL65qQ6KuIZW0P    1PCB1ujGneotJ9Fszok0 grabZNii6PcfiMot7Jyr    END OF FILE                                  "]}, "bcs_accounts_savings.fve": {type: "encrypted", data:["                                             0M2ac0cwRfmt868MLmqp afUuFARDHBJa4G1w0CdJ    UKnJCpVE4Zy3IzCaTfEs HZRGYOpZhd2XsYXPMWhN    chH9VrtP3JjVdvmGWqbY cndH5TCTggb9mXdHgxGN    gAoliXwEZousnzytlBPO ZMV9DERxg6pXpwle9vGE    eY6Nn4uDq1EgQbla2Bxr X4nsG7D7PAdgy7AUvYqv    KCojiUVjLS3apZxZEzGI igSMKOn95LxorePt6XFj    bEZEgCQV1ORVxPcmaH9d LZwtknYzHbanUIWeYLXx    Q5Fi1TAITdhSNVSbKsMr q0VwYS0EmBUC4PA0Hf4a    d7jgmdNkNAHWY6IW0xff tx3n31QrFYqrT45POX4o    OPQJfQkl7tE1Yi3dnffZ Bq3RtEMbvAP7696QBqbX    mei4KxL6b96F8V2p3f12 I7xnuMQtFqgPQ9KdJEer    HfnAGuczUcovEHZSZsrq 56CW1pQjXjC4Y5dD7rdZ    QumuV6ptQ8wuBnZrrU6D vdYdRFe4sFmsNexqHssb    DsBtrYjQSXWxvprVNbpw BOhMOY4PMJd1kaDjJuaT    vcE4ONZ9nKstYmpSnEB5 Zp4AEvHRuh9IOvqLtVWI    Mcc1SAnjYc5kmynG5mAv M7hEuJMnMModyyqVZQCd    XnSLe8LTQjRBrkK0M0wI upHfcwgouAR2NMp1oa9A    doNpwgVHpLPtyiM8wXJm 5FN2MbyPSrW3bIKiiK81    LYJjI00dWAbF8zIwC38j vMRO9fIVzlJOOrCxYMwc    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
  //Citizen -PSB Bank files 
  	devices[6036721982960] = {name:"PSB MainServ", description: "PSB Primary Server", security: 3, files: getBasicFiles()}
    devices[7416299110884] = {name:"PSB SecServ", description: "PSB Security System", security: 4, files: getBasicFiles()}
    devices[5950050401222] = {name:"PSB CashSys", description: "PSB Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[6537239917136] = {name:"PSB Archive", description: "PSB Backup Server", security: 5, files: {"Users":{"admin":{"PSB_Financial_Data":{"psb_accounts_credit.fve": {type: "encrypted", data:["                                             0R2fh0hbWkry868RQrvu fkZzKFWIMGOf4L1b0HiO    ZPsOHuAJ4Ed3NeHfYkJx MEWLDTuEmi2CxDCURBmS    hmM9AwyU3OoAiarLBvgD hsiM5YHYllg9rCiMlcLS    lFtqnCbJEtzxsedyqGUT ERA9IJWcl6uCubqj9aLJ    jD6Ss4zIv1JlVgqf2Gcw C4sxL7I7UFild7FZaDva    PHtonZAoQX3fuEcEJeLN nlXRPTs95QctwjUy6CKo    gJEJlHVA1TWAcUhrfM9i QEbypsDeMgfsZNBjDQCc    V5Kn1YFNYimXSAXgPxRw v0AbDX0JrGZH4UF0Mk4f    i7olriSpSFMBD6NB0ckk yc3s31VwKDvwY45UTC4t    TUVOkVpq7yJ1Dn3iskkE Gv3WyJRgaFU7696VGvgC    rjn4PcQ6g96K8A2u3k12 N7cszRVyKvlUV9PiOJjw    MksFLzheZhtaJMEXExwv 56HB1uVoCoH4D5iI7wiE    VzrzA6uyV8bzGsEwwZ6I aiDiWKj4xKrxSjcvMxxg    IxGywDoVXCBcauwASgub GTmRTD4UROi1pfIoOzfY    ahJ4TSE9sPxyDruXsJG5 Eu4FJaMWzm9NTavQyABN    Rhh1XFsoDh5prdsL5rFa R7mJzORsRRtiddvAEVHi    CsXQj8QYVoWGwpP0R0bN zuMkhbltzFW2SRu1tf9F    itSublAMuQUydnR8bCOr 5KS2RgdUXwB3gNPnnP81    QDOoN00iBFgK8eNbH38o aRWT9kNAeqOTTwHcDRbh    END OF FILE                                  "]},"psb_accounts_loans.fve": {type: "encrypted", data:["                                             0DArdAErthKjSQ8SEC7B txnc737KyJWr2cNc4U7a    NVMw3uq8dqZuWvmVavpc C6Cpr28XMJoYzEt90YvI    a4xfkCLyiQ7evnKyOsO8 O9SsYFniRVakHw9Qv7DB    OlScwRg4p02ZdLHe4SE6 oy2GaAwLZhIAIZ442D84    q6oJQC46PgMiOinS4Irp 4Q99Vsix4tLvlCKakDBD    AOuNsUoT75Q6tAU3WVEJ KL0ZWcYLSW7ct4CUHy4a    XyrsQrrzpcPeF7k3A0Kx xFxpd8YMR80t016hEBfS    xItWfIWVQe8OnVO8K79v gHOWVZF7cSFEA7LSMZh2    OZmL0yQrBQHb1yxpNK64 wheXdL6G8Uxh25qjMzaI    j4vhyiUHWwwNgaOBPaXq yBBDRq3hqVXOEdSWhHRJ    5TNFMf25JlPYFVIW3HcP 1DPA5xz3lh12cpyJemZ6    GT3AxvGtRBGpaDUCWTwd KATVM2FpkefBZ5jRd2mn    6nkmWmQS5F7ioYPbU3P3 AcBUXGlayYt6xdILn7xC    vwzkyh2ug7fHW1lMpfOx 4e4NTp5Ocfg8MdCt2Q9m    jvohRK4NMl5e21vRcEte XpugNHl740VV0NC26rZT    bTrSbvAjDPFVmbYyOMqM U7Ma1AHmp6n2N185nidF    7sICoz6RZpa6ycvhEQGR xIDhZoG5O63hWvhr5bcr    hSMqVs9F9vmqtEJBmYBo OFOpDPWQ65vV6PzNEB0U    1UHG1zoLsjtyO9Kxetp0 lwfgESnn6UhknRty7Odw    END OF FILE                                  "]},	"psb_accounts_mortgages.fve": {type: "encrypted", data:["                                             EMLSdNv9KPotEsHQLVOd hWCuXWuHQze7CIcultkI    sPRdjnpgj8U4rZ7go90n CG6ja45sRDw5QX3b7ZG0    prYeMlj57S6mf7aMNdte 2v5JX25DwXlaZresNiWd    ETIkCmokQFJuZ55ZpIxZ EOgd2PMQcUVZoJeLD6Mz    ZEHSqf6fG9zlvfXC5BDh IF215VL2mnx5yeMfKOOQ    Gks8RqIEJarxqf7ka1kY T8mGgXshWNV0tuSkqYaL    AjSxTl8gKjR6G05921Xx lPjLYnqrS7aBESQPXf1C    Nf5v61pS5YuJTVK5GTJV GMV418BWzxVk9kHyiThC    ezL498CjJ84CTuPFk5Ov xWYOXblT7XCspRhZDlCN    hE3f1k0yI95PhubHiniE s42aUKAO5ByPRNF1QXEB    bC8vaZ77IyR79oYMVuEH FinWX3QvrUfcAvZ3pK0u    EGdPFjhc1eSBe8xcM2pS b6QEV9bNxmkNfeUvjNj8    Ebjxi6SW0s2GECjyFAhK Zi4A7abhR4dGmE8oNeDK    j9DFetPd48PzdyDzgCya 09W2vJRZ2KAy0LkF9xZ3    FVPeiKInQ4HQGZXk785x 6jZwD22qj9LelJlGUR5a    SR1NczjsDRuEgXuATewL PMDD2G2g5mbnwKzJRkKS    0Vzh707FtkxXGPdeCIEm Yc53gHtyuEaiackYNWXC    xjvZvc7lZB6MUHkiAwt5 Uxt2uvPvHTNKfN92ySvu    FP2dOXD47BSwA5qx5igW WwKxMSgU2w2pXzBgffmn    END OF FILE                                  "]},	"psb_accounts_pensions.fve": {type: "encrypted", data:["                                             QoadNJyH3yqk29As2Imj EySRUbEoz4SP7TTRJknZ    W36ZUKGY3gXSnio6h5by MQywHWAnNnkxU5tBaX9s    tyBSni9YkwuSX7yABFk0 AGUiseZWfeSJMdP74Nfb    zzjF581rdmQ3NFXDJPXv nIh6RuBBYvIdbikYjzhd    DUF633DGvKwcwZsOPWYF AfZPz77EoZ73WNede8Pr    JfjyQXpCWHBHCoJ9tucX jVSBZfRRmtpjacHXMLum    pfCWzl0R1ugw4BHPNSqY 7zDMEP7DuJz5HMmxEL6S    bM5wmxAhFus77awZVGIZ UuT7V2i2MRnl7u3Z142D    poII7RMRqpZq6xndSzd3 UIPD83zT4mRce5fnUb2F    6ArzLo0dRyPgzRZN0Dkd F6FUfcAjVvDnRZbAk5kz    m2MorDDarEEsTibvHUHH NhjTi09G7hLqZUxBUlW6    gRw4jxSuw2m2XsdueXRi xIDxHZhzgOPemuqsYK7h    po3zdpO7KIe9rro9Ygu5 A9pA1qxFMTFk73HBSxFR    ZtxhBTApWAjuMvW2gLqT HciQGA0k9KKX2xnTrLs4    iE3TJt6GtQ8NNrfjgF5l yZeGG8a0nIz15pckkgD3    Q4UHEeaLXdavsZDvHf9M SAbjjWDhD8JNGoPMWrEw    Ye1aVkOKOPuJGXC3InUp gQL4ZZXLCS8mU5L5x8w8    0wlcg2oq1EwAzFy4skhy JGCHIiQ3y1EW5pmWIg2t    lkAJQDxHdPqHAfiZuKMU wTI3O1oTCQqA0nRiroVa    END OF FILE                                  "]}, "psb_accounts_savings.fve": {type: "encrypted", data:["                                             zX3Wt4Rt2QJyBvKaWp6P rU8dfgaWAtqwSvpQCiX4    lSndNQcaHRU3gkTzQigL CjSRmNwxa5ewQ8HORUhB    UAlzlsiXiZ2sjIhiNQQx M6k1jAYI9mkK8nLiuGEj    nIzBIUMQmjy8iqPnpFV0 zDADjexDmPSsqt8WdOLt    poZDDTa15XXpBg1kGae5 yNGsQaKN0QYKZ1CZt1zN    CZzWkomEdbWvOKsaE5vz mfxfucHPU3eIPPhjDE3C    UrQGappitOfk0A8QWama pOpwT4WM7EcfKPLYQmpI    bjXHN9Zsb8tCNMCmu2r9 HZ25bwrLRKnUYhm832yo    WABj130Q5EWXapWTy8s9 KM4ifucsjkj0OVi536uj    dyZEkhjAm22wsUroQANR Dpwb78e6EAcwTAWXuLOh    a8Xq50Xf674R7ohpzS8f QNMBQRdVf8GF8k2u2tHs    xAO5uH0SLl2l37wadGNH yjlkUONhGDUcMjBqc7Qi    nTZ3isIa4WZ2gVriGvar gDHsrexqUdRPgBs4Ee4I    s3YaYpoeh3mLJr4fWtMi hErasH3VeLKdD0FDPPzT    8manew9zoxLDmfs1ifiv NIu5a7N9WGRJb8uhUYHP    qag31CNR52K1JIXaKWbq qTlygYoRY4xG0AWXFDCz    YOKYjecLNHr13MBVQWgT YGuCdEEFAWfqOStyKHJR    viTsS2txotk26y38zxNC ELMdMvcvFTIbyWt0o7Kl    cSf7A6JUBlg2RrwqDf3u UrTwmuL3XjYlTCwyCver    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
   //Citizen -PENRIS Bank files  
  	devices[1845617871137] = {name:"PEN MainServ", description: "PEN Primary Server", security: 3, files: getBasicFiles()}
    devices[7661491175580] = {name:"PEN SecServ", description: "PEN Security System", security: 4, files: getBasicFiles()}
    devices[2310019594878] = {name:"PEN CashSys", description: "PEN Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[6159843817133] = {name:"PEN Archive", description: "PEN Backup Server", security: 5, files: {"Users":{"admin":{"PEN_Financial_Data":{"pen_accounts_credit.fve": {type: "encrypted", data:["                                             0U2ik0keZnub868UTuyx inCcNIZLPJRi4O1e0KlR    CSvRKxDM4Hg3QhKiBnMa PHZOGWxHpl2FaGFXUEpV    kpP9DzbX3RrDlduOEyjG kvlP5BKBooj9uFlPofOV    oIwtqFeMHwcavhgbtJXW HUD9LMZfo6xFxetm9dOM    mG6Vv4cLy1MoYjti2Jfz F4vaO7L7XIlog7ICdGyd    SKwrqCDrTA3ixHfHMhOQ qoAUSWv95TfwzmXb6FNr    jMHMoKYD1WZDfXkuiP9l THebsvGhPjivCQEmGTFf    Y5Nq1BIQBlpAVDAjSaUz y0DeGA0MuJCK4XI0Pn4i    l7roulVsVIPEG6QE0fnn bf3v31YzNGyzB45XWF4w    WXYRnYst7bM1Gq3lvnnH Jy3ZbMUjdIX7696YJyjF    umq4SfT6j96N8D2x3n12 Q7fvcUYbNyoXY9SlRMmz    PnvIOckhCkwdMPHAHazy 56KE1xYrFrK4G5lL7zlH    YcucD6xbY8ecJvHzzC6L dlGlZNm4aNuaVmfyPaaj    LaJbzGrYAFEfdxzDVjxe JWpUWG4XURl1siLrRciB    dkM4WVH9vSabGuxAvMJ5 Hx4IMdPZcp9QWdyTbDEQ    Ukk1AIvrGk5sugvO5uId U7pMcRUvUUwlggyDHYKl    FvATm8TBYrZJzsS0U0eQ cxPnkeowcIZ2VUx1wi9I    lwVxeoDPxTXbgqU8eFRu 5NV2UjgXAzE3jQSqqS81    TGRrQ00lEIjN8hQeK38r dUZW9nQDhtRWWzKfGUek    END OF FILE                                  "]},"pen_accounts_loans.fve": {type: "encrypted", data:["                                             0GDugDHuwkNmVT8VHF7E waqf737NbMZu2fQf4X7d    QYPz3xt8gtCxZypYdysf F6Fsu28APMrBcHw90ByL    d4ainFOblT7hyqNbRvR8 R9VvBIqlUYdnKz9Ty7GE    RoVfzUj4s02CgOKh4VH6 rb2JdDzOCkLDLC442G84    t6rMTF46SjPlRlqV4Lus 4T99Yvla4wOyoFNdnGEG    DRxQvXrW75T6wDX3ZYHM NO0CZfBOVZ7fw4FXKb4d    AbuvTuucsfShI7n3D0Na aIasg8BPU80w016kHEiV    aLwZiLZYTh8RqYR8N79y jKRZYCI7fVIHD7OVPCk2    RCpO0bTuETKe1basQN64 zkhAgO6J8Xak25tmPcdL    m4ykblXKZzzQjdRESdAt bEEGUt3ktYARHgVZkKUM    5WQIPi25MoSBIYLZ3KfS 1GSD5ac3ok12fsbMhpC6    JW3DayJwUEJsdGXFZWzg NDWYP2IsnhiEC5mUg2pq    6qnpZpTV5I7lrBSeX3S3 DfEXAJodbBw6agLOq7aF    yzcnbk2xj7iKZ1oPsiRa 4h4QWs5Rfij8PgFw2T9p    myrkUN4QPo5h21yUfHwh AsxjQKo740YY0QF26uCW    eWuVeyDmGSIYpeBbRPtP X7Pd1DKps6q2Q185qlgI    7vLFrc6UCsd6bfykHTJU aLGkCrJ5R63kZyku5efu    kVPtYv9I9yptwHMEpBEr RIRsGSZT65yY6ScQHE0X    1XKJ1crOvmwbR9Nahws0 ozijHVqq6XknqUwb7Rgz    END OF FILE                                  "]},	"pen_accounts_mortgages.fve": {type: "encrypted", data:["                                             RZYFqAi9XCbgRfUDYIBq uJPhKJhUDmr7PVphygxV    fCEqwactw8H4eM7tb90a PT6wn45fEQj5DK3o7MT0    ceLrZyw57F6zs7nZAqgr 2i5WK25QjKynMerfAvJq    RGVxPzbxDSWhM55McVkM RBtq2CZDpHIMbWrYQ6Zm    MRUFds6sT9myisKP5OQu VS215IY2zak5lrZsXBBD    Txf8EdVRWnekds7xn1xL G8zTtKfuJAI0ghFxdLnY    NwFkGy8tXwE6T05921Kk yCwYLadeF7nORFDCKs1P    As5i61cF5LhWGIX5TGWI TZI418OJmkIx9xUlvGuP    rmY498PwW84PGhCSx5Bi kJLBKoyG7KPfcEuMQyPA    uR3s1x0lV95CuhoUvavR f42nHXNB5OlCEAS1DKRO    oP8inM77VlE79bLZIhRU SvaJK3DieHspNiM3cX0h    RTqCSwup1rFOr8kpZ2cF o6DRI9oAkzxAsrHiwAw8    Rowkv6FJ0f2TRPwlSNuX Mv4N7nouE4qTzR8bArQX    w9QSrgCq48CmqlQmtPln 09J2iWEM2XNl0YxS9kM3    SICrvXVaD4UDTMKx785k 6wMjQ22dw9YryWyTHE5n    FE1ApmwfQEhRtKhNGrjY CZQQ2T2t5zoajXmWExXF    0Imu707SgxkKTCqrPVRz Lp53tUglhRnvnpxLAJKP    kwiMip7yMO6ZHUxvNjg5 Hkg2hiCiUGAXsA92lFih    SC2qBKQ47OFjN5dk5vtJ JjXkZFtH2j2cKmOtssza    END OF FILE                                  "]},	"pen_accounts_pensions.fve": {type: "encrypted", data:["                                             TrdgQMbK3btn29Dv2Lpm HbVUXeHrc4VS7WWUMnqC    Z36CXNJB3jAVqlr6k5eb PTbzKZDqQqnaX5wEdA9v    wbEVql9BnzxVA7bDEIn0 DJXlvhCZihVMPgS74Qie    ccmI581ugpT3QIAGMSAy qLk6UxEEByLgelnBmckg    GXI633GJyNzfzCvRSZBI DiCSc77HrC73ZQhgh8Su    MimbTAsFZKEKFrM9wxfA mYVECiUUpwsmdfKAPOxp    siFZco0U1xjz4EKSQVtB 7cGPHS7GxMc5KPpaHO6V    eP5zpaDkIxv77dzCYJLC XxW7Y2l2PUqo7x3C142G    srLL7UPUtsCt6aqgVcg3 XLSG83cW4pUfh5iqXe2I    6DucOr0gUbSjcUCQ0Gng I6IXifDmYyGqUCeDn5nc    p2PruGGduHHvWleyKXKK QkmWl09J7kOtCXaEXoZ6    jUz4maVxz2p2AvgxhAUl aLGaKCkcjRShpxtvBN7k    sr3cgsR7NLh9uur9Bjx5 D9sD1taIPWIn73KEVaIU    CwakEWDsZDmxPyZ2jOtW KflTJD0n9NNA2aqWuOv4    lH3WMw6JwT8QQuimjI5o bChJJ8d0qLc15sfnnjG3    T4XKHhdOAgdyvCGyKi9P VDemmZGkG8MQJrSPZuHz    Bh1dYnRNRSxMJAF3LqXs jTO4CCAOFV8pX5O5a8z8    0zofj2rt1HzDcIb4vnkb MJFKLlT3b1HZ5spZLj2w    onDMTGaKgStKDilCxNPX zWL3R1rWFTtD0qUlurYd    END OF FILE                                  "]}, "pen_accounts_savings.fve": {type: "encrypted", data:["                                             cA3Zw4Uw2TMbEyNdZs6S uX8gijdZDwtzVysTFlA4    oVqgQTfdKUX3jnWcTljO FmVUpQzad5hzT8KRUXkE    XDocovlAlC2vmLklQTTa P6n1mDBL9pnN8qOlxJHm    qLcELXPTpmb8ltSqsIY0 cGDGmhaGpSVvtw8ZgROw    srCGGWd15AAsEj1nJdh5 bQJvTdNQ0TBNC1FCw1cQ    FCcZnrpHgeZyRNvdH5yc piaixfKSX3hLSSkmGH3F    XuTJdsslwRin0D8TZdpd sRszW4ZP7HfiNSOBTpsL    emAKQ9Cve8wFQPFpx2u9 KC25ezuOUNqXBkp832br    ZDEm130T5HZAdsZWb8v9 NP4lixfvmnm0RYl536xm    gbCHnkmDp22zvXurTDQU Gsze78h6HDfzWDZAxORk    d8At50Ai674U7rkscV8i TQPETUgYi8JI8n2x2wKv    aDR5xK0VOo2o37zdgJQK bmonXRQkJGXfPmEtf7Tl    qWC3lvLd4ZC2jYulJydu jGKvuhatXgUSjEv4Hh4L    v3BdBsrhk3pOMu4iZwPl kHudvK3YhONgG0IGSScW    8pdqhz9craOGpiv1lily QLx5d7Q9ZJUMe8xkXBKS    tdj31FQU52N1MLAdNZet tWobjBrUB4aJ0DZAIGFc    BRNBmhfOQKu13PEYTZjW BJxFgHHIDZitRVwbNKMU    ylWvV2warwn26b38caQF HOPgPyfyIWLebZw0r7No    fVi7D6MXEoj2UuztGi3x XuWzpxO3AmBoWFzbFyhu    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
   //Citizen -MAZE Bank files  
  	devices[7932841996235] = {name:"MAZE MainServ", description: "MAZE Primary Server", security: 3, files: getBasicFiles()}
    devices[5370827821993] = {name:"MAZE SecServ", description: "MAZE Security System", security: 4, files: getBasicFiles()}
    devices[7760647140406] = {name:"MAZE CashSys", description: "MAZE Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[7767308210925] = {name:"MAZE Archive", description: "MAZE Backup Server", security: 5, files: {"Users":{"admin":{"MAZE_Financial_Data":{"maz_accounts_credit.fve": {type: "encrypted", data:["                                             0W2km0mgBpwd868WVwaz kpEePKBNRLTk4Q1g0MnT    EUxTMzFO4Ji3SjMkDpOc RJBQIYzJrn2HcIHZWGrX    mrR9FbdZ3TtFnfwQGalI mxnR5DMDqql9wHnRqhQX    qKyvsHgOJyecxjidvLZY JWF9NOBhq6zHzgvo9fQO    oI6Xx4eNa1OqAlvk2Lhb H4xcQ7N7ZKnqi7KEfIaf    UMytsEFtVC3kzJhJOjQS sqCWUYx95VhyboZd6HPt    lOJOqMAF1YBFhZmwkR9n VJgduxIjRlkxESGoIVHh    A5Ps1DKSDnrCXFClUcWb a0FgIC0OwLEM4ZK0Rp4k    n7tqwnXuXKRGI6SG0hpp dh3x31AbPIabD45ZYH4y    YZATpAuv7dO1Is3nxppJ La3BdOWlfKZ7696ALalH    wos4UhV6l96P8F2z3p12 S7hxeWAdPaqZA9UnTOob    RpxKQemjEmyfORJCJcba 56MG1zAtHtM4I5nN7bnJ    AeweF6zdA8geLxJbbE6N fnInBPo4cPwcXohaRccl    NcLdbItACHGhfzbFXlzg LYrWYI4ZWTn1ukNtTekD    fmO4YXJ9xUcdIwzCxOL5 Jz4KOfRBer9SYfaVdFGS    Wmm1CKxtIm5uwixQ5wKf W7rOeTWxWWyniiaFJAMn    HxCVo8VDAtBLbuU0W0gS ezRpmgqyeKB2XWz1yk9K    nyXzgqFRzVZdisW8gHTw 5PX2WliZCbG3lSUssU81    VITtS00nGKlP8jSgM38t fWBY9pSFjvTYYbMhIWgm    END OF FILE                                  "]},"maz_accounts_loans.fve": {type: "encrypted", data:["                                             TBAHsCk9ZEdiThWFAKDs wLRjMLjWFot7RXrjaizX    hEGsycevy8J4gO7vd90c RV6yp45hGSl5FM3q7OV0    egNtBay57H6bu7pBCsit 2k5YM25SlMapOgthCxLs    TIXzRbdzFUYjO55OeXmO TDvs2EBFrJKOdYtAS6Bo    OTWHfu6uV9oakuMR5QSw XU215KA2bcm5ntBuZDDF    Vzh8GfXTYpgmfu7zp1zN I8bVvMhwLCK0ijHzfNpA    PyHmIa8vZyG6V05921Mm aEyANcfgH7pQTHFEMu1R    Cu5k61eH5NjYIKZ5VIYK VBK418QLomKz9zWnxIwR    toA498RyY84RIjEUz5Dk mLNDMqaI7MRheGwOSaRC    wT3u1z0nX95EwjqWxcxT h42pJZPD5QnEGCU1FMTQ    qR8kpO77XnG79dNBKjTW UxcLM3FkgJurPkO3eZ0j    TVsEUywr1tHQt8mrB2eH q6FTK9qCmbzCutJkyCy8    Tqymx6HL0h2VTRynUPwZ Ox4P7pqwG4sVbT8dCtSZ    y9SUtiEs48EosnSovRnp 09L2kYGO2ZPn0AzU9mO3    UKEtxZXcF4WFVOMz785m 6yOlS22fy9AtaYaVJG5p    HG1CroyhSGjTvMjPItlA EBSS2V2v5bqclZoYGzZH    0Kow707UizmMVEstRXTb Nr53vWinjTpxprzNCLMR    mykOkr7aOQ6BJWzxPli5 Jmi2jkEkWICZuC92nHkj    UE2sDMS47QHlP5fm5xvL LlZmBHvJ2l2eMoQvuubc    END OF FILE                                  "]},	"maz_accounts_mortgages.fve": {type: "encrypted", data:["                                             0IFwiFJwymPoXV8XJH7G ycsh737PdOBw2hSh4Z7f    SARb3zv8ivEzBarAfauh H6Huw28CROtDeJy90DaN    f4ckpHQdnV7jasPdTxT8 T9XxDKsnWAfpMb9Va7IG    TqXhbWl4u02EiQMj4XJ6 td2LfFbQEmNFNE442I84    v6tOVH46UlRnTnsX4Nwu 4V99Axnc4yQaqHPfpIGI    FTzSxZtY75V6yFZ3BAJO PQ0EBhDQXB7hy4HZMd4f    CdwxVwweuhUjK7p3F0Pc cKcui8DRW80y016mJGkX    cNyBkNBAVj8TsAT8P79a lMTBAEK7hXKJF7QXREm2    TErQ0dVwGVMg1dcuSP64 bmjCiQ6L8Zcm25voRefN    o4amdnZMBbbSlfTGUfCv dGGIWv3mvACTJiXBmMWO    5YSKRk25OqUDKANB3MhU 1IUF5ce3qm12hudOjrE6    LY3FcaLyWGLufIZHBYbi PFYAR2KupjkGE5oWi2rs    6sprBrVX5K7ntDUgZ3U3 FhGZCLqfdDy6ciNQs7cH    abepdm2zl7kMB1qRukTc 4j4SYu5Thkl8RiHy2V9r    oatmWP4SRq5j21aWhJyj CuzlSMq740AA0SH26wEY    gYwXgaFoIUKArgDdTRvR Z7Rf1FMru6s2S185sniK    7xNHte6WEuf6dhamJVLW cNImEtL5T63mBamw5ghw    mXRvAx9K9arvyJOGrDGt TKTuIUBV65aA6UeSJG0Z    1ZML1etQxoydT9Pcjyu0 qbklJXss6ZmpsWyd7Tib    END OF FILE                                  "]},	"maz_accounts_pensions.fve": {type: "encrypted", data:["                                             VtfiSOdM3dvp29Fx2Nro JdXWZgJte4XU7YYWOpsE    B36EZPLD3lCXsnt6m5gd RVdbMBFsSspcZ5yGfC9x    ydGXsn9DpbzXC7dFGKp0 FLZnxjEBkjXORiU74Skg    eeoK581wirV3SKCIOUCa sNm6WzGGDaNignpDoemi    IZK633ILaPbhbExTUBDK FkEUe77JtE73BSjij8Uw    OkodVCuHBMGMHtO9yzhC oAXGEkWWryuofhMCRQzr    ukHBeq0W1zlb4GMUSXvD 7eIRJU7IzOe5MRrcJQ6X    gR5brcFmKzx77fbEALNE ZzY7A2n2RWsq7z3E142I    utNN7WRWvuEv6csiXei3 ZNUI83eY4rWhj5ksZg2K    6FweQt0iWdUleWES0Ipi K6KZkhFoAaIsWEgFp5pe    r2RtwIIfwJJxYngaMZMM SmoYn09L7mQvEZcGZqB6    lWb4ocXzb2r2CxizjCWn cNIcMEmelTUjrzvxDP7m    ut3eiuT7PNj9wwt9Dlz5 F9uF1vcKRYKp73MGXcKW    EycmGYFuBFozRaB2lQvY MhnVLF0p9PPC2csYwQx4    nJ3YOy6LyV8SSwkolK5q dEjLL8f0sNe15uhpplI3    V4ZMJjfQCifaxEIaMk9R XFgooBImI8OSLtURBwJb    Dj1fApTPTUzOLCH3NsZu lVQ4EECQHX8rZ5Q5c8b8    0bqhl2tv1JbFeKd4xpmd OLHMNnV3d1JB5urBNl2y    qpFOVIcMiUvMFknEzPRZ bYN3T1tYHVvF0sWnwtAf    END OF FILE                                  "]}, "maz_accounts_savings.fve": {type: "encrypted", data:["                                             eC3By4Wy2VOdGaPfBu6U wZ8iklfBFyvbXauVHnC4    qXsiSVhfMWZ3lpYeVnlQ HoXWrSbcf5jbV8MTWZmG    ZFqeqxnCnE2xoNmnSVVc R6p1oFDN9rpP8sQnzLJo    sNeGNZRVrod8nvUsuKA0 eIFIojcIrUXxvy8BiTQy    utEIIYf15CCuGl1pLfj5 dSLxVfPS0VDPE1HEy1eS    HEeBptrJigBaTPxfJ5ae rkckzhMUZ3jNUUmoIJ3H    ZwVLfuunyTkp0F8VBfrf uTubY4BR7JhkPUQDVruN    goCMS9Exg8yHSRHrz2w9 ME25gbwQWPsZDmr832dt    BFGo130V5JBCfuBYd8x9 PR4nkzhxopo0TAn536zo    idEJpmoFr22bxZwtVFSW Iubg78j6JFhbYFBCzQTm    f8Cv50Ck674W7tmueX8k VSRGVWiAk8LK8p2z2yMx    cFT5zM0XQq2q37bfiLSM doqpZTSmLIZhRoGvh7Vn    sYE3nxNf4BE2lAwnLafw lIMxwjcvZiWUlGx4Jj4N    x3DfDutjm3rQOw4kByRn mJwfxM3AjQPiI0KIUUeY    8rfsjb9etcQIrkx1nkna SNz5f7S9BLWOg8zmZDMU    vfl31HSW52P1ONCfPBgv vYqdlDtWD4cL0FBCKIHe    DTPDojhQSMw13RGAVBlY DLzHiJJKFBkvTXydPMOW    anYxX2yctyp26d38ecSH JQRiRahaKYNgdBy0t7Pq    hXk7F6OZGql2WwbvIk3z ZwYbrzQ3CoDqYHbdHajw    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
   //Citizen -LOMBANK Bank files  
  	devices[6101352152177] = {name:"LOM MainServ", description: "LOM Primary Server", security: 3, files: getBasicFiles()}
    devices[8545099794672] = {name:"LOM SecServ", description: "LOM Security System", security: 4, files: getBasicFiles()}
    devices[2626653525671] = {name:"LOM CashSys", description: "LOM Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[2660761271618] = {name:"LOM Archive", description: "LOM Backup Server", security: 5, files: {"Users":{"admin":{"LOM_Financial_Data":{"lom_accounts_credit.fve": {type: "encrypted", data:["                                             0A2oq0qkFtah868AZaed otIiTOFRVPXo4U1k0QrX    IYbXQdJS4Nm3WnQoHtSg VNFUMCdNvr2LgMLDAKvB    qvV9JfhD3XxJrjaUKepM qbrV5HQHuup9aLrVulUB    uOczwLkSNcigbnmhzPDC NAJ9RSFlu6dLdkzs9jUS    sM6Bb4iRe1SuEpzo2Plf L4bgU7R7DOrum7OIjMej    YQcxwIJxZG3odNlNSnUW wuGAYCb95ZlcfsDh6LTx    pSNSuQEJ1CFJlDqaoV9r ZNkhybMnVpobIWKsMZLl    E5Tw1HOWHrvGBJGpYgAf e0JkMG0SaPIQ4DO0Vt4o    r7xuarByBOVKM6WK0ltt hl3b31EfTMefH45DCL4c    CDEXtEyz7hS1Mw3rbttN Pe3FhSApjOD7696EPepL    asw4YlZ6p96T8J2d3t12 W7lbiAEhTeuDE9YrXSsf    VtbOUiqnIqcjSVNGNgfe 56QK1dExLxQ4M5rR7frN    EiaiJ6dhE8kiPbNffI6R jrMrFTs4gTagBsleVggp    RgPhfMxEGLKljdfJBpdk PCvACM4DAXr1yoRxXioH    jqS4CBN9bYghMadGbSP5 Nd4OSjVFiv9WCjeZhJKW    Aqq1GObxMq5yambU5aOj A7vSiXAbAAcrmmeJNEQr    LbGZs8ZHExFPfyY0A0kW idVtqkuciOF2BAd1co9O    rcBdkuJVdZDhmwA8kLXa 5TB2ApmDGfK3pWYwwY81    ZMXxW00rKOpT8nWkQ38x jAFC9tWJnzXCCfQlMAkq    END OF FILE                                  "]},"lom_accounts_loans.fve": {type: "encrypted", data:["                                             0MJamJNacqTsBZ8BNL7K cgwl737ThSFa2lWl4D7j    WEVf3dz8mzIdFevEjeyl L6Lya28GVSxHiNc90HeR    j4gotLUhrZ7newThXbX8 X9BbHOwrAEjtQf9Ze7MK    XuBlfAp4y02ImUQn4BN6 xh2PjJfUIqRJRI442M84    z6xSZL46YpVrXrwB4Ray 4Z99Ebrg4cUeuLTjtMKM    JXdWbDxC75Z6cJD3FENS TU0IFlHUBF7lc4LDQh4j    GhabZaaiylYnO7t3J0Tg gOgym8HVA80c016qNKoB    gRcFoRFEZn8XwEX8T79e pQXFEIO7lBONJ7UBVIq2    XIvU0hZaKZQk1hgyWT64 fqnGmU6P8Dgq25zsVijR    s4eqhrDQFffWpjXKYjGz hKKMAz3qzEGXNmBFqQAS    5CWOVo25SuYHOERF3QlY 1MYJ5gi3uq12lyhSnvI6    PC3JgePcAKPyjMDLFCfm TJCEV2OytnoKI5sAm2vw    6wtvFvZB5O7rxHYkD3Y3 JlKDGPujhHc6gmRUw7gL    efithq2dp7oQF1uVyoXg 4n4WCy5Xlop8VmLc2Z9v    sexqAT4WVu5n21eAlNcn GydpWQu740EE0WL26aIC    kCaBkeJsMYOEvkHhXVzV D7Vj1JQvy6w2W185wrmO    7bRLxi6AIyj6hleqNZPA gRMqIxP5X63qFeqa5kla    qBVzEb9O9evzcNSKvHKx XOXyMYFZ65eE6YiWNK0D    1DQP1ixUbschX9Tgncy0 ufopNBww6DqtwAch7Xmf    END OF FILE                                  "]},	"lom_accounts_mortgages.fve": {type: "encrypted", data:["                                             XFELwGo9DIhmXlAJEOHw aPVnQPnAJsx7VBvnemdB    lIKwcgizc8N4kS7zh90g VZ6ct45lKWp5JQ3u7SZ0    ikRxFec57L6fy7tFGwmx 2o5CQ25WpQetSkxlGbPw    XMBdVfhdJYCnS55SiBqS XHzw2IFJvNOShCxEW6Fs    SXALjy6yZ9seoyQV5UWa BY215OE2fgq5rxFyDHHJ    Zdl8KjBXCtkqjy7dt1dR M8fZzQlaPGO0mnLdjRtE    TcLqMe8zDcK6Z05921Qq eIcERgjkL7tUXLJIQy1V    Gy5o61iL5RnCMOD5ZMCO ZFO418UPsqOd9dArbMaV    xsE498VcC84VMnIYd5Ho qPRHQueM7QVliKaSWeVG    aX3y1d0rB95IanuAbgbX l42tNDTH5UrIKGY1JQXU    uV8otS77BrK79hRFOnXA YbgPQ3JokNyvToS3iD0n    XZwIYcav1xLUx8qvF2iL u6JXO9uGqfdGyxNocGc8    Xucqb6LP0l2ZXVcrYTaD Sb4T7tuaK4wZfX8hGxWD    c9WYxmIw48IswrWszVrt 09P2oCKS2DTr0EdY9qS3    YOIxbDBgJ4AJZSQd785q 6cSpW22jc9ExeCeZNK5t    LK1GvsclWKnXzQnTMxpE IFWW2Z2z5fugpDsCKdDL    0Osa707YmdqQZIwxVBXf Rv53zAmrnXtbtvdRGPQV    qcoSov7eSU6FNAdbTpm5 Nqm2noIoAMGDyG92rLon    YI2wHQW47ULpT5jq5bzP PpDqFLzN2p2iQsUzyyfg    END OF FILE                                  "]},	"lom_accounts_pensions.fve": {type: "encrypted", data:["                                             ZxjmWShQ3hzt29Jb2Rvs NhBADkNxi4BY7CCAStwI    F36IDTPH3pGBwrx6q5kh VZhfQFJwWwtgD5cKjG9b    chKBwr9HtfdBG7hJKOt0 JPDrbnIFonBSVmY74Wok    iisO581amvZ3WOGMSYGe wRq6AdKKHeRmkrtHsiqm    MDO633MPeTflfIbXYFHO JoIYi77NxI73FWnmn8Ya    SoshZGyLFQKQLxS9cdlG sEBKIoAAvcysjlQGVUdv    yoLFiu0A1dpf4KQYWBzH 7iMVNY7MdSi5QVvgNU6B    kV5fvgJqOdb77jfIEPRI DdC7E2r2VAwu7d3I142M    yxRR7AVAzyIz6gwmBim3 DRYM83iC4vAln5owDk2O    6JaiUx0mAhYpiAIW0Mtm O6ODolJsEeMwAIkJt5ti    v2VxaMMjaNNbCrkeQDQQ WqsCr09P7qUzIDgKDuF6    pAf4sgBdf2v2GbmdnGAr gRMgQIqipXYnvdzbHT7q    yx3imyX7TRn9aax9Hpd5 J9yJ1zgOVCOt73QKBgOA    IcgqKCJyFJsdVeF2pUzC QlrZPJ0t9TTG2gwCaUb4    rN3CSc6PcZ8WWaospO5u hInPP8j0wRi15ylttpM3    Z4DQNnjUGmjebIMeQo9V BJkssFMqM8SWPxYVFaNf    Hn1jEtXTXYdSPGL3RwDy pZU4IIGULB8vD5U5g8f8    0fulp2xz1NfJiOh4btqh SPLQRrZ3h1NF5yvFRp2c    utJSZMgQmYzQJorIdTVD fCR3X1xCLZzJ0wAraxEj    END OF FILE                                  "]}, "lom_accounts_savings.fve": {type: "encrypted", data:["                                             iG3Fc4Ac2ZShKeTjFy6Y aD8mopjFJczfBeyZLrG4    uBwmWZljQAD3ptCiZrpU LsBAvWfgj5nfZ8QXADqK    DJuiubrGrI2bsRqrWZZg V6t1sJHR9vtT8wUrdPNs    wRiKRDVZvsh8rzYwyOE0 iMJMsngMvYBbzc8FmXUc    yxIMMCj15GGyKp1tPjn5 hWPbZjTW0ZHTI1LIc1iW    LIiFtxvNmkFeXTbjN5ei vogodlQYD3nRYYqsMN3L    DaZPjyyrcXot0J8ZFjvj yXyfC4FV7NloTYUHZvyR    ksGQW9Ibk8cLWVLvd2a9 QI25kfaUATwDHqv832hx    FJKs130Z5NFGjyFCh8b9 TV4rodlbsts0XEr536ds    mhINtqsJv22fbDaxZJWA Myfk78n6NJlfCJFGdUXq    j8Gz50Go674A7xqyiB8o ZWVKZAmEo8PO8t2d2cQb    gJX5dQ0BUu2u37fjmPWQ hsutDXWqPMDlVsKzl7Zr    wCI3rbRj4FI2pEarPeja pMQbangzDmAYpKb4Nn4R    b3HjHyxnq3vUSa4oFcVr qNajbQ3EnUTmM0OMYYiC    8vjwnf9ixgUMvob1rore WRd5j7W9FPASk8dqDHQY    zjp31LWA52T1SRGjTFkz zCuhpHxAH4gP0JFGOMLi    HXTHsnlUWQa13VKEZFpC HPdLmNNOJFozXBchTQSA    erCbB2cgxct26h38igWL NUVmVeleOCRkhFc0x7Tu    lBo7J6SDKup2AafzMo3d DaCfvdU3GsHuCLfhLena    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
   //Citizen -KAYTON Bank files  
  	devices[2032073439292] = {name:"KAY MainServ", description: "KAY Primary Server", security: 3, files: getBasicFiles()}
    devices[5991480122462] = {name:"KAY SecServ", description: "KAY Security System", security: 4, files: getBasicFiles()}
    devices[2127905690718] = {name:"KAY CashSys", description: "KAY Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[2342516236496] = {name:"KAY Archive", description: "KAY Backup Server", security: 5, files: {"Users":{"admin":{"KAY_Financial_Data":{"kay_accounts_credit.fve": {type: "encrypted", data:["                                             0D2rt0tnIwdk868DCdhg rwLlWRIUYSAr4X1n0TuA    LBeATgMV4Qp3ZqTrKwVj YQIXPFgQyu2OjPOGDNyE    tyY9MikG3AaMumdXNhsP teuY5KTKxxs9dOuYxoXE    xRfczOnVQfljeqpkcSGF QDM9UVIox6gOgncv9mXV    vP6Ee4lUh1VxHscr2Soi O4ejX7U7GRuxp7RLmPhm    BTfazLMaCJ3rgQoQVqXZ zxJDBFe95CofivGk6OWa    sVQVxTHM1FIMoGtdrY9u CQnkbePqYsreLZNvPCOo    H5Wz1KRZKuyJEMJsBjDi h0MnPJ0VdSLT4GR0Yw4r    u7axduEbERYNP6ZN0oww ko3e31HiWPhiK45GFO4f    FGHAwHbc7kV1Pz3uewwQ Sh3IkVDsmRG7696HShsO    dvz4BoC6s96W8M2g3w12 Z7oelDHkWhxGH9BuAVvi    YweRXltqLtfmVYQJQjih 56TN1gHaOaT4P5uU7iuQ    HldlM6gkH8nlSeQiiL6U muPuIWv4jWdjEvohYjjs    UjSkiPaHJONomgiMEsgn SFyDFP4GDAu1brUaAlrK    mtV4FEQ9eBjkPdgJeVS5 Qg4RVmYIly9ZFmhCkMNZ    Dtt1JReaPt5bdpeX5dRm D7yVlADeDDfupphMQHTu    OeJCv8CKHaISibB0D0nZ lgYwtnxflRI2EDg1fr9R    ufEgnxMYgCGkpzD8nOAd 5WE2DspGJiN3sZBzzB81    CPAaZ00uNRsW8qZnT38a mDIF9wZMqcAFFiToPDnt    END OF FILE                                  "]},"kay_accounts_loans.fve": {type: "encrypted", data:["                                             0PMdpMQdftWvEC8EQO7N fjzo737WkVId2oZo4G7m    ZHYi3gc8pcLgIhyHmhbo O6Obd28JYVaKlQf90KhU    m4jrwOXkuC7qhzWkAeA8 A9EeKRzuDHmwTi9Ch7PN    AxEoiDs4b02LpXTq4EQ6 ak2SmMiXLtUMUL442P84    c6aVCO46BsYuAuzE4Udb 4C99Heuj4fXhxOWmwPNP    MAgZeGaF75C6fMG3IHQV WX0LIoKXEI7of4OGTk4m    JkdeCddlboBqR7w3M0Wj jRjbp8KYD80f016tQNrE    jUfIrUIHCq8AzHA8W79h sTAIHLR7oERQM7XEYLt2    ALyX0kCdNCTn1kjbZW64 itqJpX6S8Gjt25cvYlmU    v4htkuGTIiiZsmANBmJc kNNPDc3tcHJAQpEItTDV    5FZRYr25VxBKRHUI3ToB 1PBM5jl3xt12obkVqyL6    SF3MjhSfDNSbmPGOIFip WMFHY2RbwqrNL5vDp2yz    6zwyIyCE5R7uaKBnG3B3 MoNGJSxmkKf6jpUXz7jO    hilwkt2gs7rTI1xYbrAj 4q4ZFb5Aors8YpOf2C9y    vhatDW4ZYx5q21hDoQfq JbgsZTx740HH0ZO26dLF    nFdEnhMvPBRHynKkAYcY G7Ym1MTyb6z2Z185zupR    7eUOal6DLbm6kohtQCSD jUPtLaS5A63tIhtd5nod    tEYcHe9R9hycfQVNyKNa ARAbPBIC65hH6BlZQN0G    1GTS1laXevfkA9Wjqfb0 xirsQEzz6GtwzDfk7Api    END OF FILE                                  "]},	"kay_accounts_mortgages.fve": {type: "encrypted", data:["                                             AIHOzJr9GLkpAoDMHRKz dSYqTSqDMva7YEyqhpgE    oLNzfjlcf8Q4nV7ck90j YC6fw45oNZs5MT3x7VC0    lnUaIhf57O6ib7wIJzpa 2r5FT25ZsThwVnaoJeSz    APEgYikgMBFqV55VlEtV AKcz2LIMyQRVkFaHZ6Iv    VADOmb6bC9vhrbTY5XZd EB215RH2ijt5uaIbGKKM    Cgo8NmEAFwntmb7gw1gU P8iCcTodSJR0pqOgmUwH    WfOtPh8cGfN6C05921Tt hLfHUjmnO7wXAOMLTb1Y    Jb5r61lO5UqFPRG5CPFR CIR418XSvtRg9gDuePdY    avH498YfF84YPqLBg5Kr tSUKTxhP7TYolNdVZhYJ    dA3b1g0uE95LdqxDejeA o42wQGWK5XuLNJB1MTAX    xY8rwV77EuN79kUIRqAD BejST3MrnQbyWrV3lG0q    ACzLBfdy1aOXa8tyI2lO x6MAR9xJtigJbaQrfJf8    Axfte6OS0o2CAYfuBWdG Ve4W7wxdN4zCiA8kJaZG    f9ZBapLz48LvzuZvcYuw 09S2rFNV2GWu0HgB9tV3    BRLaeGEjM4DMCVTg785t 6fVsZ22mf9HahFhCQN5w    ON1JyvfoZNqAcTqWPasH LIZZ2C2c5ixjsGvFNgGO    0Rvd707BpgtTCLzaYEAi Uy53cDpuqAwewygUJSTY    tfrVry7hVX6IQDgeWsp5 Qtp2qrLrDPJGbJ92uOrq    BL2zKTZ47XOsW5mt5ecS SsGtIOcQ2s2lTvXcbbij    END OF FILE                                  "]},	"kay_accounts_pensions.fve": {type: "encrypted", data:["                                             CampZVkT3kcw29Me2Uyv QkEDGnQal4EB7FFDVwzL    I36LGWSK3sJEzua6t5nk YCkiTIMzZzwjG5fNmJ9e    fkNEzu9KwigEJ7kMNRw0 MSGueqLIrqEVYpB74Zrn    llvR581dpyC3ZRJPVBJh zUt6DgNNKhUpnuwKvltp    PGR633PShWioiLeABIKR MrLBl77QaL73IZqpq8Bd    VrvkCJbOITNTOaV9fgoJ vHENLrDDyfbvmoTJYXgy    brOIlx0D1gsi4NTBZEcK 7lPYQB7PgVl5TYyjQX6E    nY5iyjMtRge77miLHSUL GgF7H2u2YDzx7g3L142P    baUU7DYDcbLc6jzpElp3 GUBP83lF4yDoq5rzGn2R    6MdlXa0pDkBslDLZ0Pwp R6RGroMvHhPzDLnMw5wl    y2YadPPmdQQeFunhTGTT ZtvFu09S7tXcLGjNGxI6    sDi4vjEgi2y2JepgqJDu jUPjTLtlsABqygceKW7t    ba3lpbA7WUq9dda9Ksg5 M9bM1cjRYFRw73TNEjRD    LfjtNFMbIMvgYhI2sXcF TouCSM0w9WWJ2jzFdXe4    uQ3FVf6SfC8ZZdrvsR5x kLqSS8m0zUl15bowwsP3    C4GTQqmXJpmheLPhTr9Y EMnvvIPtP8VZSaBYIdQi    Kq1mHwAWABgVSJO3UzGb sCX4LLJXOE8yG5X5j8i8    0ixos2ac1QiMlRk4ewtk VSOTUuC3k1QI5byIUs2f    xwMVCPjTpBcTMruLgWYG iFU3A1aFOCcM0zDudaHm    END OF FILE                                  "]}, "kay_accounts_savings.fve": {type: "encrypted", data:["                                             lJ3If4Df2CVkNhWmIb6B dG8prsmIMfciEhbCOuJ4    xEzpZComTDG3swFlCusX OvEDyZijm5qiC8TADGtN    GMxlxeuJuL2evUtuZCCj Y6w1vMKU9ywW8zXugSQv    zUlNUGYCyvk8ucBzbRH0 lPMPvqjPyBEecf8IpAXf    baLPPFm15JJbNs1wSmq5 kZSeCmWZ0CKWL1OLf1lZ    OLlIwayQpnIhAWemQ5hl yrjrgoTBG3qUBBtvPQ3O    GdCSmbbufArw0M8CImym bAbiF4IY7QorWBXKCybU    nvJTZ9Len8fOZYOyg2d9 TL25nidXDWzGKty832ka    IMNv130C5QIJmbIFk8e9 WY4urgoevwv0AHu536gv    pkLQwtvMy22ieGdaCMZD Pbin78q6QMoiFMIJgXAt    m8Jc50Jr674D7atblE8r CZYNCDpHr8SR8w2g2fTe    jMA5gT0EXx2x37impSZT kvxwGAZtSPGoYvNco7Cu    zFL3ueUm4IL2sHduShmd sPTedqjcGpDBsNe4Qq4U    e3KmKbaqt3yXVd4rIfYu tQdmeT3HqXWpP0RPBBlF    8ymzqi9lajXPyre1uruh ZUg5m7Z9ISDVn8gtGKTB    cms31OZD52W1VUJmWInc cFxksKaDK4jS0MIJRPOl    KAWKvqoXZTd13YNHCIsF KSgOpQQRMIrcAEfkWTVD    huFeE2fjafw26k38ljZO QXYpYhohRFUnkIf0a7Wx    oEr7M6VGNxs2DdicPr3g GdFiygX3JvKxFOikOhqd    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
   //Citizen -UDEPOT Bank files  
  	devices[2061250044534] = {name:"UDP MainServ", description: "UDP Primary Server", security: 3, files: getBasicFiles()}
    devices[9523471564785] = {name:"UDP SecServ", description: "UDP Security System", security: 4, files: getBasicFiles()}
    devices[9793126261871] = {name:"UDP CashSys", description: "UDP Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[3273498059638] = {name:"UDP Archive", description: "UDP Backup Server", security: 5, files: {"Users":{"admin":{"UDP_Financial_Data":{"udp_accounts_credit.fve": {type: "encrypted", data:["                                             0F2tv0vpKyfm868FEfji tyNnYTKWAUCt4Z1p0VwC    NDgCViOX4Sr3BsVtMyXl ASKZRHiSaw2QlRQIFPaG    vaA9OkmI3CcOwofZPjuR vgwA5MVMzzu9fQwAzqZG    zThebQpXShnlgsrmeUIH SFO9WXKqz6iQipex9oZX    xR6Gg4nWj1XzJuet2Uqk Q4glZ7W7ITwzr7TNoRjo    DVhcbNOcEL3tiSqSXsZB bzLFDHg95EqhkxIm6QYc    uXSXzVJO1HKOqIvftA9w ESpmdgRsAutgNBPxREQq    J5Yb1MTBMwaLGOLuDlFk j0OpRL0XfUNV4IT0Ay4t    w7czfwGdGTAPR6BP0qyy mq3g31JkYRjkM45IHQ4h    HIJCyJde7mX1Rb3wgyyS Uj3KmXFuoTI7696JUjuQ    fxb4DqE6u96Y8O2i3y12 B7qgnFJmYjzIJ9DwCXxk    AygTZnvsNvhoXASLSlkj 56VP1iJcQcV4R5wW7kwS    JnfnO6imJ8pnUgSkkN6W owRwKYx4lYflGxqjAllu    WlUmkRcJLQPqoikOGuip UHaFHR4IFCw1dtWcCntM    ovX4HGS9gDlmRfiLgXU5 Si4TXoAKna9BHojEmOPB    Fvv1LTgcRv5dfrgZ5fTo F7aXnCFgFFhwrrjOSJVw    QgLEx8EMJcKUkdD0F0pB niAyvpzhnTK2GFi1ht9T    whGipzOAiEImrbF8pQCf 5YG2FurILkP3uBDbbD81    ERCcB00wPTuY8sBpV38c oFKH9yBOseCHHkVqRFpv    END OF FILE                                  "]},"udp_accounts_loans.fve": {type: "encrypted", data:["                                             0ROfrOSfhvYxGE8GSQ7P hlbq737YmXKf2qBq4I7o    BJAk3ie8reNiKjaJojdq Q6Qdf28LAXcMnSh90MjW    o4ltyQZmwE7sjbYmCgC8 C9GgMTbwFJoyVk9Ej7RP    CzGqkFu4d02NrZVs4GS6 cm2UoOkZNvWOWN442R84    e6cXEQ46DuAwCwbG4Wfd 4E99Jgwl4hZjzQYoyRPR    OCiBgIcH75E6hOI3KJSX YZ0NKqMZGK7qh4QIVm4o    LmfgEffndqDsT7y3O0Yl lTldr8MAF80h016vSPtG    lWhKtWKJEs8CbJC8Y79j uVCKJNT7qGTSO7ZGANv2    CNaZ0mEfPEVp1mldBY64 kvsLrZ6U8Ilv25exAnoW    x4jvmwIVKkkBuoCPDoLe mPPRFe3veJLCSrGKvVFX    5HBTAt25XzDMTJWK3VqD 1RDO5ln3zv12qdmXsaN6    UH3OljUhFPUdoRIQKHkr YOHJA2TdystPN5xFr2ab    6byaKaEG5T7wcMDpI3D3 OqPILUzomMh6lrWZb7lQ    jknymv2iu7tVK1zAdtCl 4s4BHd5Cqtu8ArQh2E9a    xjcvFY4BAz5s21jFqShs LdiuBVz740JJ0BQ26fNH    pHfGpjOxRDTJapMmCAeA I7Ao1OVad6b2B185bwrT    7gWQcn6FNdo6mqjvSEUF lWRvNcU5C63vKjvf5pqf    vGAeJg9T9jaehSXPaMPc CTCdRDKE65jJ6DnBSP0I    1IVU1ncZgxhmC9Ylshd0 zktuSGbb6IvybFhm7Crk    END OF FILE                                  "]},	"udp_accounts_mortgages.fve": {type: "encrypted", data:["                                             CKJQbLt9INmrCqFOJTMb fUAsVUsFOxc7AGasjriG    qNPbhlneh8S4pX7em90l AE6hy45qPBu5OV3z7XE0    npWcKjh57Q6kd7yKLbrc 2t5HV25BuVjyXpcqLgUb    CRGiAkmiODHsX55XnGvX CMeb2NKOaSTXmHcJB6Kx    XCFQod6dE9xjtdVA5ZBf GD215TJ2klv5wcKdIMMO    Eiq8PoGCHypvod7iy1iW R8kEeVqfULT0rsQioWyJ    YhQvRj8eIhP6E05921Vv jNhJWlopQ7yZCQONVd1A    Ld5t61nQ5WsHRTI5ERHT EKT418ZUxvTi9iFwgRfA    cxJ498AhH84ARsNDi5Mt vUWMVzjR7VAqnPfXBjAL    fC3d1i0wG95NfszFglgC q42ySIYM5ZwNPLD1OVCZ    zA8tyX77GwP79mWKTsCF DglUV3OtpSdaYtX3nI0s    CEbNDhfa1cQZc8vaK2nQ z6OCT9zLvkiLdcSthLh8    Czhvg6QU0q2ECAhwDYfI Xg4Y7yzfP4bEkC8mLcBI    h9BDcrNb48NxbwBxeAwy 09U2tHPX2IYw0JiD9vX3    DTNcgIGlO4FOEXVi785v 6hXuB22oh9JcjHjESP5y    QP1LaxhqBPsCeVsYRcuJ NKBB2E2e5kzluIxHPiIQ    0Txf707DrivVENbcAGCk Wa53eFrwsCygyaiWLUVA    vhtXta7jXZ6KSFigYur5 Svr2stNtFRLIdL92wQts    DN2bMVB47ZQuY5ov5geU UuIvKQeS2u2nVxZeddkl    END OF FILE                                  "]},	"udp_accounts_pensions.fve": {type: "encrypted", data:["                                             EcorBXmV3mey29Og2Wax SmGFIpScn4GD7HHFXybN    K36NIYUM3uLGbwc6v5pm AEmkVKObBbylI5hPoL9g    hmPGbw9MykiGL7mOPTy0 OUIwgsNKtsGXArD74Btp    nnxT581fraE3BTLRXDLj bWv6FiPPMjWrpwyMxnvr    RIT633RUjYkqkNgCDKMT OtNDn77ScN73KBsrs8Df    XtxmELdQKVPVQcX9hiqL xJGPNtFFahdxoqVLAZia    dtQKnz0F1iuk4PVDBGeM 7nRASD7RiXn5VAalSZ6G    pA5kalOvTig77okNJUWN IiH7J2w2AFbz7i3N142R    dcWW7FAFedNe6lbrGnr3 IWDR83nH4aFqs5tbIp2T    6OfnZc0rFmDunFNB0Ryr T6TItqOxJjRbFNpOy5yn    a2AcfRRofSSgHwpjVIVV BvxHw09U7vZeNIlPIzK6    uFk4xlGik2a2LgrisLFw lWRlVNvnuCDsaiegMY7v    dc3nrdC7YWs9ffc9Mui5 O9dO1elTAHTy73VPGlTF    NhlvPHOdKOxiAjK2uZeH VqwEUO0y9YYL2lbHfZg4    wS3HXh6UhE8BBftxuT5z mNsUU8o0bWn15dqyyuR3    E4IVSsoZLrojgNRjVt9A GOpxxKRvR8XBUcDAKfSk    Ms1oJyCYCDiXULQ3WbId uEZ4NNLZQG8aI5Z5l8k8    0kzqu2ce1SkOnTm4gyvm XUQVWwE3m1SK5daKWu2h    zyOXERlVrDeVOtwNiYAI kHW3C1cHQEeO0bFwfcJo    END OF FILE                                  "]}, "udp_accounts_savings.fve": {type: "encrypted", data:["                                             nL3Kh4Fh2EXmPjYoKd6D fI8rtuoKOhekGjdEQwL4    zGbrBEqoVFI3uyHnEwuZ QxGFaBklo5skE8VCFIvP    IOznzgwLwN2gxWvwBEEl A6y1xOMW9ayY8bZwiUSx    bWnPWIAEaxm8weDbdTJ0 nRORxslRaDGgeh8KrCZh    dcNRRHo15LLdPu1yUos5 mBUgEoYB0EMYN1QNh1nB    QNnKycaSrpKjCYgoS5jn atltiqVDI3sWDDvxRS3Q    IfEUoddwhCty0O8EKoao dCdkH4KA7SqtYDZMEadW    pxLVB9Ngp8hQBAQai2f9 VN25pkfZFYbIMva832mc    KOPx130E5SKLodKHm8g9 YA4wtiqgxyx0CJw536ix    rmNSyvxOa22kgIfcEOBF Rdkp78s6SOqkHOKLiZCv    o8Le50Lt674F7cvdnG8t EBAPEFrJt8UT8y2i2hVg    lOC5iV0GZz2z37korUBV mxzyICBvURIqAxPeq7Ew    bHN3wgWo4KN2uJfwUjof uRVgfsleIrFDuPg4Ss4W    g3MoMdcsv3aZXf4tKhAw vSfogV3JsZYrR0TRDDnH    8aobsk9nclZRatg1wtwj BWi5o7B9KUFXp8ivIMVD    eou31QBF52Y1XWLoYKpe eHzmuMcFM4lU0OKLTRQn    MCYMxsqZBVf13APJEKuH MUiQrSSTOKteCGhmYVXF    jwHgG2hlchy26m38nlBQ SZArAjqjTHWpmKh0c7Yz    qGt7O6XIPzu2FfkeRt3i IfHkaiZ3LxMzHQkmQjsf    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
    //Citizen -IOL Bank files     
  	devices[7274413320417] = {name:"IOL MainServ", description: "IOL Primary Server", security: 3, files: getBasicFiles()}
    devices[3696858819766] = {name:"IOL SecServ", description: "IOL Security System", security: 4, files: getBasicFiles()}
    devices[5512589237010] = {name:"IOL CashSys", description: "IOL Cashier Terminal", security: 2, files: getBasicFiles()}
	devices[7295455700747] = {name:"IOL Archive", description: "IOL Backup Server", security: 5, files: {"Users":{"admin":{"IOL_Financial_Data":{"iol_accounts_credit.fve": {type: "encrypted", data:["                                             0H2vx0xrMaho868HGhlk vaPpAVMYCWEv4B1r0XyE    PFiEXkQZ4Ut3DuXvOaZn CUMBTJkUcy2SnTSKHRcI    xcC9QmoK3EeQyqhBRlwT xiyC5OXObbw9hSyCbsBI    bVjgdSrZUjpniutogWKJ UHQ9YZMsb6kSkrgz9qBZ    zT6Ii4pYl1ZbLwgv2Wsm S4inB7Y7KVybt7VPqTlq    FXjedPQeGN3vkUsUZuBD dbNHFJi95GsjmzKo6SAe    wZUZbXLQ1JMQsKxhvC9y GUrofiTuCwviPDRzTGSs    L5Ad1OVDOycNIQNwFnHm l0QrTN0ZhWPX4KV0Ca4v    y7ebhyIfIVCRT6DR0saa os3i31LmATlmO45KJS4j    JKLEaLfg7oZ1Td3yiaaU Wl3MoZHwqVK7696LWlwS    hzd4FsG6w96A8Q2k3a12 D7sipHLoAlbKL9FyEZzm    CaiVBpxuPxjqZCUNUnml 56XR1kLeSeX4T5yY7myU    LphpQ6koL8rpWiUmmP6Y qyTyMAz4nAhnIzslCnnw    YnWomTeLNSRsqkmQIwkr WJcHJT4KHEy1fvYeEpvO    qxZ4JIU9iFnoThkNiZW5 Uk4VZqCMpc9DJqlGoQRD    Hxx1NVieTx5fhtiB5hVq H7cZpEHiHHjyttlQULXy    SiNGz8GOLeMWmfF0H0rD pkCaxrbjpVM2IHk1jv9V    yjIkrbQCkGKotdH8rSEh 5AI2HwtKNmR3wDFddF81    GTEeD00yRVwA8uDrX38e qHMJ9aDQugEJJmXsTHrx    END OF FILE                                  "]},"iol_accounts_loans.fve": {type: "encrypted", data:["                                             0TQhtQUhjxAzIG8IUS7R jnds737AoZMh2sDs4K7q    DLCm3kg8tgPkMlcLqlfs S6Sfh28NCZeOpUj90OlY    q4nvaSBoyG7uldAoEiE8 E9IiOVdyHLqaXm9Gl7TR    EbIsmHw4f02PtBXu4IU6 eo2WqQmBPxYQYP442T84    g6eZGS46FwCyEydI4Yhf 4G99Liyn4jBlbSAqaTRT    QEkDiKeJ75G6jQK3MLUZ AB0PMsOBIM7sj4SKXo4q    NohiGhhpfsFuV7a3Q0An nVnft8OCH80j016xURvI    nYjMvYMLGu8EdLE8A79l wXEMLPV7sIVUQ7BICPx2    EPcB0oGhRGXr1onfDA64 mxuNtB6W8Knx25gzCpqY    z4lxoyKXMmmDwqERFqNg oRRTHg3xgLNEUtIMxXHZ    5JDVCv25ZbFOVLYM3XsF 1TFQ5np3bx12sfoZucP6    WJ3QnlWjHRWfqTKSMJmt AQJLC2VfauvRP5zHt2cd    6dacMcGI5V7yeOFrK3F3 QsRKNWbqoOj6ntYBd7nS    lmpaox2kw7vXM1bCfvEn 4u4DJf5Esvw8CtSj2G9c    zlexHA4DCb5u21lHsUju NfkwDXb740LL0DS26hPJ    rJhIrlQzTFVLcrOoECgC K7Cq1QXcf6d2D185dytV    7iYSep6HPfq6oslxUGWH nYTxPeW5E63xMlxh5rsh    xICgLi9V9lcgjUZRcORe EVEfTFMG65lL6FpDUR0K    1KXW1peBizjoE9Anujf0 bmvwUIdd6KxadHjo7Etm    END OF FILE                                  "]},	"iol_accounts_mortgages.fve": {type: "encrypted", data:["                                             EMLSdNv9KPotEsHQLVOd hWCuXWuHQze7CIcultkI    sPRdjnpgj8U4rZ7go90n CG6ja45sRDw5QX3b7ZG0    prYeMlj57S6mf7aMNdte 2v5JX25DwXlaZresNiWd    ETIkCmokQFJuZ55ZpIxZ EOgd2PMQcUVZoJeLD6Mz    ZEHSqf6fG9zlvfXC5BDh IF215VL2mnx5yeMfKOOQ    Gks8RqIEJarxqf7ka1kY T8mGgXshWNV0tuSkqYaL    AjSxTl8gKjR6G05921Xx lPjLYnqrS7aBESQPXf1C    Nf5v61pS5YuJTVK5GTJV GMV418BWzxVk9kHyiThC    ezL498CjJ84CTuPFk5Ov xWYOXblT7XCspRhZDlCN    hE3f1k0yI95PhubHiniE s42aUKAO5ByPRNF1QXEB    bC8vaZ77IyR79oYMVuEH FinWX3QvrUfcAvZ3pK0u    EGdPFjhc1eSBe8xcM2pS b6QEV9bNxmkNfeUvjNj8    Ebjxi6SW0s2GECjyFAhK Zi4A7abhR4dGmE8oNeDK    j9DFetPd48PzdyDzgCya 09W2vJRZ2KAy0LkF9xZ3    FVPeiKInQ4HQGZXk785x 6jZwD22qj9LelJlGUR5a    SR1NczjsDRuEgXuATewL PMDD2G2g5mbnwKzJRkKS    0Vzh707FtkxXGPdeCIEm Yc53gHtyuEaiackYNWXC    xjvZvc7lZB6MUHkiAwt5 Uxt2uvPvHTNKfN92ySvu    FP2dOXD47BSwA5qx5igW WwKxMSgU2w2pXzBgffmn    END OF FILE                                  "]},	"iol_accounts_pensions.fve": {type: "encrypted", data:["                                             GeqtDZoX3oga29Qi2Ycz UoIHKrUep4IF7JJHZadP    M36PKAWO3wNIdye6x5ro CGomXMQdDdanK5jRqN9i    joRIdy9OamkIN7oQRVa0 QWKyiuPMvuIZCtF74Dvr    ppzV581htcG3DVNTZFNl dYx6HkRROlYtryaOzpxt    TKV633TWlAmsmPiEFMOV QvPFp77UeP73MDutu8Fh    ZvzoGNfSMXRXSeZ9jksN zLIRPvHHcjfzqsXNCBkc    fvSMpb0H1kwm4RXFDIgO 7pTCUF7TkZp5XCcnUB6I    rC5mcnQxVki77qmPLWYP KkJ7L2y2CHdb7k3P142T    feYY7HCHgfPg6ndtIpt3 KYFT83pJ4cHsu5vdKr2V    6QhpBe0tHoFwpHPD0Tat V6VKvsQzLlTdHPrQa5ap    c2CehTTqhUUiJyrlXKXX DxzJy09W7xBgPKnRKbM6    wHm4znIkm2c2NitkuNHy nYTnXPxpwEFuckgiOA7x    fe3ptfE7AYu9hhe9Owk5 Q9fQ1gnVCJVa73XRInVH    PjnxRJQfMQzkClM2wBgJ XsyGWQ0a9AAN2ndJhBi4    yU3JZj6WjG8DDhvzwV5b oPuWW8q0dYp15fsaawT3    G4KXUuqBNtqliPTlXv9C IQrzzMTxT8ZDWeFCMhUm    Ou1qLaEAEFkZWNS3YdKf wGB4PPNBSI8cK5B5n8m8    0mbsw2eg1UmQpVo4iaxo ZWSXYyG3o1UM5fcMYw2j    baQZGTnXtFgXQvyPkACK mJY3E1eJSGgQ0dHyheLq    END OF FILE                                  "]}, "iol_accounts_savings.fve": {type: "encrypted", data:["                                             pN3Mj4Hj2GZoRlAqMf6F hK8tvwqMQjgmIlfGSyN4    bIdtDGsqXHK3waJpGywB SzIHcDmnq5umG8XEHKxR    KQbpbiyNyP2izYxyDGGn C6a1zQOY9caA8dBykWUz    dYpRYKCGczo8ygFdfVL0 pTQTzunTcFIigj8MtEBj    fePTTJq15NNfRw1aWqu5 oDWiGqAD0GOAP1SPj1pD    SPpMaecUtrMlEAiqU5lp cvnvksXFK3uYFFxzTU3S    KhGWqffyjEva0Q8GMqcq fEfmJ4MC7UsvAFBOGcfY    rzNXD9Pir8jSDCSck2h9 XP25rmhBHAdKOxc832oe    MQRz130G5UMNqfMJo8i9 AC4yvksizaz0ELy536kz    toPUaxzQc22miKheGQDH Tfmr78u6UQsmJQMNkBEx    q8Ng50Nv674H7exfpI8v GDCRGHtLv8WV8a2k2jXi    nQE5kX0IBb2b37mqtWDX ozbaKEDxWTKsCzRgs7Gy    dJP3yiYq4MP2wLhyWlqh wTXihungKtHFwRi4Uu4Y    i3OqOfeux3cBZh4vMjCy xUhqiX3LuBAtT0VTFFpJ    8cqdum9penBTcvi1yvyl DYk5q7D9MWHZr8kxKOXF    gqw31SDH52A1ZYNqAMrg gJbowOeHO4nW0QMNVTSp    OEAOzusBDXh13CRLGMwJ OWkStUUVQMvgEIjoAXZH    lyJiI2jneja26o38pnDS UBCtClslVJYroMj0e7Ab    sIv7Q6ZKRbw2HhmgTv3k KhJmckB3NzObJSmoSluh    END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
 //Citizen - fib devices details
  devices[908112345678] = {name:"FIB Archive Data Server", description: "FIB Secured System", security: 3, files: getBasicFiles()}
  devices[852335275679] = {name:"FIB Security System", description: "FIB Secured System", security: 4, files: getBasicFiles()}
  devices[578145645670] = {name:"FIB Blacksite", description: "FIB Secured System", security: 4, files: getBasicFiles()}
  //devices[991252345671] = {name:"FIB Personal Laptop", description: "FIB Agent McConnell Laptop", security: 5, files: {"Users":{"admin":{"Investigations":{"burnerphones.asec": {type: "static", data:["Bench Guy","Sucks"]},"gangbenches.ksd": {type: "static", data:["Bench Guy","Sucks"]},"heroinoperation.sme": {type: "static", data:["Bench Guy","Sucks"]},"riggedelections.tc": {type: "static", data:["Bench Guy","Sucks"]},"weapondealers.tc": {type: "static", data:["Bench Guy","Sucks"]}},},}},"System":{"os.bin":{type:"static", tags:["os"]}}}
  devices[991252345671] = {name:"FIB Personal Laptop", description: "FIB Agent McConnell Laptop", security: 5, files: {"Users":{"admin":{"Investigations":{"cybercrime.fve": {type: "encrypted", data:["                                             rP3Ol4Jl2IBqTnCsOh6H jM8vxysOSlioKnhIUaP4    dKfvFIusZJM3ycLrIayD UbKJeFops5woI8ZGJMzT    MSdrdkaPaR2kbAzaFIIp E6c1bSQA9ecC8fDamYWb    fArTAMEIebq8aiHfhXN0 rVSVbwpVeHKkil8OvGDl    hgRVVLs15PPhTy1cYsw5 qFYkIsCF0IQCR1URl1rF    URrOcgeWvtOnGCksW5nr expxmuZHM3wAHHzbVW3U    MjIYshhalGxc0S8IOses hGhoL4OE7WuxCHDQIehA    tbPZF9Rkt8lUFEUem2j9 ZR25tojDJCfMQze832qg    OSTb130I5WOPshOLq8k9 CE4axmukbcb0GNa536mb    vqRWczbSe22okMjgISFJ Vhot78w6WSuoLSOPmDGz    s8Pi50Px674J7gzhrK8x IFETIJvNx8YX8c2m2lZk    pSG5mZ0KDd2d37osvYFZ qbdcMGFzYVMuEbTiu7Ia    fLR3akAs4OR2yNjaYnsj yVZkjwpiMvJHyTk4Ww4A    k3QsQhgwz3eDBj4xOlEa zWjskZ3NwDCvV0XVHHrL    8esfwo9rgpDVexk1axan FAm5s7F9OYJBt8mzMQZH    isy31UFJ52C1BAPsCOti iLdqyQgJQ4pY0SOPXVUr    QGCQbwuDFZj13ETNIOyL QYmUvWWXSOxiGKlqCZBJ    naLkK2lpglc26q38rpFU WDEvEnunXLAtqOl0g7Cd    uKx7S6BMTdy2JjoiVx3m MjLoemD3PbQdLUoqUnwj    END OF FILE                                  "]},"fissures.fve": {type: "encrypted", data:["                                             IgsvFBqZ3qic29Sk2Aeb WqKJMtWgr4KH7LLJBcfR    O36RMCYQ3yPKfag6z5tq EIqoZOSfFfcpM5lTsP9k    lqTKfa9QcomKP7qSTXc0 SYMakwROxwKBEvH74Fxt    rrbX581jveI3FXPVBHPn fAz6JmTTQnAvtacQbrzv    VMX633VYnCouoRkGHOQX SxRHr77WgR73OFwvw8Hj    BxbqIPhUOZTZUgB9lmuP bNKTRxJJelhbsuZPEDme    hxUOrd0J1myo4TZHFKiQ 7rVEWH7VmBr5ZEepWD6K    tE5oepSzXmk77soRNYAR MmL7N2a2EJfd7m3R142V    hgAA7JEJihRi6pfvKrv3 MAHV83rL4eJuw5xfMt2X    6SjrDg0vJqHyrJRF0Vcv X6XMxuSbNnVfJRtSc5cr    e2EgjVVsjWWkLatnZMZZ FzbLa09Y7zDiRMpTMdO6    yJo4bpKmo2e2PkvmwPJa pAVpZRzryGHwemikQC7z    hg3rvhG7CAw9jjg9Qym5 S9hS1ipXELXc73ZTKpXJ    RlpzTLShOSbmEnO2yDiL ZuaIYS0c9CCP2pfLjDk4    aW3LBl6YlI8FFjxbyX5d qRwYY8s0fAr15huccyV3    I4MZWwsDPvsnkRVnZx9E KStbbOVzV8BFYgHEOjWo    Qw1sNcGCGHmBYPU3AfMh yID4RRPDUK8eM5D5p8o8    0oduy2gi1WoSrXq4kczq BYUZAaI3q1WO5heOAy2l    dcSBIVpZvHiZSxaRmCEM oLA3G1gLUIiS0fJajgNs    END OF FILE                                  "]},"mostwanted.fve": {type: "encrypted", data:["                                             GONUfPx9MRqvGuJSNXQf jYEwZYwJSbg7EKewnvmK    uRTflpril8W4tB7iq90p EI6lc45uTFy5SZ3d7BI0    rtAgOnl57U6oh7cOPfvg 2x5LZ25FyZncBtguPkYf    GVKmEoqmSHLwB55BrKzB GQif2ROSeWXBqLgNF6Ob    BGJUsh6hI9bnxhZE5DFj KH215XN2opz5agOhMQQS    Imu8TsKGLctzsh7mc1mA V8oIiZujYPX0vwUmsAcN    ClUzVn8iMlT6I05921Zz nRlNApstU7cDGUSRZh1E    Ph5x61rU5AwLVXM5IVLX IOX418DYbzXm9mJakVjE    gbN498ElL84EVwRHm5Qx zYAQZdnV7ZEurTjBFnEP    jG3h1m0aK95RjwdJkpkG u42cWMCQ5DaRTPH1SZGD    dE8xcB77KaT79qAOXwGJ HkpYZ3SxtWheCxB3rM0w    GIfRHlje1gUDg8zeO2rU d6SGX9dPzomPhgWxlPl8    Gdlzk6UY0u2IGElaHCjM Bk4C7cdjT4fIoG8qPgFM    l9FHgvRf48RbfaFbiEac 09Y2xLTB2MCa0NmH9zB3    HXRgkMKpS4JSIBZm785z 6lByF22sl9NgnLnIWT5c    UT1PebluFTwGiZwCVgyN ROFF2I2i5odpyMbLTmMU    0Xbj707HvmzZIRfgEKGo Ae53iJvawGckcemAPYZE    zlxBxe7nBD6OWJmkCyv5 Wzv2wxRxJVPMhP92aUxw    HR2fQZF47DUyC5sz5kiY YyMzOUiW2y2rZbDihhop    END OF FILE                                  "]},"pdbombings.fve": {type: "encrypted", data:["                                             0VSjvSWjlzCbKI8KWU7T lpfu737CqBOj2uFu4M7s    FNEo3mi8viRmOneNsnhu U6Uhj28PEBgQrWl90QnA    s4pxcUDqaI7wnfCqGkG8 G9KkQXfaJNscZo9In7VT    GdKuoJy4h02RvDZw4KW6 gq2YsSoDRzASAR442V84    i6gBIU46HyEaGafK4Ajh 4I99Nkap4lDndUCscVTV    SGmFkMgL75I6lSM3ONWB CD0ROuQDKO7ul4UMZq4s    PqjkIjjrhuHwX7c3S0Cp pXphv8QEJ80l016zWTxK    pAlOxAONIw8GfNG8C79n yZGONRX7uKXWS7DKERz2    GReD0qIjTIZt1qphFC64 ozwPvD6Y8Mpz25ibErsA    b4nzqaMZOooFysGTHsPi qTTVJi3ziNPGWvKOzZJB    5LFXEx25BdHQXNAO3ZuH 1VHS5pr3dz12uhqBweR6    YL3SpnYlJTYhsVMUOLov CSLNE2XhcwxTR5bJv2ef    6fceOeIK5X7agQHtM3H3 SuTMPYdsqQl6pvADf7pU    norcqz2my7xZO1dEhxGp 4w4FLh5Guxy8EvUl2I9e    bngzJC4FEd5w21nJuWlw PhmyFZd740NN0FU26jRL    tLjKtnSbVHXNetQqGEiE M7Es1SZeh6f2F185favX    7kAUgr6JRhs6qunzWIYJ pAVzRgY5G63zOnzj5tuj    zKEiNk9X9neilWBTeQTg GXGhVHOI65nN6HrFWT0M    1MZY1rgDkblqG9Cpwlh0 doxyWKff6MzcfJlq7Gvo    END OF FILE                                  "]},"sightings.fve": {type: "encrypted", data:["                                             0J2xz0ztOcjq868JIjnm xcRrCXOAEYGx4D1t0ZaG    RHkGZmSB4Wv3FwZxQcBp EWODVLmWea2UpVUMJTeK    zeE9SoqM3GgSasjDTnyV zkaE5QZQddy9jUaEduDK    dXlifUtBWlrpkwvqiYML WJS9ABOud6mUmtib9sDB    bV6Kk4rAn1BdNyix2Yuo U4kpD7A7MXadv7XRsVns    HZlgfRSgIP3xmWuWBwDF fdPJHLk95IulobMq6UCg    yBWBdZNS1LOSuMzjxE9a IWtqhkVwEyxkRFTbVIUu    N5Cf1QXFQaePKSPyHpJo n0StVP0BjYRZ4MX0Ec4x    a7gdjaKhKXETV6FT0ucc qu3k31NoCVnoQ45MLU4l    LMNGcNhi7qB1Vf3akccW Yn3OqBJysXM7696NYnyU    jbf4HuI6y96C8S2m3c12 F7ukrJNqCndMN9HaGBbo    EckXDrzwRzlsBEWPWpon 56ZT1mNgUgZ4V5aA7oaW    NrjrS6mqN8trYkWooR6A saVaOCb4pCjpKbunEppy    ApYqoVgNPUTusmoSKymt YLeJLV4MJGa1hxAgGrxQ    szB4LKW9kHpqVjmPkBY5 Wm4XBsEOre9FLsnIqSTF    Jzz1PXkgVz5hjvkD5jXs J7eBrGJkJJlavvnSWNZa    UkPIb8IQNgOYohH0J0tF rmEcztdlrXO2KJm1lx9X    alKmtdSEmIMqvfJ8tUGj 5CK2JyvMPoT3yFHffH81    IVGgF00aTXyC8wFtZ38g sJOL9cFSwiGLLoZuVJtz    END OF FILE                                  "]}},},}},"System":{"os.bin":{type:"static", tags:["os"]}}}
  //Citizen - Cerberus Files
  devices[159926970709] = {name:"CI Staff Database", description: "CI Staff Database", security: 5, files: {"Users":{"admin":{"Staffing":{"cerb_1.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Lang Buddha       Owner              1391    Dean Watson       Cerberus           3503    Harry Brown       Cerberus           3718    Nancy Drew        VP Operations      7856    Eve Summers       VP Operations      7778    Tim Collins       General Council    2327    Marlo Stanfield   Creative Dir.      1257    Mila Smoak        Dir. PR            1573    Tommy Tate        TEO               10804    Leslie Lingberg   Cerberus           1071    James Barnes      Staff             11681    Mickey S          Cerberus           3654    Siz Fulker        Wdn of the North   1052    Abdul ALRahim     Managing Partner   1958    Lawrence Splainer Attorney General   2336    Kyle Pred         CPD                1323                                                 END OF FILE                                  "]},"cerb_2.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Jenny Hall        CPD                1222    Matthew Espinoz   CPD                1079    Anita May         CPD                1158    Daisy Dukakis     CPD                1288    T700 Smith        CPD                5942    Minverva Maat     CPD                2896    Dale E Yin        CPD                5842    Shelly Smith      Creativity Exec.   2333    Lexi Law          Dir. Logistics     1380    Kitty Dean        Dir. R&D           3938    Lennon Lee        Staff             12840    Fiona Stewart     Heard of PR        1189    Penelope Farthing Dir. Personnel     7915    Emma Gaine        Political Liason   2151                                                                                                                                           END OF FILE                                  "]},"cerb_ind.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Lang Buddha       Owner              1391    Leslie Lingberg   Cerberus           1071    Cassie Cupcake    Cerberus           1202    Harry Brown       Cerberus           3718    Randal Bevington  Security           3718    Nancy Drew        CEO                7856    Eve Summers       Cerberus           7778    Dominic Luciano   Accountant        13873    James Barnes      Cerberus          11681                                                                                                                                                                                                                                                                                                                                                                            END OF FILE                                  "]},"cerb_ind_arm.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Lang Buddha       Owner              1391    Tim Collins       Lawyer             2327    Dominic Luciano   Accountant        13873    James Barnes      Cerberus/CEO      11681                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             											 END OF FILE                                  "]},"cerb_law.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Lawrence Splainer Owner              2336    Tim Collins       Partner            2327    Amber Gold        Staff Attorney     2160    Doug  the Pug     Attorney at Paw   11681                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             											 END OF FILE                                  "]},"cerb_legal.dat": {type: "readonly", data:["                                             <NAME>           <POSITION>     <STATE ID>   Tim Collins       Owner              2327    Dean Watson       Cerberus           3503    Lang Buddha       Cerberus           1391    Lawrence Splainer A.G. Cousel        2336    Tim Collins       General Counsel    2327                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                											 END OF FILE                                  "]},},},},"System":{"os.bin":{type:"static", tags:["os"]}}}}
  //Citizen - Cerberus Networks
  networks[cerberusIP] = {name: "CENS", description: "Cerberus External Network Service", devices: {159926970709: true}, instance: "cerberus", data: {files: {}, items: []}, connections: [cerberusarchIP], security: 2}
  networks[cerberusarchIP] = {name: "C.I. Archives", description: "Cerberus Industries Archives", devices: {}, instance: "cerberusarch", data: {files: {}, items: []}, connections: [cerberusindIP], security: 3}
  networks[cerberusindIP] = {name: "Cerberus Industries Armory", description: "CI Armory Data Server", devices: {}, instance: "cerberusind", data: {files: {}, items: []}, connections: [cerberuspdIP], security: 3}
  networks[cerberuspdIP] = {name: "C.P.D.", description: "Cerberus Law Services", devices: {}, instance: "cerberuspd", data: {files: {}, items: []}, connections: [saspdIP], security: 3}
  //Citizen - Populated Sites
  networks[mentorIP] = {name: "The Mentor", description: "Manifesto E-Book Archive", devices: {}, instance: "mentor", data: {files: {}, items: []}, connections: [infobattleIP], security: 4}
  networks[saiIP] = {name: "SCGE", description: "Definitely not an online gun emporium", devices: {}, instance: "sai", data: {files: {}, items: []}, connections: [], security: 2}
  networks[talonIP] = {name: "N∞&╕~¿.Mw", description: "ßNÆ@╘j~.hwgMM╗j$gµéU'LjRY%╡ΦÜƒN∞&╕~", devices: {}, instance: "talon", data: {files: {}, items: []}, connections: [], security: 4}
  networks[spadesIP] = {name: "Unrecognised Server", description: "No Information Available", devices: {}, instance: "spades", data: {files: {}, items: []}, connections: [talonIP], security: 4}
  networks[infobattleIP] = {name: "Info Battle", description: "The only source for the truth", devices: {}, instance: "infobattle", data: {files: {}, items: []}, connections: [lspiIP], security: 2}
  networks[lspiIP] = {name: "LSPI", description: "Los Santos Private Investigations", devices: {}, instance: "lspi", data: {files: {}, items: []}, connections: [russianIP], security: 2}  
  networks[russianIP] = {name: "Посольство России", description: "Частная сеть Посольство России", devices: {}, instance: "russian", data: {files: {}, items: []}, connections: [spadesIP], security: 4}
  //Citizen - Banks + Financials
  networks[bcsIP] = {name: "Blaine County Savings", description: "Blaine County Savings Online Banking", devices: {9566772332395: false, 7977721851563: false, 7920215743863: false, 9149313923270: true}, instance: "bcs", data: {files: {}, items: []}, connections: [psbIP], security: 3}
  networks[psbIP] = {name: "Pacific Standard", description: "Pacific Standard Public Deposit Online Banking", devices: {6036721982960: false, 7416299110884: false, 5950050401222: false, 6537239917136: true}, instance: "psb", data: {files: {}, items: []}, connections: [penrisIP], security: 3}
  networks[penrisIP] = {name: "Penris", description: "Penris Financial Services", devices: {1845617871137: false, 7661491175580: false, 2310019594878: false, 6159843817133: true}, instance: "penris", data: {files: {}, items: []}, connections: [mazeIP,lombankIP,kaytonIP,udepotIP], security: 3}
  networks[mazeIP] = {name: "Maze Banking Services", description: "Maze Business Banking Service", devices: {7932841996235: false, 5370827821993: false, 7760647140406: false, 7767308210925: true}, instance: "maze", data: {files: {}, items: []}, connections: [iolIP], security: 3}
  networks[lombankIP] = {name: "Lombank", description: "Lombank Financial Services Multinational", devices: {6101352152177: false, 8545099794672: false, 2626653525671: false, 2660761271618: true}, instance: "lombank", data: {files: {}, items: []}, connections: [iolIP], security: 3}
  networks[kaytonIP] = {name: "KAYTON", description: "Kayton Banking Group", devices: {2032073439292: false, 5991480122462: false, 2127905690718: false, 2342516236496: true}, instance: "kayton", data: {files: {}, items: []}, connections: [iolIP], security: 3}
  networks[udepotIP] = {name: "Union Depository", description: "Union Depository Online Banking Service", devices: {2061250044534: false, 9523471564785: false, 9793126261871: false, 3273498059638: true}, instance: "udepot", data: {files: {}, items: []}, connections: [iolIP], security: 3}
  networks[iolIP] = {name: "IOL", description: "International Online Unlimited Banking Group", devices: {7274413320417: false, 3696858819766: false, 5512589237010: false, 7295455700747: true}, instance: "iol", data: {files: {}, items: []}, connections: [dssIP], security: 3}
  //Citizen - DSS Data Storage Solutions
  networks[dssIP] = {name: "DSS Main Server", description: "Digital Storage Solutions", devices: {}, instance: "dss", data: {files: {}, items: []}, connections: [], security: 4}
  //Citizen - PD Networks
  networks[dpdIP] = {name: "DPD", description: "Davis Police Department", devices: {}, instance: "dpd", data: {files: {}, items: []}, connections: [saspdIP], security: 2}
  networks[vpdIP] = {name: "VPD", description: "Vinewood Police Department", devices: {}, instance: "vpd", data: {files: {}, items: []}, connections: [saspdIP], security: 2}
  networks[saspdIP] = {name: "SASP", description: "San Andreas State Patrol", devices: {}, instance: "saspd", data: {files: {}, items: []}, connections: [sasprdIP,dpdIP,vpdIP,sdsoIP,docIP], security: 4}
  networks[sasprdIP] = {name: "SASPR", description: "San Andreas State Park Rangers", devices: {}, instance: "sasprd", data: {files: {}, items: []}, connections: [saspdIP], security: 3}
  networks[sdsoIP] = {name: "SDSO", description: "Senora Desert Sheriff's Office", devices: {}, instance: "sdso", data: {files: {}, items: []}, connections: [saspdIP], security: 2}
  networks[docIP] = {name: "DOC", description: "Department of Corrections", devices: {}, instance: "doc", data: {files: {}, items: []}, connections: [challIP], security: 4}
  //Citizen - city hall etc
  networks[challIP] = {name: "chall", description: "City Hall Records Department", devices: {}, instance: "chall", data: {files: {}, items: []}, connections: [lsiaIP], security: 4}
  networks[lsiaIP] = {name: "L.S.I.A.", description: "Los Santos International Airport Online Ticketing Services", devices: {}, instance: "lsia", data: {files: {}, items: []}, connections: [], security: 4}
  //Citizen - IAA
  networks[iaaIP] = {name: "I.A.A.", description: "International Affairs Agency Database", devices: {}, instance: "iaa", data: {files: {}, items: []}, connections: [iaaarchIP,iaaextIP,iaaextIP,iaabackIP], security: 4}
  networks[iaaarchIP] = {name: "I.A.A. Database", description: "I.A.A. Database Archive", devices: {}, instance: "iaa", data: {files: {}, items: []}, connections: [], security: 4}
  networks[iaaextIP] = {name: "I.A.A. Ext.", description: "I.A.A. External Services", devices: {}, instance: "iaa", data: {files: {}, items: []}, connections: [], security: 4}
  networks[iaabackIP] = {name: "I.A.A. Backups", description: "I.A.A. Off-site Backups", devices: {}, instance: "iaa", data: {files: {}, items: []}, connections: [], security: 4}
  //Citizen - ChatBBSnetwork
  networks[chatbbsIP] = {name: "DWANGO WareZ Chat", description: "Private invite only BBS chatboard", devices: {}, instance: "chatbbs", data: {files: {}, items: []}, connections: [shopIP,fenceIP,bankIP], security: 4}
  networks[bankIP] = {name: "Fleeca Online Bank", description: "Fleeca Inc.'s online, anonymous, banking system", devices: {}, instance: "bank", data: {files: {"bank.exe": {type: "static", tags: ["bank"]}}, accounts: {}}, connections: [], security: 4}
  //Citizen - new shop network
  networks[shopIP] = {name: "Milk Road Online Shop", description: "Milk Road's Inc.'s online, anonymous, shopping system", devices: {}, instance: "shop", data: {files: {"shop.cmd": {type: "dynamic", data: ["connect " + getIP(shopIP)]}}, items: [["notes.exe", 10, {tags: ["notes"], type: "static"}],["wepcrack.exe", 50, {tags: ["wepcrack"], type: "static"}],["citizen.cmd", 250, {tags: ["citizen"], type: "readonly", data: ["connect " + getIP(fibIP)]}],["hfrn.cmd", 500, {tags: ["hfrn"], type: "readonly", data: ["connect " + getIP(watchersIP)]}]]}, connections: [saiIP], security: 4}
  networks[fenceIP] = {name: "SlothGate", description: "Where hackers go to sell their loot", devices: {}, instance: "fence", data: {files: {"sell.exe": {type: "static", tags: ["sell"]}}}, connections: [mentorIP], security: 4}
  //Citizen - FIB secure network
  networks[fibextIP] = {name: "FIB EXT", description: "FIB External Devices", devices: {908112345678: false, 852335275679: false, 578145645670: false, 991252345671: true}, instance: "fib", data: {}, connections: [iaaIP], security: 4}
  networks[fiblsIP] = {name: "FIB LSO", description: "FIB Los Santos Office", devices: {}, instance: "fib", data: {}, connections: [], security: 3}
  networks[fibvcIP] = {name: "FIB VCO", description: "FIB Vice City Office", devices: {}, instance: "fib", data: {}, connections: [], security: 3}
  networks[fiblcIP] = {name: "FIB LCO", description: "FIB Liberty City Office", devices: {}, instance: "fib", data: {}, connections: [], security: 3}
  networks[fibIP] = {name: "FIB", description: "FIB Secure Data Server", devices: {}, instance: "fib", data: {}, connections: [fiblsIP,fibvcIP,fiblcIP,fibextIP], security: 4}
  //Citizen - Data Storage Solutions
  networks[dssIP] = {name: "DSS Main Server", description: "Digital Storage Solutions", devices: {}, instance: "dss", data: {files: {}, items: []}, connections: [], security: 4}
  //Citizen - Hacked Website used for sites that have wormOS installed
  networks[hackedIP] = {name: "PWNED", description: "PWNED SYSTEM", devices: {}, instance: "hacked", data: {files: {}, items: []}, connections: [], security: 5}
  //Citizen - Watchers Shop
  //orig  networks[watchersIP] = {name: "Æ@╘j~.hw▄gΦ∞", description: "µrM∞╦*hg¿─~.", devices: {}, instance: "watchers", data: {files: {}, items: [["thebeast.cmd", 1, {tags: ["thebeast"], type: "readonly", data: ["connect " + getIP(cerberusIP)]}],["fhack.cmd", 1, {tags: ["fhack"], type: "readonly", data: ["connect " + getIP(bcsIP)]}]]}, connections: [], security: 4}
  networks[watchersIP] = {name: "Æ@╘j~.hw▄gΦ∞", description: "µrM∞╦*hg¿─~.", devices: {}, instance: "watchers", data: {files: {}, items: [["thebeast.cmd", 100, {tags: ["thebeast"], type: "readonly", data: ["connect " + getIP(cerberusIP)]}],["fhack.cmd", 250, {tags: ["fhack"], type: "readonly", data: ["connect " + getIP(bcsIP)]}],["phreaker.cmd", 400, {tags: ["phreaker"], type: "readonly", data: ["connect " + getIP(payphoneIP)]}]]}, connections: [], security: 4}
  //Citizen - Payphone Directory
  networks[payphoneIP] = {name: "Phone Phreaks", description: "Phreaking since 1971", devices: {}, instance: "payphone", data: {files: {}, items: []}, connections: [], security: 4}
  //bookmarks available at start
  bookmarks.push(["DWANGO WareZ Chat", getIP(chatbbsIP)])
  //Citizen - bookmarks for quick watchers shop testing
  //bookmarks.push(["DWANGO WareZ Chat", getIP(chatbbsIP)], ["fleeca", getIP(bankIP)], ["sloth", getIP(fenceIP)], ["fibext", getIP(fibextIP)], ["payphone", getIP(payphoneIP)])
  //Citizen - bookmarks banks testing
  //bookmarks.push(["BCS", getIP(bcsIP)], ["iolIP", getIP(iolIP)], ["udepotIP", getIP(udepotIP)], ["kaytonIP", getIP(kaytonIP)], ["lombankIP", getIP(lombankIP)], ["mazeIP", getIP(mazeIP)], ["dssIP", getIP(dssIP)], ["penrisIP", getIP(penrisIP)], ["psbIP", getIP(psbIP)], ["bcsIP", getIP(bcsIP)])
  //Citizen - easy test bookmarks with hidden servers 
  //bookmarks.push(["iaabackIP", getIP(iaabackIP)], ["iaaextIP", getIP(iaaextIP)], ["iaaarchIP", getIP(iaaarchIP)], ["iaaIP", getIP(iaaIP)], ["lsiaIP", getIP(lsiaIP)], ["challIP", getIP(challIP)], ["docIP", getIP(docIP)], ["sdsoIP", getIP(sdsoIP)], ["sasprdIP", getIP(sasprdIP)], ["sasprdIP", getIP(saspdIP)], ["vpdIP", getIP(vpdIP)], ["dpdIP", getIP(dpdIP)], ["iolIP", getIP(iolIP)], ["udepotIP", getIP(udepotIP)], ["kaytonIP", getIP(kaytonIP)], ["lombankIP", getIP(lombankIP)], ["mazeIP", getIP(mazeIP)], ["dssIP", getIP(dssIP)], ["penrisIP", getIP(penrisIP)], ["psbIP", getIP(psbIP)], ["bcsIP", getIP(bcsIP)], ["russianIP", getIP(russianIP)], ["lspiIP", getIP(lspiIP)], ["cerberusarchIP", getIP(cerberusarchIP)], ["cerberusindIP", getIP(cerberusindIP)], ["infobattle", getIP(infobattleIP)], ["spades", getIP(spadesIP)], ["talon", getIP(talonIP)], ["Sai", getIP(saiIP)], ["Cerberus", getIP(cerberusIP)], ["Mentor", getIP(mentorIP)], ["DWANGO WareZ Chat", getIP(chatbbsIP)], ["Fleeca Bank", getIP(bankIP)], ["Milk Road", getIP(shopIP)], ["SlothGate", getIP(fenceIP)], ["FIB", getIP(fibIP)], ["FIBEXT", getIP(fibextIP)])
  console.log(networks, devices)
}

// Returns a basic filesystem.
function getBasicFiles() {
  return {"Users":{"admin":{"Downloads":{},"Documents":{"Programs":{}},"Applications":{}}},"System":{"os.bin":{type:"static", tags:["os"]}}}
}

//Citizen - Restructured Autogen Files
const fileAttr = {
  "passwords_old": [10,["passwords_####.ksd"]],
  "files_old": [4,["files_####.zip"]],
  "info_old": [5,["info_####.zip"]],
  "print_old": [1,["print_####.log"]],
  //Citizen autogen files
  //Citizen cellphone files
  "call_logs": [7,["call_logs_####.sme"]],
  "media_logs": [10,["media_files_####.sme"]],
  "loc_logs": [15,["triangulation_####.sme"]],
  //Citizen business files
  "sales_logs": [6,["sales_####.log"]],
  "ccard_logs": [25,["creditcards_####.ksd"]],
  "purchase_logs": [8,["purchase_####.log"]],
  //Citizen lifeinvader files
  "domain_reg": [10,["domain_####.fve"]],
  "ads_arch": [8,["ad_####.fve"]],
  "email_arch": [15,["email_arch_####.fve"]],
  //DSS backup files
  "site_backup": [16,["site_backup_####.asec"]],
  "sales_backup": [12,["sales_backup_####.asec"]],
  "ccard_backup": [25,["credit_backup_####.asec"]]
} // Defines file attributes based on tag. (sellPrice, [name, name...])
const deviceAttr = {
  "printer_old": [4,[["print_old",100,1,5]],["dd_printer_####"]],
  "desktop_old": [8,[["files_old",100,1,5]],["dd_desktop_####"]],
  "laptop_old": [8,[["files_old",100,1,2],["info_old",50,1,1]],["pixel_laptop_####"]],
  "archive_old": [10,[["passwords_old",100,1,2],["files_old",100,2,3],["info_old",70,1,2]],["scsi_archive_####"]],
  //Citizen autogen devices
  //Citizen cellphone devices
  "celltower_data": [15,[["call_logs",100,1,2],["media_logs",50,1,3],["loc_logs",25,1,3]],["celltower_data_####"]],
  "iFruit_data": [15,[["call_logs",100,1,2],["media_logs",50,1,3],["loc_logs",25,1,3]],["iFruit_data_####"]],
  //Citizen business devices
  "business_data": [20,[["sales_logs",100,1,2],["ccard_logs",60,1,3],["purchase_logs",60,1,3]],["pos_system_####"]],
  //Citizen lifeinvader devices
  "lifeinvader_data": [25,[["domain_reg",70,1,2],["ads_arch",100,1,3],["email_arch",50,1,3]],["lifeinvader_arch_####"]],
  //Citizen DSS devices
  "backup_data": [30,[["site_backup",100,1,2],["sales_backup",80,1,3],["ccard_backup",60,1,3]],["dss_backup_####"]]
} // Defines device attributes based on tag. (sellPrice, [[fileName, chance, min, max], [fileName, chance, min, max]...], [name, name...])
const networkAttr = {
  "public_none":[0,[["printer_old",100,1,1],["desktop_old",80,1,1],["laptop_old",40,1,4]],[],["% free WiFi"]],
  "private_wep":[1,[["printer_old",100,1,1],["business_data",100,1,1],["desktop_old",100,1,1],["archive_old",60,1,1]],[],["% free WiFi"]],
  "cell_wep":[1,[["celltower_data",100,1,3],["iFruit_data",60,1,5]],[],["Celltowa@@@@","Badger@@@@","Tinkle@@@@","Whiz@@@@","bitterSweet@@@@"]],
  "lifeinvader_wep":[1,[["lifeinvader_data",100,1,3]],[],["Lifeinvader@@@@@@"]],
  "dss_wep":[1,[["backup_data",100,1,3]],[],["DSS@@@@@@"]]
} // Defines network chances and attributes based on tag. ([[deviceName, chance, min, max], [deviceName, chance, min, max]...], [name, name...])
const networkChances = [
  [90,"public_none"],
  [70,"private_wep"],
  [60,"cell_wep"],
  [40,"lifeinvader_wep"],
  [30,"dss_wep"]
] // List of chances for network appearences on generation.

//None - No security open access, WEP - requires WEPCRACK, WPA/WPA2/WPA3 - unaccessible security, CZN - Citizen cracked security open network/device
const securityNames = ["NONE","WEP","WPA","WPA2","WPA3","CZN"]
const names = ["Abdul's Taxi","AirX","Ammu-Nation","Bahama Mama's","Bean Machine","Betta Life","Bullet Club","Burger Shot","Cerberus","CGI","Clean Getaway","Cool Beans","Deja Brew","Diamond Casino","Dodo Logistics","Fast Loans","Flop's Shop","Fresh Out","Gold Rush","Guild Hall","H&O Exports","Harmony Garage","Hayes Auto","Hero Wine","Hoe Depot","Iron Hog","LifeInvader","Liquid Library","LSBN","Maldini's","Mojito Inn","Ottos Autos","Overboost","PawnHub","Pitchers","Pixel Perfect","PDM","Roosters Rest","Sionis Ind","Tequi-la-la","Ratshack","Richman Hotel","Uwu Cafe","VLC","Weazel News","X-Mart"]
var currentUID = 0 // Current number for UIDs. Incremented whenever used.
var soldUIDs = [] // List of all UIDs on files which have been sold to the shop.

// Generate and create a new network. Returns the IP of the created network.
function addNewNetwork(networkType = "") {
  if (networkType === "") {
    networkType = networkChances[doWeightTable(networkChances)][1]
  }
  var networkArrtibutes = networkAttr[networkType]
  var network = {name: substituteText(randomChoice(networkArrtibutes[3])), description: "N/A", devices: {}, connections: [], security: networkArrtibutes[0], uid: getNewUID()}
  addSecurity(network)
  for (var i of networkArrtibutes[1]) {
    var temp = parseChance(i)
    if (temp) {
      for (var j = 0; j < temp[1]; j++) {
        var deviceArrtibutes = deviceAttr[temp[0]]
        var device = {name: substituteText(randomChoice(deviceArrtibutes[2])), description: "N/A", files: getBasicFiles(), down: false, type: temp[0]}
        for (var k of deviceArrtibutes[1]) {
          var temp1 = parseChance(k)
          if (temp1) {
            for (var l = 0; l < temp1[1]; l++) {
              device.files.Users.admin.Documents[substituteText(randomChoice(fileAttr[temp1[0]][1]))] = {type: "static", lootTag: temp1[0], uid: getNewUID()}
            }
          }
        }
        var MAC = randomMAC()
        devices[MAC] = device
        if (network.security < 1) {
          network.devices[MAC] = true
        } else {
          network.devices[MAC] = false
        }
      }
    }
  }
  for (var i of networkArrtibutes[2]) {
    var temp = parseChance(i)
    if (temp) {
      for (var j = 0; j < temp[1]; j++) {
        var ip = addNewNetwork(temp[0])
        network.connections.push(ip)
      }
    }
  }
  var IP = randomIP()
  networks[IP] = network
  return IP
}

function evaluateFilePrice(file) {
  if (file.lootTag === "backdoor") {
    var count = 0
    for (var i in networks[file.ip].devices) {
      count += deviceAttr[devices[i].type][0]
    }
    return count
  } else {
    return fileAttr[file.lootTag][0]
  }
}

// Adds security variables to a network based on it's score.
function addSecurity(network) {
  switch (network.security) {
    case 1:
      network.hacked = false
      network.code = randomRange(0,9999)
  }
}

// Return a random digit from 0 to 9 as a string. 
function randomDigit() {
  return randomRange(0,9).toString()
}
  
// Returns the current UID and increments it by one.
function getNewUID() {
  var temp = currentUID
  currentUID += 1
  return temp
}

// Parses an object with a chance and returns the object and amount.
function parseChance(object) {
  var rand = randomRange(1,100)
  if (rand <= object[1]) {
    return [object[0],randomRange(object[2],object[3])]
  }
  return false
}

// Replaces certain characters in text with randomised elements.
function substituteText(text) {
  while (true) {
    var temp = text.replace(/#/i,randomDigit()).replace(/@/i,randomRange(0,15).toString(16).toUpperCase()).replace(/%/i,randomChoice(names))
    if (temp === text) {
      return text
    }
    text = temp
  }
}

// Returns a random date from between two times.
function getRandomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start))
  var hour = startHour + Math.random() * (endHour - startHour) | 0
  date.setHours(hour)
  return date
}

// Parses a weight table and returns a random element.
function doWeightTable(table) {
  var count = 0
  for (var i of table) {
    count += i[0]
  }
  var rand = randomRange(0,count-1)
  count = 0
  for (var i = 0; i < table.length; i++) {
    count += table[i][0]
    if (count > rand) {
      return i
    }
  }
  return undefined
}

// Const for storing desired FPS.
var fps = 60

// Bool flagging if in frame.
var updating = false

// Storage variable for update function.
var updateFunction

// List of queued events.
var events = [] // stack //

// Add an event to the list.
function addEvent(delay, id, functionName, arguments=[]) {
  if (arguments.length === 0) {
    events.push([0, delay, id, functionName])
  } else {
    events.push([0, delay, id, functionName, arguments])
  }
}

// Run a function defined with strings.
function runFunct(name, args = []) {
  var string = name + "("
  if (args.length > 0) {
    for (var i of args) {
      string += JSON.stringify(i) + ","
    }
    string = string.slice(0, string.length - 1)
  }
  string += ")"
  eval(string)
}

// Runs once every 1/fps seconds.
function update() {
  if (pauseReason === null && !inParse && commandQueue.length > 0) {
    parseInput(commandQueue.shift())
  }
  if (events.length !== 0) {
    console.log(events)
  }
  if (pauseReason === "loading") {
    loadTime -= 1000/fps
    doLoadBar()
    if (loadTime <= 0) {
      pauseReason = null
      loadTime = 0
      if (loadFunction !== "") {
        runFunct(loadFunction, loadData)
      }
      if (loadEndMsg !== "") {
        var normal = true
        if (typeof loadEndMsg === "object") {
          for (var i of loadEndMsg) {
            if (typeof i === "object") {
              normal = false
            }
          }
        }
        if (normal) {
          addLog(loadEndMsg)
        } else {
          for (var i of loadEndMsg) {
            addLog(i)
          }
        }
      }
    }
  }
  var updated = [] // queue
  while (events.length > 0 && (pauseReason === null || pauseReason === "restart")) {
    var object = events.pop()
    object[0] += 1000/fps
    if (object[0] >= object[1]) {
      if (pauseReason !== "restart" || object[2] === -1) {
        if (object[4] !== undefined) {
          runFunct(object[3], object[4])
        } else {
          runFunct(object[3])
        }
      }
    } else {
      updated.push(object)
    }
  }
  while (updated.length > 0) {
    events.push(updated.shift())
  }
  updateFunction = setTimeout(update, 1000/fps)
}

// Connects to an IP or IP / MAC.
function connect(ip, mac=-1) {
  currentIP = ip
  if (ip === playerNetwork) {
    ipDisplay.innerHTML = "<b>IP: 127.0.0.1 (" + getIP(ip) + ")</b>"
  } else {
    ipDisplay.innerHTML = "<b>IP: " + getIP(ip) + "</b>"
  }
  if (mac !== -1) {
    currentMAC = mac
    macDisplay.innerHTML = "<b>MAC: " + getMAC(mac) + "</b>"
    setFilePath(["Users","admin"])
    prevFilePath = ["Users","admin"]
  } else {
	  //here maybe?
    addLog("Connected " + getIP(ip) )
    enterInstance(networks[ip].instance)
    startInstance()
    macDisplay.innerHTML = "<b>MAC: XX:XX:XX:XX:XX:XX</b>"
    currentMAC = -1
  }
}

// Shuts down the player computer.
function restart() {
  prevCommands = []
  currentPos = -1
  storedIP = ""
  storedMAC = ""
  storedFile = null
  commandQueue = []
  clearLogs()
  pauseReason = "restart"
  devices[playerHost].down = true
  addEvent(5000, -1, "reboot", [playerHost])
}

// Reboots a shut down device.
function reboot(device) {
  if (device === playerHost) {
	//Citizen - play reboot sound
	bootup_snd.play()
	addLoadingBar("Booting", 5000, "", "boot")
  } else {
    if (!findFile(devices[device].files, ["System","os.bin"], "os")) {
      devices[device] = {down: true}
    } else {
      addEvent(5000, 0, "bootComp", [device])
    }
  }
}

// Boots a computer.
function bootComp(device) {
  devices[device].down = false
}

// Boots the player computer.
function boot() {
  clearLogs()
  if (!findFile(devices[playerHost].files, ["System","os.bin"], "os")) {
    addLog(["ERROR - Unable to find \"os.bin\"."])
    addLoadingBar("Shutting Down", 2000, "", "die")
  } else {
    addLog("INIT: Sniffer_OS_v0.82 booting                                                             Starting udev:                       [ OK ]  Loading default keymap (us):         [ OK ]  Setting up Remote Volume Management: [ OK ]  Checking filesystems:                [ OK ]                                               Initializing Proxy Connection:       [ OK ]  VPN Connection:                      [ OK ]                                               Remote File System Detected Change: 02/02/23                                             											                                  You have 1 new link type 'link list' to view or 'help' for info on other commands.        											 											 											 											                                                                                        >Welcome back Watcher")
  }
}

// Softlocks the game.
function die() {
  pauseReason = "dead"
  clearLogs()
  clearTimeout(updateFunction)
}

// Resets E V E R Y T H I N G.
function reset() {
  networks = {}
  devices = {}
  bookmarks = []
  createStartingNetworks()
  connect(playerNetwork, playerHost)
  prevCommands = []
  currentPos = -1
  currentBank = ""
  storedIP = ""
  storedMAC = ""
  storedFile = null
  instance = null
  pauseReason = null
  inParse = false
  commandQueue = []
  clearLogs()
  events = []
  clearTimeout(updateFunction)
  //Citizen - play reboot sound - browser needs autoplay to be turned on (under settings - automatically play sounds etc)
  bootup_snd.play()
  addLoadingBar("Booting", 5000, [["INIT: Sniffer_OS_v0.82 booting                                                             Starting udev:                       [ OK ]  Loading default keymap (us):         [ OK ]  Setting up Remote Volume Management: [ OK ]  Checking filesystems:                [ OK ]                                               Initializing Proxy Connection:       [ OK ]  VPN Connection:                      [ OK ]                                               Remote File System Detected Change: 02/02/23                                             											                                  You have 1 new link type 'link list' to view or 'help' for info on other commands.        											 											 											 											 "], ">Welcome back Watcher."], "clearLogs")
  update()
}

reset()
