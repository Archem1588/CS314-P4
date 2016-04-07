var scene = new THREE.Scene();
var clock = new THREE.Clock(false);

// PARTICLE CREATION


var particleSystem = new THREE.Points();
var dirs = [];

function createParticleSystem(x, y, z, r) {

    // The number of particles in a particle system is not easily changed.
    var particleCount = 100;

    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices
    var particles = new THREE.Geometry();

    // Create the vertices and add them to the particles geometry
    for (var p = 0; p < particleCount; p++) {

        // Create the vertex
        var pX = x + Math.floor(Math.random() * (2 * r) - r);
        var pY = y + Math.floor(Math.random() * (2 * r) - r);
        var pZ = z + Math.floor(Math.random() * (2 * r) - r);

        var particle = new THREE.Vector3(pX, pY, pZ);

        // Add the vertex to the geometry
        particles.vertices.push(particle);
        dirs.push({
            x: (Math.random() * 5) - (5 / 2),
            y: (Math.random() * 5) - (5 / 2),
            z: (Math.random() * 5) - (5 / 2)
        });

    }

// Create the material that will be used to render each vertex of the geometry
    var particleMaterial = new THREE.PointsMaterial(
        {
            color: 0xffffff,
            size: 4,
            map: THREE.ImageUtils.loadTexture("./particle.jpg"),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

// Create the particle system
    particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.sortParticles = true;

    return particleSystem;
}

// PARTICLE ANIMATION
function animateParticles() {
    var deltaTime = clock.getDelta();
    var verts = particleSystem.geometry.vertices;
    for (var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        vert.x += dirs[i].x;
        vert.y += dirs[i].y;
        vert.z += dirs[i].z;
        //vert.x = vert.x - (10 * deltaTime);
        //vert.y = vert.y - (10 * deltaTime);
        //vert.z = vert.z - (10 * deltaTime);
    }
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.rotation.x -= .1 * Math.random() * deltaTime;
    particleSystem.rotation.y -= .1 * Math.random() * deltaTime
    particleSystem.rotation.z -= .1 * Math.random() * deltaTime;

}

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(0, 0, -100);
//camera.position.set(150, 150, -150); // for debugging, delete after
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Lighting and materials

var lightColor = new THREE.Color(1, 1, 1);
var ambientColor = new THREE.Color(0.4, 0.4, 0.4);
var lightPosition = new THREE.Vector3(20, 60, 20);

var kAmbient = new THREE.Color(0.4, 0.2, 0.4);
var kDiffuse = new THREE.Color(0.8, 0.1, 0.8);
var kSpecular = new THREE.Color(0.8, 0.5, 0.8);

var shininess = 10.0;

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'c', value: kAmbient},
        kDiffuse: {type: 'c', value: kDiffuse},
        kSpecular: {type: 'c', value: kSpecular},
        shininess: {type: 'f', value: shininess},
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
for (var i = -gridSize; i < (gridSize + 1); i += 2) {
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, -gridSize));
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, gridSize));
    gridGeometry.vertices.push(new THREE.Vector3(-gridSize, 0, i));
    gridGeometry.vertices.push(new THREE.Vector3(gridSize, 0, i));
}

var gridMaterial = new THREE.LineBasicMaterial({color: 0xBBBBBB});
var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
var grid_state = true;
scene.add(grid);

// SETTING MATRIX
THREE.Object3D.prototype.setMatrix = function (a) {
    this.matrix = a;
    this.matrix.decompose(this.position, this.quaternion, this.scale);
}

// USEFUL FUNCTIONS
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function getRandomAngle() {
    return Math.random() * (2 * Math.PI);
}
function getRandomRotationMatrix() {
    var rotationMatrixX = new THREE.Matrix4().makeRotationY(getRandomAngle());
    var rotationMatrixY = new THREE.Matrix4().makeRotationX(getRandomAngle());
    return new THREE.Matrix4().multiplyMatrices(rotationMatrixX, rotationMatrixY);
}


// VARIABLES
// General variables:
var geometry;
var material;

// Environment
var envirn = {
    size: 40, // box
};

// Game Controls
var gameCtrl = {
    speed: 2.0,
    rotationSpeed: Math.PI / 32,
    sizeIncrRate: 0.4,
};

