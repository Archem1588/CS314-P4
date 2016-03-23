
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

// SETTING MATRIX
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix = a;
  this.matrix.decompose(this.position, this.quaternion, this.scale);
}


// GEOMETRY
var geometry;
var material;
var sphere;
var sphereMatrix;
geometry = new THREE.SphereGeometry(5, 32, 32);
material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./earthmap.jpg'),
});
sphere = new THREE.Mesh(geometry, material);
sphereMatrix = new THREE.Matrix4().identity();
sphere.matrix = sphereMatrix;
scene.add(sphere);

// Matrix Variables
var translationMatrix;
var rotationMatrix;



function updateWorld() {
    if (!freeze){
    
    
    translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, 0.3);
    sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, translationMatrix);
    sphere.setMatrix(sphereMatrix);
    
    
    
    
    
    
    // MOUSE EVENTS
    if (mouseDown) {
        var rotationMatrixX = new THREE.Matrix4().makeRotationY(
            (rotationSpeed * -mouseX) / window.innerWidth);
        var rotationMatrixY = new THREE.Matrix4().makeRotationX(
            (rotationSpeed *  mouseY) / window.innerWidth);
        rotationMatrix = new THREE.Matrix4().multiplyMatrices(rotationMatrixX, rotationMatrixY);
        sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, rotationMatrix);
    }
    
    
    
    
    
    
    
    
    
    }
}




// KEYBOARD CONTROL
var rotationSpeed = Math.PI/32;

var keyboard = new THREEx.KeyboardState();
keyboard.domElement.addEventListener('keydown', keyEvent);

var freeze = true;
function keyEvent(event) {
    // helper grid (convenient for debugging)
    if(keyboard.eventMatches(event, "Z")) {
        grid_state = !grid_state;
        grid_state? scene.add(grid) : scene.remove(grid);
    }
    // freeze behaviour (convenient for debugging)
    else if(keyboard.eventMatches(event, "space")) {
        freeze = !freeze;
    }
    
    // ARROW KEYS
    else if(keyboard.eventMatches(event, "right")) {
        rotationMatrix = new THREE.Matrix4().makeRotationY(-rotationSpeed);
        sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "left")) {
        rotationMatrix = new THREE.Matrix4().makeRotationY(rotationSpeed);
        sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "up")) {
        rotationMatrix = new THREE.Matrix4().makeRotationX(-rotationSpeed);
        sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "down")) {
        rotationMatrix = new THREE.Matrix4().makeRotationX(rotationSpeed);
        sphereMatrix = new THREE.Matrix4().multiplyMatrices(sphereMatrix, rotationMatrix);
    }
    
    
};

// MOUSE CONTROL
var rotationSpeeda = Math.PI;

var mouseDown = false;
var mouseX;
var mouseY;

document.addEventListener('mousedown', function(event) {
    mouseDown = true;  });
document.addEventListener('mouseup', function(event) {
    mouseDown = false; });
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX - (window.innerWidth / 2);
    mouseY = event.clientY - (window.innerHeight / 2);
});





// SETUP UPDATE CALL-BACK
function update() {
    updateWorld();
    
    requestAnimationFrame(update);
    renderer.render(scene,camera);
}

update();
