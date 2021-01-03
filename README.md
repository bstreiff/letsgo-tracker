# letsgo-tracker

This is an Electron-based application for keeping track of Pokédex completion in an at-a-glance
view in the [Let's Go, Pikachu! and Eevee!](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon:_Let%27s_Go,_Pikachu!_and_Let%27s_Go,_Eevee!)
games for the Nintendo Switch.

(This was also an experiment for me to learn Electron.)

## How to use

Clicking a Pokémon switches it between "unregistered", "registered", and "shiny" states.

A right-click menu is available to let you select different groups (for example, all Pokémon
obtainable solely within Let's Go Eevee).

Completion state is saved and loaded automatically.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

## Resource credits

Icons:
- https://www.spriters-resource.com/nintendo_switch/pokemonletsgopikachueevee/sheet/110762/
- https://archives.bulbagarden.net/wiki/File:HOME_Let%27s_Go_Eevee_icon.png
- https://archives.bulbagarden.net/wiki/File:HOME_Let%27s_Go_Pikachu_icon.png
- https://archives.bulbagarden.net/wiki/File:Pok%C3%A9_Ball_PE.png
- https://archives.bulbagarden.net/wiki/File:GO_Trade_icon.png

Main icon is a redraw of the Pokédex icon in Let's Go Eevee (I couldn't find a sprite rip).

Pokédex JSON originated with [@fanzeyi/pokemon.json](https://github.com/fanzeyi/pokemon.json) 
but was extensively modified to remove all Pokemon unavailable in the Let's Go games and to
include mapping information for the sprite sheet.

