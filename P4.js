
var scene = new THREE.Scene();
var clock = new THREE.Clock(true);

var difficulty = 1; // 1 = normal, 2 = hard, 3 = easy
var timeRemaining = 120;
var size = 5;
var goal = 30;
document.getElementById("goal").innerHTML = "Goal: " + parseInt(goal);

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

// Lighting and materials

var lightColor = new THREE.Color(1, 1, 1);
var ambientColor = new THREE.Color(0.4, 0.4, 0.4);
var lightPosition = new THREE.Vector3(20, 60, 20);

var kAmbient = new THREE.Color(0.4,0.2,0.4);
var kDiffuse = new THREE.Color(0.8,0.1,0.8);
var kSpecular = new THREE.Color(0.8,0.5,0.8);

var shininess = 10.0;

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'c', value: kAmbient},
        kDiffuse: {type: 'c', value: kDiffuse},
        kSpecular: {type: 'c', value:kSpecular},
        shininess: {type: 'f', value:shininess},
    },
});

var shaderFiles = [
    'glsl/phong.vs.glsl',
    'glsl/phong.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
    phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
    phongMaterial.needsUpdate = true;
});

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
    speed: 0.5,
    rotationSpeed: Math.PI/32,
    sizeIncrRate: 0.2,
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
    initAmount: 10,
    radius: {min: 1, max: 3},
    sph: [],
      // mesh
      // pos
      // rad
};

var mSphere = {
    initAmount: 5,
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
    transparent: true, opacity: 0.5,
});
pSphere.mesh = new THREE.Mesh(geometry, material);
pSphere.mat = new THREE.Matrix4().identity();
pSphere.mesh.setMatrix(pSphere.mat);
scene.add(pSphere.mesh);
pSphere.mesh.add(camera);

// sSphere
material = new THREE.MeshNormalMaterial();
function generateSSphere() {
    // create sphere object
    var newSphere = {};
    
    // set radius
    var rad = getRandom(sSphere.radius.min, sSphere.radius.max);
    newSphere["rad"] = rad;
    
    // create mesh
    newSphere["mesh"] = new THREE.Mesh(geometry, phongMaterial); // material can be used instead
    newSphere.mesh.setMatrix(new THREE.Matrix4().identity());
    geometry = new THREE.SphereGeometry(rad, 32, 32);
    
    // set location (translate to random location)
    var posX = getRandom(-envirn.size, envirn.size);
    var posY = getRandom(-envirn.size, envirn.size);
    var posZ = getRandom(-envirn.size, envirn.size);
    newSphere["pos"] = new THREE.Vector3(posX, posY, posZ);
    var translationMatrix = new THREE.Matrix4().makeTranslation(posX, posY, posZ);
    newSphere.mesh.applyMatrix(translationMatrix);
    
    // add to scene
    scene.add(newSphere.mesh);
    
    return newSphere;
}

for (var i = 0; i < sSphere.initAmount; i++) {
    sSphere.sph.push(generateSSphere());
}

//sun
geometry = new THREE.SphereGeometry(5, 32, 32);
material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./sun.jpg')
    }
);
var sun = new THREE.Mesh(geometry, material);
var translationMatrix = new THREE.Matrix4().makeTranslation(20, 60, 20);
sun.applyMatrix(translationMatrix);
scene.add(sun);


// UPDATE FUNCTION
function updateWorld() {
	updateTime();
	updateSize();
    if (!freeze){
    
    // MOVE FORWARD
    var translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, gameCtrl.speed);
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
    
    // COLLISION DETECTION
    
    // identify current position of pSphere
    var pos = new THREE.Vector4(0, 0, 0, 1);
    pos.applyMatrix4(pSphere.mat);
    pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    
    // collision detection
    for (var i = 0; i < sSphere.sph.length; i++) {
        // calculate distance between pSphere and sSphere
        var dx = Math.abs(pos.x - sSphere.sph[i].pos.x);
        var dy = Math.abs(pos.y - sSphere.sph[i].pos.y);
        var dz = Math.abs(pos.z - sSphere.sph[i].pos.z);
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // calculate distance minus radii
        dist = dist + sSphere.sph[i].rad - pSphere.radius; // completely inside pSphere
        //dist = dist - sSphere.sph[i].rad - pSphere.radius; // actual collision
        
        // if dist <= 0, collided
        if (dist <= 0) {
            console.log("Gulp! " + i);
            pSphere.radius = pSphere.radius + (gameCtrl.sizeIncrRate * sSphere.sph[i].rad);
            var geometry = new THREE.SphereGeometry(pSphere.radius, 32, 32);
            pSphere.mesh.geometry = geometry;
            scene.remove(sSphere.sph[i].mesh);
            sSphere.sph.splice(i, 1);
            i--;
            sSphere.sph.push(generateSSphere());
        }
    
    }
    
    
    
    
    
    
    }
}

function updateDifficulty() {
	var text = "";
	if (difficulty == 1) {
		text = "Difficulty: normal";
	}
	if (difficulty == 2) {
		text = "Difficulty: hard";
	}
	if (difficulty == 3) {
		text = "Difficulty: easy";
	}
	document.getElementById("difficulty").innerHTML = text;
}

function updateTime() {
	if (timeRemaining == 0) {
		// implement game over
		return;
	}
	timeRemaining = Math.floor(120 - clock.getElapsedTime());
	document.getElementById("time").innerHTML = "Time remaining: " + parseInt(timeRemaining);
}

function updateSize() {
	document.getElementById("size").innerHTML = "Size: " + parseInt(size);
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
	
	// toggle difficulty
	else if(keyboard.eventMatches(event, "t")) {
		if (difficulty == 3) {
			difficulty = 1;
		}	
		else {
			difficulty = difficulty + 1
			};
		updateDifficulty();
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
