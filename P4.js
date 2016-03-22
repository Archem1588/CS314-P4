
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(0, 30, -120);
camera.lookAt(scene.position);
scene.add(camera);

/* 
// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
 */

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// HELPER GRID (Z to show/hide)
var gridGeometry = new THREE.Geometry();
var gridSize = 50;
for(var i = -gridSize; i < (gridSize + 1); i += 2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-gridSize));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,gridSize));
    gridGeometry.vertices.push( new THREE.Vector3(-gridSize,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(gridSize,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);
var grid_state = true;
scene.add(grid);




// GEOMETRY
var geometry;
var material;
var sphere;
geometry = new THREE.SphereGeometry(5, 32, 32);
material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./earthmap.jpg'),
});
sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);




var clock = new THREE.Clock(true);
var time_start = 0;

function updateWorld() {
    var time = clock.getElapsedTime();
    var timeDelta = time - time_start;
    time_start = time;
    
    
    
}




// KEYBOARD

var keyboard = new THREEx.KeyboardState();
keyboard.domElement.addEventListener('keydown', keyEvent);

function keyEvent(event) {
    // helper grid
    if(keyboard.eventMatches(event, "Z")) {
        grid_state = !grid_state;
        grid_state? scene.add(grid) : scene.remove(grid);
    }
    
    
};


// SETUP UPDATE CALL-BACK
function update() {
    updateWorld();
    
    requestAnimationFrame(update);
    renderer.render(scene,camera);
}

update();
