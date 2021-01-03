const nativeImage = require('electron').nativeImage;
const remote = require('@electron/remote');
const { Menu, MenuItem } = remote;
const fs = window.fs;

function getSpriteCell(index) {
    var column = Math.floor(index % 10);
    var row = Math.floor(index / 10);
    var x = -69 * column - 1;
    var y = -57 * row - 1;

    return '' + x + 'px ' + y + 'px';
}

function createElementForMon(mon) {
    var img = document.createElement("div");
    img.style.backgroundPosition = getSpriteCell(mon.sprite);
    img.style.pointerEvents = "none";
    img.title = mon.name.english;
    img.setAttribute("class", "image");
    img.setAttribute("id", "img_mon" + mon.id);
    return img;
}

function saveCollectionState() {
    var collectionStateJson = localStorage.getItem('collectionState');
    var collectionState = JSON.parse(collectionStateJson);

    var collection = document.getElementsByClassName("dexentry");
    for (var i = 0; i < collection.length; ++i) {
        var dexentry = collection.item(i);

        collectionState[dexentry.id] = dexentry.dataset.collection;
    }
        
    localStorage.setItem('collectionState', JSON.stringify(collectionState));
}

function clickMon(e) {
    e.preventDefault();

    var collectionState = e.target.dataset.collection;
    if (collectionState == "unregistered")
        e.target.dataset.collection = "registered";
    else if (collectionState == "registered")
        e.target.dataset.collection = "shiny";
    else if (collectionState == "shiny")
        e.target.dataset.collection = "unregistered";

    saveCollectionState();
}

function stateForMonIsValid(stateMap, id) {
    if (!stateMap.hasOwnProperty(id))
        return false;
    if (stateMap[id] != "unregistered" &&
        stateMap[id] != "registered" &&
        stateMap[id] != "shiny")
        return false;
    return true;
}

function initializeDataset(n, mon) {
    n.dataset.selected = false;

    if (mon.only_in_lgp == true)
        n.dataset.only_in_lgp = true;
    else if (mon.only_in_lge == true)
        n.dataset.only_in_lge = true;
    else if (mon.only_in_pokeballplus == true)
        n.dataset.only_in_pokeballplus = true;
    else if (mon.only_in_pogo == true)
        n.dataset.only_in_pogo = true;
    else if (mon.only_via_trade == true)
        n.dataset.only_via_trade = true;
}

fs.readFile('pokemon.json', 'utf8', function (err, data) {
    if (err) throw err;

    var dex = JSON.parse(data);
    var dexdiv = document.getElementById("dex");

    var initialStateJson = localStorage.getItem('collectionState');
    var initialState;
    if (!initialStateJson) {
        initialState = {};
    } else {
        try {
            initialState = JSON.parse(initialStateJson);
        } catch(e) {
            initialState = {};
        }
    }

    dex.forEach(function (mon) {
        if (mon.hasOwnProperty('forms')) {
            mon.forms.forEach(function (form) {
                var id = 'mon_' + mon.id + '_' + form.id;
                if (!stateForMonIsValid(initialState, id)) {
                    initialState[id] = "unregistered";
                }
            });
        } else {
            var id = 'mon_' + mon.id;
            if (!stateForMonIsValid(initialState, id)) {
                initialState[id] = "unregistered";
            }
        }
    });

    localStorage.setItem('collectionState', JSON.stringify(initialState));

    dex.forEach(function (mon) {
        if (mon.hasOwnProperty('forms')) {
            mon.forms.forEach(function (form) {
                var img = createElementForMon(mon);
                img.style.backgroundPosition = getSpriteCell(form.sprite);
                img.title = img.title + ' (' + form.name + ')';
                img.setAttribute("id", 'img_mon_' + mon.id + '_' + form.id);

                var n = document.createElement("div");
                n.appendChild(img);
                n.setAttribute("class", "dexentry");
                var id = 'mon_' + mon.id + '_' + form.id;
                n.setAttribute("id", id);
                n.dataset.collection = initialState[id];
                initializeDataset(n, mon);

                n.addEventListener("click", clickMon);
                dexdiv.appendChild(n);
            });
        } else {
            var img = createElementForMon(mon);

            var n = document.createElement("div");
            n.appendChild(img);
            n.setAttribute("class", "dexentry");
            var id = 'mon_' + mon.id;
            n.setAttribute("id", id);
            n.dataset.collection = initialState[id];
            initializeDataset(n, mon);

            n.addEventListener("click", clickMon);
            dexdiv.appendChild(n);
        }
    });

});

