
var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(0, 0, -100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

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

// USEFUL FUNCTIONS
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};




// VARIABLES
// General variables:
var geometry;
var material;

// Environment
var envirn = {
    size: 100, // box
};

// Game Controls
var gameCtrl = {
    rotationSpeed: Math.PI/32,
};

// Types of spheres:
//   - player sphere      (pSphere)
//   - stationary spheres (sSphere)
//   - mobile spheres     (mSphere)
//   - spiked spheres     (kSphere)

var pSphere = {
    mesh: null,
    mat: null,
    // properties
    radius: 5,
    texture: './earthmap.jpg',
};

var sSphere = {
    mesh: [],
    initialAmount: 30,
    radius: {min: 1, max: 3},
};

var mSphere = {
    radius: {min: 5, max: 10},
};

var kSphere = {
    radius: {min: 1, max: 10},
};




// CREATING OBJECTS
// pSphere
geometry = new THREE.SphereGeometry(pSphere.radius, 32, 32);
material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(pSphere.texture),
});
pSphere.mesh = new THREE.Mesh(geometry, material);
pSphere.mat = new THREE.Matrix4().identity();
pSphere.mesh.setMatrix(pSphere.mat);
scene.add(pSphere.mesh);
pSphere.mesh.add(camera);

// sSphere
material = new THREE.MeshNormalMaterial();
for (var i = 0; i < sSphere.initialAmount; i++) {
    // create spheres
    var rad = getRandom(sSphere.radius.min, sSphere.radius.max);
    geometry = new THREE.SphereGeometry(rad, 32, 32);
    sSphere.mesh[i] = new THREE.Mesh(geometry, material);
    
    // translate to random location in environment
    var posX = getRandom(-envirn.size, envirn.size);
    var posY = getRandom(-envirn.size, envirn.size);
    var posZ = getRandom(-envirn.size, envirn.size);
    var translationMatrix = new THREE.Matrix4().makeTranslation(posX, posY, posZ);
    sSphere.mesh[i].applyMatrix(translationMatrix);
    
    // add to scene
    scene.add(sSphere.mesh[i]);
}





// UPDATE FUNCTION
function updateWorld() {
    if (!freeze){
    
    
    var translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, 0.3);
    pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, translationMatrix);
    pSphere.mesh.setMatrix(pSphere.mat);
    
    
    
    
    
    
    // MOUSE EVENTS
    if (mouseDown) {
        var rotationMatrixX = new THREE.Matrix4().makeRotationY(
            (gameCtrl.rotationSpeed * -mouseX) / window.innerWidth);
        var rotationMatrixY = new THREE.Matrix4().makeRotationX(
            (gameCtrl.rotationSpeed *  mouseY) / window.innerWidth);
        var rotationMatrix = new THREE.Matrix4().multiplyMatrices(rotationMatrixX, rotationMatrixY);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    
    
    
    
    
    
    
    
    
    }
}




// KEYBOARD CONTROL
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
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "left")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "up")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationX(-gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if(keyboard.eventMatches(event, "down")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationX(gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    
    
};

// MOUSE CONTROL
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