// Display Board
var display = {
    difficulty: 1, // 1 = normal, 2 = hard, 3 = easy
    timeRemaining: 120,
    goal: 30,
    timeLimit: 120,
};


// Types of spheres:
//   - player sphere      (pSphere)
//   - stationary spheres (sSphere)
//   - mobile spheres     (mSphere)
//   - spiked spheres     (kSphere)

var pSphere = {
    mesh: null,
    mat: null,
    pos: new THREE.Vector3(0, 0, 0),
    // properties
    radius: 5,
    texture: './earthmap.jpg',
};

var sSphere = {
    initAmount: 10,
    radius: {min: 1, max: 3},
    sph: [],
    // rad
    // mesh
    // pos
};

var mSphere = {
    initAmount: 5,
    radius: {min: 2, max: 10},
    speed: 0.8,
    rotChance: 0.01,
    sph: [],
    // rad
    // mesh
    // mat
    // pos
};

var kSphere = {
    initAmount: 5,
    radius: {min: 1, max: 10},
    speed: 0.5,
    rotChance: 0.01,
    sph: [],
      // rad
      // mesh
      // mat
      // pos
};


// DISPLAY BOARD set up
updateDifficulty();
document.getElementById("time").innerHTML = "Time Remaining: " + parseInt(display.timeRemaining);
updateSize();
document.getElementById("goal").innerHTML = "Goal: " + parseInt(display.goal);


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

// mSphere
function generateMSphere() {
    // create sphere object
    var newSphere = {};

    // set radius
    var rad = getRandom(mSphere.radius.min, mSphere.radius.max);
    newSphere["rad"] = rad;

    // create mesh
    newSphere["mesh"] = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial()); // TODO change material
    newSphere.mesh.setMatrix(new THREE.Matrix4().identity());
    geometry = new THREE.SphereGeometry(rad, 32, 32);

    // set initial location and rotation (random)
    var posX = getRandom(-envirn.size, envirn.size);
    var posY = getRandom(-envirn.size, envirn.size);
    var posZ = getRandom(-envirn.size, envirn.size);
    newSphere["pos"] = new THREE.Vector3(posX, posY, posZ);

    var translationMatrix = new THREE.Matrix4().makeTranslation(posX, posY, posZ);
    var rotationMatrix = getRandomRotationMatrix();
    newSphere["mat"] = new THREE.Matrix4().multiplyMatrices(rotationMatrix, translationMatrix);

    newSphere.mesh.setMatrix(newSphere.mat);

    // add to scene
    scene.add(newSphere.mesh);

    return newSphere;
}

for (var i = 0; i < mSphere.initAmount; i++) {
    mSphere.sph.push(generateMSphere());
}

// kSphere
function generateKSphere() {
    // create sphere object
    var newSphere = {};
    
    // set radius
    var rad = getRandom(kSphere.radius.min, kSphere.radius.max);
    newSphere["rad"] = rad;
    
    // create mesh
    newSphere["mesh"] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00FF00})); // TODO change material
    newSphere.mesh.setMatrix(new THREE.Matrix4().identity());
    geometry = new THREE.SphereGeometry(rad, 32, 32);
    
    // set initial location and rotation (random)
    var posX = getRandom(-envirn.size, envirn.size);
    var posY = getRandom(-envirn.size, envirn.size);
    var posZ = getRandom(-envirn.size, envirn.size);
    newSphere["pos"] = new THREE.Vector3(posX, posY, posZ);
    
    var translationMatrix = new THREE.Matrix4().makeTranslation(posX, posY, posZ);
    var rotationMatrix = getRandomRotationMatrix();
    newSphere["mat"] = new THREE.Matrix4().multiplyMatrices(rotationMatrix, translationMatrix);
    
    newSphere.mesh.setMatrix(newSphere.mat);
    
    // add to scene
    scene.add(newSphere.mesh);
    
    return newSphere;
}

for (var i = 0; i < kSphere.initAmount; i++) {
    kSphere.sph.push(generateKSphere());
}



//sun
geometry = new THREE.SphereGeometry(5, 32, 32);
material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./texture/sun.jpg')
    }
);
var sun = new THREE.Mesh(geometry, material);
var translationMatrix = new THREE.Matrix4().makeTranslation(20, 60, 20);
sun.applyMatrix(translationMatrix);
scene.add(sun);


