# Arkanoid

A browser-based Arkanoid/Breakout-style game built with vanilla JavaScript and HTML5 Canvas.

## Live Demo

Play online: https://narek-webdev.github.io/Arkanoid/

## About The Project

This project recreates a classic brick-breaker game loop:
- Move the paddle left/right to keep the ball in play.
- Break bricks by bouncing the ball into them.
- The game ends when the ball falls below the bottom boundary.

The game is implemented with a simple object-oriented structure (`Game`, `Paddle`, `Ball`, `Brick`) and a `requestAnimationFrame` render/update loop.

## Built With

- HTML5
- CSS3
- JavaScript (ES6)
- HTML Canvas API

## Controls

- Left Arrow: Move paddle left
- Right Arrow: Move paddle right
- Space: Start game from paused state
- Play Again button: Reload page and restart after game over

## Project Structure

```text
Arkanoid/
├── index.html      # Canvas and UI markup
├── main.js         # Game logic and loop
├── style.css       # Styling and game-over animations
├── ball.png        # Ball sprite
├── brick.png       # Brick sprite
├── back.gif        # Background asset
└── back_2.gif      # Background asset (current)
```

## Current Gameplay Notes

- Initial state is paused until the player presses Space.
- Bricks are generated from a hardcoded level matrix in `main.js`.
- Paddle and wall collisions are implemented via basic axis-aligned checks.
- Ball speed and level data are currently static.