function selectMon(menuItem, browserWindow, event) {
    var collection = document.getElementsByClassName("dexentry");
    for (var i = 0; i < collection.length; ++i) {
        var dexentry = collection.item(i);
        var is_not_exclusive = (!dexentry.dataset.only_in_lge &&
                                !dexentry.dataset.only_in_lgp &&
                                !dexentry.dataset.only_in_pokeballplus &&
                                !dexentry.dataset.only_in_pogo &&
                                !dexentry.dataset.only_via_trade);

        if (menuItem.id == 'all')
            dexentry.dataset.selected = true;
        else if (menuItem.id == 'none')
            dexentry.dataset.selected = false;
        else if (menuItem.id == 'invert')
            dexentry.dataset.selected = !(dexentry.dataset.selected == "true");
        else if (menuItem.id == 'lge') {
            var is_in_lge = (dexentry.dataset.only_in_lge) || is_not_exclusive;
            dexentry.dataset.selected = is_in_lge;
        } else if (menuItem.id == 'lgp') {
            var is_in_lgp = (dexentry.dataset.only_in_lgp) || is_not_exclusive;
            dexentry.dataset.selected = is_in_lgp;
        } else if (menuItem.id == 'pokeballplus')
            dexentry.dataset.selected = dexentry.dataset.only_in_pokeballplus;
        else if (menuItem.id == 'pogo')
            dexentry.dataset.selected = dexentry.dataset.only_in_pogo;
        else if (menuItem.id == 'trade')
            dexentry.dataset.selected = dexentry.dataset.only_via_trade;
   }
    console.log(collection.length);
}

function markSelectedMon(menuItem, browserWindow, event) {
    var collection = document.getElementsByClassName("dexentry");
    for (var i = 0; i < collection.length; ++i) {
        var dexentry = collection.item(i);
        var selected = dexentry.dataset.selected == "true";

        if (selected) {
            dexentry.dataset.collection = menuItem.id;
            dexentry.dataset.selected = false;
        }
    }

    saveCollectionState();
}

const contextMenu = function() {
    var icon_lge = nativeImage.createFromPath("img/icon_lge.png");
    var icon_lgp = nativeImage.createFromPath("img/icon_lgp.png");
    var icon_pokeball = nativeImage.createFromPath("img/icon_pokeball.png");
    var icon_pogo = nativeImage.createFromPath("img/icon_pogo.png");
    var icon_trade = nativeImage.createFromPath("img/icon_trade.png");

    var selectSubmenu = new Menu();
    selectSubmenu.append(new MenuItem({ label: "All", id: 'all', click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "None", id: 'none', click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "Invert", id: 'invert', click: selectMon })); 
    selectSubmenu.append(new MenuItem({ type: 'separator' })); 
    selectSubmenu.append(new MenuItem({ label: "Let's Go: Eevee", id: 'lge', icon: icon_lge, click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "Let's Go: Pikachu", id: 'lgp', icon: icon_lgp, click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "Pokeball Plus", id: 'pokeballplus', icon: icon_pokeball, click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "Pokemon Go", id: 'pogo', icon: icon_pogo, click: selectMon }));
    selectSubmenu.append(new MenuItem({ label: "Trade", id: 'trade', icon: icon_trade, click: selectMon }));

    var markSubmenu = new Menu();
    markSubmenu.append(new MenuItem({ label: "Unregistered", id: 'unregistered', click: markSelectedMon }));
    markSubmenu.append(new MenuItem({ label: "Registered", id: 'registered', click: markSelectedMon }));
    markSubmenu.append(new MenuItem({ label: "Shiny", id: 'shiny', click: markSelectedMon }));

    var menu = new Menu();
    menu.append(new MenuItem({ label: "Select", submenu: selectSubmenu}));
    menu.append(new MenuItem({ label: "Mark", submenu: markSubmenu}));

    return menu;
}();

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.popup({ window: remote.getCurrentWindow() });
}, false);