// Picking
var container = document.getElementById('container');

var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;

raycaster = new THREE.Raycaster();
mouseVector = new THREE.Vector2();
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(e) {
    mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / containerHeight);
    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length == 0) {
        document.getElementById("selected").innerHTML = "No Object Selected!";
        return;
    }

    for (var i = 0; i < intersects.length; i++) {
        var intersection = intersects[i],
            obj = intersection.object;
        var vertices = obj.geometry.vertices;
        var radius, closestYIndex, farthestYIndex, first = true;

        for (var j = 0; j < vertices.length; j++) {
            if (first) {
                first = false;
                closestYIndex = j;
                farthestYIndex = j;
            }
            else {
                if (vertices[j].y < vertices[closestYIndex].y) {
                    closestYIndex = j;
                }
                if (vertices[j].y > vertices[farthestYIndex].y) {
                    farthestYIndex = j;
                }
                radius = (vertices[farthestYIndex].y - vertices[closestYIndex].y) / 2;
            }
        }
        document.getElementById("selected").innerHTML = "Selected Object Size: " + parseInt(radius);
    }
};

// UPDATE FUNCTION
function updateWorld() {

    if (!freeze) {
        updateTime();

        // MOVE pSphere
        updatePSphere();

        // MOUSE EVENTS
        if (mouseDown) {
            var rotationMatrixX = new THREE.Matrix4().makeRotationY(
                (gameCtrl.rotationSpeed * -mouseX) / window.innerWidth);
            var rotationMatrixY = new THREE.Matrix4().makeRotationX(
                (gameCtrl.rotationSpeed * mouseY) / window.innerWidth);
            var rotationMatrix = new THREE.Matrix4().multiplyMatrices(rotationMatrixX, rotationMatrixY);
            pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
        }

        // MOVE mSphere
        for (var i = 0; i < mSphere.sph.length; i++) {
            updateMSphere(mSphere.sph[i]);
        }


        // DETECT COLLISION
        for (var i = 0; i < sSphere.sph.length; i++) {
            detectCollision(sSphere.sph, i, generateSSphere);
        }
        for (var i = 0; i < mSphere.sph.length; i++) {
            detectCollision(mSphere.sph, i, generateMSphere);
        }


    }
}

function updatePSphere() {
    var translationMatrix = new THREE.Matrix4().makeTranslation(0, 0,
        ((1 / pSphere.radius) * gameCtrl.speed));
    pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, translationMatrix);

    // update current position of pSphere
    var pos = new THREE.Vector4(0, 0, 0, 1);
    pos.applyMatrix4(pSphere.mat);
    pSphere.pos = new THREE.Vector3(pos.x, pos.y, pos.z);

    pSphere.mesh.setMatrix(pSphere.mat);
}

function updateMSphere(curSphere) {
    var randomNum = Math.random();
    if (randomNum <= mSphere.rotChance) {
        var rotationMatrix = getRandomRotationMatrix();
        curSphere.mat = new THREE.Matrix4().multiplyMatrices(curSphere.mat, rotationMatrix);
    } else {
        var translationMatrix = new THREE.Matrix4().makeTranslation(0, 0,
            ((1 / curSphere.rad) * mSphere.speed));
        curSphere.mat = new THREE.Matrix4().multiplyMatrices(curSphere.mat, translationMatrix);
    }
    // update current position of curSphere
    var pos = new THREE.Vector4(0, 0, 0, 1);
    pos.applyMatrix4(curSphere.mat);
    curSphere.pos = new THREE.Vector3(pos.x, pos.y, pos.z);

    curSphere.mesh.setMatrix(curSphere.mat);
}

