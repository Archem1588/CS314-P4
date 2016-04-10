CPSC 314 P4

We are using 2 grace days by handing this in before 5pm on Sunday, April 10. (The three of us together have 8 grace days left before P4, so we should have 8/3 = 2.6 grace days to use for P4.)

====================
WHAT:

A 3D absorb-and-grow game inspired by agar.io and Pacman. The player controls a single 3D sphere using mouse and keyboard interactions. The player's sphere can absorb any other sphere on the map that are smaller than itself. Player's sphere increases in size as it absorbs other spheres, but decreases in speed the larger it grows. There are three types of other spheres in the game: Stationary, Mobile, Spiked. Stationary spheres do not move. Mobile and Spiked spheres move around the map randomly. The player's sphere can absorb smaller Stationary and Mobile spheres, but if it collides with a Stationary or Mobile sphere that is larger than itself, or with a Spiked sphere of any size, or with the Sun, then it explodes and game over. The objective of the game is to have the player's sphere reach a certain size by a time limit.

feature options:
- Advanced Rendering Effects
- Shaders
- Particle System
- Collision Detection
- Animation

====================
HOW:

3D Objects: The player's sphere, Stationary spheres, Mobile spheres, and Sun are created using SphereGeometry. The Spiked sphere has a SphereGeometry center but has spikes made of CylinderGeometry surrounding the center. The spikes are children of the sphere center transformed to their appropriate locations.

3D Camera: The camera is always a child of the player's sphere, but can be controlled by the player while following the player's sphere. Key "I" makes camera move closer and key "K" makes camera move further. Arrows keys up/down/left/right makes camera rotate about the player's sphere. Key "O" resets the camera to a position that is some distance behind the player's sphere (e.g. z = -100).

Interactivity: Player's sphere automatically moves forward at a constant rate, by always translating the player's sphere in the z-direction in local coordinates. Player can control the direction of where the sphere goes using up/down/left/right using WASD keys, the WASD control panel on the right bottom of the screen, or by holding the mouse down. Hitting the W key or pressing the W on-screen rotates the player's sphere (and hence changing the direction in which the sphere is going) up, in local coordinates, by a constant increment. Similariy, S - down, A - left, D - right. For mouse controls, the position of the mouse when it is held down is used to determine the rotation of the player's sphere. The y-coordinate of the mouse rotates the player's sphere up/down, and the x-coordinate of the mouse rotates it left/right.

Lighting and Shading: There is ambient lighting and global lighting coming from the Sun using THREEjs AmbientLight and PointLight. The Mobile spheres have phong lighting and shading on them using THREEjs MeshPhongMaterial, which is lit up by this global light. The ambient lighting makes the backside of the spheres that are not lit by global light brighter. The Stationary spheres do not have lighting on them, and the Spiked spheres have lighting from camera coordinates, using ShaderMaterial and shaders files we wrote.

Picking: Player can see the size of any sphere other than the player's sphere by hovering their mouse over the sphere. The size is displayed on the display board on the left top corner of the screen. Implemented using THREE.raycaster.

Texturing: The Sun has texture. The Mobile spheres have texture and some also have bump mapping. The player's sphere also has texture.

