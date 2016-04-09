CPSC 314 P4
* Temporary Items for easy debugging purposes:
    - Helper Grid (on Z key)
    - Freeze behaviour (on space key)
    - EarthMap texture on sphere

What:

A 3D absorb-and-grow game inspired by agar.io and Pacman.
Uses mouse & keyboard interactions.
Implemented reflections, particle systems, collision detection, and animation.


How:

Particles - Implemented using THREE.points, animated using THREE.clock and Math.random()
On-Screen Control Panel - Implemented using HTML ImageMap calling P4.js onclick and CSS.
	
	
Howto:	

Press SPACE key to start game or pause if the game has already been started.
Use WASD keys, mouse drag or click on the direction keys on bottom right of screen to move the sphere around.
Make your sphere bigger by going near and "absorbing" other smaller spheres on the map.
Check the size of spheres by hovering your mouse over them.
Avoid spheres that are bigger than yours as attempting to absorb them will destroy yours instead.
Avoid the spiked spheres as contacting one of them will lead to a game over regardless of its size.
Goal is to get the size of your sphere to the goal size.
Press T key to change difficulty (Goal size)
Game will end if your sphere reaches the goal size, your sphere gets destroyed or the time ends before you reach the goal size.

	
Sources:

http://codepen.io/Xanmia/pen/DoljI (Reference for particle explosion animation)
https://aerotwist.com/tutorials/creating-particles-with-three-js/ (Reference for particle systems)
http://www.w3schools.com/tags/tag_map.asp (Reference for on-screen control panel)