// COLLISION DETECTION
function detectCollision(collideSphere, i, generateFunc) {
    // calculate distance between pSphere and collideSphere
    var dx = Math.abs(pSphere.pos.x - collideSphere[i].pos.x);
    var dy = Math.abs(pSphere.pos.y - collideSphere[i].pos.y);
    var dz = Math.abs(pSphere.pos.z - collideSphere[i].pos.z);
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // calculate distance minus radii
    //dist = dist + collideSphere[i].rad - pSphere.radius; // (almost) completely inside pSphere
    dist = dist - collideSphere[i].rad - pSphere.radius; // actual collision

    // collided if dist less than 0
    if (dist <= 0) {
        if (pSphere.radius < collideSphere[i].rad) {
            // TODO explode & game over
            console.log("YOU ARE EATEN!");
        } else {
            console.log("Gulp! " + i);
            pSphere.radius = pSphere.radius + (gameCtrl.sizeIncrRate * collideSphere[i].rad);
            var geometry = new THREE.SphereGeometry(pSphere.radius, 32, 32);
            pSphere.mesh.geometry = geometry;
            updateSize();
            scene.remove(collideSphere[i].mesh);
            particleSystem = createParticleSystem(sSphere.sph[i].pos.x, sSphere.sph[i].pos.y, sSphere.sph[i].pos.z, sSphere.sph[i].rad);
            scene.add(particleSystem);
            collideSphere.splice(i, 1);
            i--;
            collideSphere.push(generateFunc());
        }
    }

}

function updateDifficulty() {
    var text = "";
    if (display.difficulty == 1) {
        text = "Difficulty: normal";
    }
    if (display.difficulty == 2) {
        text = "Difficulty: hard";
    }
    if (display.difficulty == 3) {
        text = "Difficulty: easy";
    }
    document.getElementById("difficulty").innerHTML = text;
}

var isGameOver = false;

function gameEndScenario(s) {
    scene.remove(pSphere.mesh);
    particleSystem = createParticleSystem(pSphere.pos.x, pSphere.pos.y, pSphere.pos.z, pSphere.radius);
    scene.add(particleSystem);
    freeze = true;
    isGameOver = true;
    document.getElementById("endGame").innerHTML = s;
}

function updateTime() {
    //Game Over
    if (display.timeRemaining == 110) {
        gameEndScenario("Game Over!" + "<br />" + "Press Space to Restart");
        return;
    }
    display.timeRemaining = Math.floor(display.timeLimit - clock.getElapsedTime());
    document.getElementById("time").innerHTML = "Time Remaining: " + parseInt(display.timeRemaining);
}

function updateSize() {
    document.getElementById("size").innerHTML = "Current Size: " + parseInt(pSphere.radius);
}

// KEYBOARD CONTROL
var keyboard = new THREEx.KeyboardState();
keyboard.domElement.addEventListener('keydown', keyEvent);

var freeze = true;
function keyEvent(event) {
    // helper grid (convenient for debugging)
    if (keyboard.eventMatches(event, "Z")) {
        grid_state = !grid_state;
        grid_state ? scene.add(grid) : scene.remove(grid);
    }
    // freeze behaviour (convenient for debugging)
    else if (keyboard.eventMatches(event, "space")) {
        if (!isGameOver) {
            freeze = !freeze;
            if (freeze) {
                clock.stop();
                document.getElementById("endGame").innerHTML = "Game Paused";
            }
            if (!freeze) {
                clock.start();
                document.getElementById("endGame").innerHTML = "";
            }
        }
        else {
            location.reload();
        }
    }

    // ARROW KEYS
    else if (keyboard.eventMatches(event, "right")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if (keyboard.eventMatches(event, "left")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if (keyboard.eventMatches(event, "up")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationX(-gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }
    else if (keyboard.eventMatches(event, "down")) {
        var rotationMatrix = new THREE.Matrix4().makeRotationX(gameCtrl.rotationSpeed);
        pSphere.mat = new THREE.Matrix4().multiplyMatrices(pSphere.mat, rotationMatrix);
    }

    // toggle difficulty
    else if (keyboard.eventMatches(event, "t")) {
        if (difficulty == 3) {
            difficulty = 1;
        }
        else {
            difficulty = difficulty + 1
        }
        ;
        updateDifficulty();
    }
};

// MOUSE CONTROL
var mouseDown = false;
var mouseX;
var mouseY;

document.addEventListener('mousedown', function (event) {
    mouseDown = true;
});
document.addEventListener('mouseup', function (event) {
    mouseDown = false;
});
document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX - (window.innerWidth / 2);
    mouseY = event.clientY - (window.innerHeight / 2);
});


// fps display
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb

// align left
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);


// SETUP UPDATE CALL-BACK
function update() {
    stats.begin();
    updateWorld();
    stats.end();
    animateParticles();
    requestAnimationFrame(update);
    renderer.render(scene, camera)
}

update();