On-screen Control Panel: 
The left-top corner of the screen have displays specifying the
  - Difficulty
  - Time Remaining
  - Current Size
  - Goal (goal size of the player's sphere)
  - Selected Object Size
  - Framerate Counter
Implemented using HTML and CSS.
The right-bottom corner of the screen have WASD controls that the player can control the movement of the player's sphere. Implemented using HTML ImageMap calling P4.js onclick and CSS.
There are two framerate counters. The one on the top right corner is implemented using stats.js. But since it seems like using third party libraries will not satisfy this requirement, we also implemented our own framerate counter, which is displayed at on the display board on the top left corner. FPS is calculated by inversing the difference between the time of the last frame and the current frame. Since the difference is seconds/frame, so the inverse is frames/second. But rather than getting the exactly current frame, it gets the average of the last 30 frames by storing the fps into an array of size 30 (since fluctuations would be too fast to be readable if not average).

Gameplay: Used requestAnimationFrame for each frame, and timing is implemented using THREEjs clock. Similiarily, keyboard and mouse controls are all implememnted using THREEjs keyboard and mouse controls. All objects are children of THREEjs scene.

Advanced Rendering Effects: Some Mobile spheres have textures with bump mapping. The texture and bump mapping on a Mobile sphere is determined by random. The Moblie sphere also has phong lighting and shading on them from a light source coming from the sun. The phong lighting here is implemented using MeshPhongMaterial from THREEjs. The Stationary spheres have reflection/refraction using environment mapping from the skybox that surrounds the game. Some spheres have only reflection, some have only refraction, and some have both. Which one they have is determined by random. Also the player's sphere is transparent to some degrees.

Shaders: The Spiked spheres have phong shading on them using shaders that we wrote ourselves. The lighting for these spheres are given in view cooridinates, meaning the light moves with the camera position (lighting not in world coordinates).

Particle System: Whenever it is game over for the player (i.e. collided with a Spiked sphere, eaten by a larger Stationary or Mobile sphere, collided with the sun, or times out), the player's sphere explode into bits using the particle system. The particle system is implemented using THREE.points, and animated using THREE.clock and Math.random().

Collision Detection: Whenever anything is absorbing another (i.e. player's sphere eats a smaller sphere or a larger sphere eats the player's sphere), the smaller sphere's center point has to be within the radius of the larger sphere for it to be absorbed. But when the player's sphere touches a Spiked sphere or the Sun, as soon as any point in the player's sphere (within its radius) touchs any point in the Spiked sphere or the sun (within their radius), then the player's sphere explodes and game over. There is also collision detection with the walls of the environment. If Mobile or Spiked spheres hit any wall, they will bounce back to the direction that they came from (turning 180 degrees). If the player's sphere is going out of the wall, then the player's sphere will stop moving and there will be a message on the screen indicating that the player is out of the environment and must turn to go back into play.

Animation: The Mobile and Spiked spheres moves around the map randomly. Their movement speed is portional to their size (i.e. the larger they are, the slower they move). Their movement is always a translation in the z-direction in their local coordinates. For each frame, there is a chance (e.g. 5%) that they will rotate in a random direction. Also the Sun has self rotation.

====================
HOWTO:

- Press SPACE key to start game, or pause if the game has already been started, or restart game when it is game over.
- Use WASD keys, mouse click, or click on the direction keys (WASD) on bottom right of screen to move the sphere around.
- Make your sphere larger by going near and "absorbing" other smaller Stationary or Mobile spheres on the map.
- Check the size of spheres by hovering your mouse over them.
- Avoid spheres that are larger than yours as you will be absorbed by them instead.
- Avoid the Spiked spheres as contacting one of them will lead to a game over regardless of its size.
- Goal is to get the size of your sphere to the goal size within the time limit.
- Press T key to change difficulty (Goal size).
- You can also change your viewing perspective by pressing up/down/left/right arrows keys for up/down/left/right movement, or keys I/K for nearer and further respectively, or key P for reseting your view.
- You can also see a track line which shows you your sphere's by pressing "L" key.
- You win the game if you survive and reach the goal size before the time limit. You will lose if you are eaten by a larger sphere, contacted by a Spiked sphere, run into the Sun, or if you do not reach the goal size before the time runs out.


====================
SOURCES:

http://codepen.io/Xanmia/pen/DoljI (Reference for particle explosion animation)
https://aerotwist.com/tutorials/creating-particles-with-three-js/ (Reference for particle systems)
http://www.w3schools.com/tags/tag_map.asp (Reference for on-screen control panel)
https://soledadpenades.com/articles/three-js-tutorials/object-picking/ (Reference for picking)
https://github.com/mrdoob/stats.js/ (Code library for FPS)